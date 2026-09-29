import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabase'
import { razorpay, verifyPaymentSignature } from '../lib/razorpay'
import { CreateOrderInput, VerifyPaymentInput, CustomerInfoInput } from '../validators/payment'
import { addDays } from '../utils/date'

// POST /api/payment/create-order
export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const userEmail = req.userEmail!
  const { productId, planId } = req.body as CreateOrderInput

  try {
    // 1. Fetch product & plan from DB — NEVER trust price from frontend
    const { data: product, error: pErr } = await supabaseAdmin
      .from('products')
      .select('id, name, active')
      .eq('id', productId)
      .eq('active', true)
      .single()

    if (pErr || !product) {
      res.status(404).json({ success: false, error: 'Product not found or inactive' })
      return
    }

    const { data: plan, error: plErr } = await supabaseAdmin
      .from('product_plans')
      .select('id, product_id, name, price_inr, duration_days, active')
      .eq('id', planId)
      .eq('product_id', productId)
      .eq('active', true)
      .single()

    if (plErr || !plan) {
      res.status(404).json({ success: false, error: 'Plan not found or inactive' })
      return
    }

    const amountInPaise = Math.round(plan.price_inr * 100) // Razorpay works in paise

    // 2. Create Razorpay order
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `dhruva_${Date.now()}`,
      notes: {
        userId,
        productId,
        planId,
      },
    })

    // 3. Save internal order record (status = pending)
    const { data: order, error: oErr } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        product_id: productId,
        plan_id: planId,
        razorpay_order_id: rzpOrder.id,
        amount: plan.price_inr,
        currency: 'INR',
        status: 'pending',
        customer_email: userEmail,
      })
      .select()
      .single()

    if (oErr || !order) {
      console.error('[createOrder] DB insert failed', oErr)
      res.status(500).json({ success: false, error: 'Failed to create order' })
      return
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        razorpayOrderId: rzpOrder.id,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID!,
      },
    })
  } catch (err) {
    console.error('[createOrder]', err)
    res.status(500).json({ success: false, error: 'Failed to create order' })
  }
}

// POST /api/payment/verify
export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.body as VerifyPaymentInput

  try {
    // 1. Fetch order from DB and confirm it belongs to this user
    const { data: order, error: oErr } = await supabaseAdmin
      .from('orders')
      .select('*, product:products(*), plan:product_plans(*)')
      .eq('id', orderId)
      .eq('user_id', userId)
      .eq('razorpay_order_id', razorpayOrderId)
      .single()

    if (oErr || !order) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    if (order.status === 'paid') {
      res.json({ success: true, data: { orderId, alreadyPaid: true } })
      return
    }

    if (order.status !== 'pending') {
      res.status(400).json({ success: false, error: `Order is ${order.status}` })
      return
    }

    // 2. Verify Razorpay signature — server-side ONLY
    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)
    if (!isValid) {
      // Mark as failed
      await supabaseAdmin
        .from('orders')
        .update({ status: 'failed' })
        .eq('id', orderId)

      res.status(400).json({ success: false, error: 'Payment verification failed: invalid signature' })
      return
    }

    // 3. Double-check with Razorpay API
    const rzpPayment = await razorpay.payments.fetch(razorpayPaymentId)
    if (rzpPayment.status !== 'captured' && rzpPayment.status !== 'authorized') {
      await supabaseAdmin.from('orders').update({ status: 'failed' }).eq('id', orderId)
      res.status(400).json({ success: false, error: 'Payment not captured by Razorpay' })
      return
    }

    const now = new Date()

    // 4. Update order → paid
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'paid',
        razorpay_payment_id: razorpayPaymentId,
        paid_at: now.toISOString(),
      })
      .eq('id', orderId)

    if (updateErr) {
      console.error('[verifyPayment] order update failed', updateErr)
      res.status(500).json({ success: false, error: 'Failed to update order' })
      return
    }

    // 5. Calculate expiry on the server — never trust frontend
    const plan = order.plan
    const expiresAt =
      plan.duration_days !== null
        ? addDays(now, plan.duration_days).toISOString()
        : null

    const purchaseStatus = plan.duration_days === null ? 'permanent' : 'active'

    // 6. Upsert purchase (idempotent: unique on order_id)
    const { data: purchase, error: puErr } = await supabaseAdmin
      .from('purchases')
      .upsert(
        {
          user_id: userId,
          order_id: orderId,
          product_id: order.product_id,
          plan_id: order.plan_id,
          product_name_snapshot: order.product.name,
          plan_name_snapshot: plan.name,
          amount_paid: order.amount,
          purchased_at: now.toISOString(),
          starts_at: now.toISOString(),
          expires_at: expiresAt,
          status: purchaseStatus,
        },
        { onConflict: 'order_id', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (puErr) {
      console.error('[verifyPayment] purchase upsert failed', puErr)
      res.status(500).json({ success: false, error: 'Failed to create purchase record' })
      return
    }

    res.json({
      success: true,
      data: {
        orderId,
        purchaseId: purchase.id,
        message: 'Payment verified and purchase created',
      },
    })
  } catch (err) {
    console.error('[verifyPayment]', err)
    res.status(500).json({ success: false, error: 'Payment verification error' })
  }
}

// POST /api/payment/customer-info
export async function saveCustomerInfo(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const { orderId, fullName, phone, discordUsername } = req.body as CustomerInfoInput

  try {
    // Confirm order belongs to user and is paid
    const { data: order, error: oErr } = await supabaseAdmin
      .from('orders')
      .select('id, status, user_id')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (oErr || !order) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    if (order.status !== 'paid') {
      res.status(400).json({ success: false, error: 'Order has not been paid' })
      return
    }

    // Update order with customer info
    const { error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        customer_name: fullName,
        customer_phone: phone,
        customer_discord: discordUsername || null,
      })
      .eq('id', orderId)

    if (updateErr) throw updateErr

    // Also update user profile
    await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName,
        phone,
        discord_username: discordUsername || null,
      })
      .eq('auth_user_id', userId)

    res.json({ success: true, data: { message: 'Customer information saved' } })
  } catch (err) {
    console.error('[saveCustomerInfo]', err)
    res.status(500).json({ success: false, error: 'Failed to save customer information' })
  }
}

// GET /api/payment/order/:id — get order details (user's own)
export async function getOrder(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const { id } = req.params

  try {
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        product:products(id, name, slug, image_url),
        plan:product_plans(id, name, duration_days, price_inr)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !order) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    res.json({ success: true, data: order })
  } catch (err) {
    console.error('[getOrder]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch order' })
  }
}
