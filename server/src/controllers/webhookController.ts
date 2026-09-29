import { Request, Response } from 'express'
import { verifyWebhookSignature } from '../lib/razorpay'
import { supabaseAdmin } from '../lib/supabase'
import { addDays } from '../utils/date'

interface RazorpayWebhookPayload {
  entity: string
  account_id: string
  event: string
  contains: string[]
  payload: {
    payment?: {
      entity: {
        id: string
        order_id: string
        status: string
        amount: number
        currency: string
      }
    }
    order?: {
      entity: {
        id: string
        status: string
        amount: number
      }
    }
  }
}

// POST /api/webhook/razorpay
export async function razorpayWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers['x-razorpay-signature'] as string

  if (!signature) {
    res.status(400).json({ success: false, error: 'Missing webhook signature' })
    return
  }

  // req.body is a raw Buffer when using express.raw()
  const rawBody = req.body as Buffer
  const bodyStr = rawBody.toString('utf8')

  // 1. Verify webhook signature
  if (!verifyWebhookSignature(bodyStr, signature)) {
    console.warn('[webhook] Invalid signature — rejecting')
    res.status(400).json({ success: false, error: 'Invalid signature' })
    return
  }

  let payload: RazorpayWebhookPayload
  try {
    payload = JSON.parse(bodyStr)
  } catch {
    res.status(400).json({ success: false, error: 'Invalid JSON payload' })
    return
  }

  const event = payload.event
  console.log('[webhook] event:', event)

  try {
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload)
        break
      case 'payment.failed':
        await handlePaymentFailed(payload)
        break
      case 'order.paid':
        await handleOrderPaid(payload)
        break
      default:
        console.log('[webhook] Unhandled event:', event)
    }

    // Always return 200 quickly so Razorpay doesn't retry
    res.status(200).json({ success: true })
  } catch (err) {
    console.error('[webhook] Processing error:', err)
    // Still 200 to prevent Razorpay infinite retries — we log the error
    res.status(200).json({ success: true })
  }
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload): Promise<void> {
  const payment = payload.payload.payment?.entity
  if (!payment) return

  const razorpayOrderId = payment.order_id
  const razorpayPaymentId = payment.id

  // Idempotency: check if order is already paid
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*, plan:product_plans(*), product:products(*)')
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (error || !order) {
    console.warn('[webhook] Order not found for razorpay_order_id:', razorpayOrderId)
    return
  }

  if (order.status === 'paid') {
    console.log('[webhook] Order already marked paid, skipping:', order.id)
    return
  }

  const now = new Date()

  // Update order
  await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      razorpay_payment_id: razorpayPaymentId,
      paid_at: now.toISOString(),
    })
    .eq('id', order.id)

  // Upsert purchase (idempotent)
  const plan = order.plan
  const expiresAt = plan.duration_days ? addDays(now, plan.duration_days).toISOString() : null
  const purchaseStatus = plan.duration_days === null ? 'permanent' : 'active'

  await supabaseAdmin
    .from('purchases')
    .upsert(
      {
        user_id: order.user_id,
        order_id: order.id,
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

  console.log('[webhook] Payment captured processed for order:', order.id)
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload): Promise<void> {
  const payment = payload.payload.payment?.entity
  if (!payment) return

  const { error } = await supabaseAdmin
    .from('orders')
    .update({ status: 'failed' })
    .eq('razorpay_order_id', payment.order_id)
    .eq('status', 'pending') // Only update if still pending

  if (error) console.error('[webhook] Failed to mark order as failed:', error)
  else console.log('[webhook] Marked order as failed for razorpay_order_id:', payment.order_id)
}

async function handleOrderPaid(payload: RazorpayWebhookPayload): Promise<void> {
  // order.paid fires alongside payment.captured — handlePaymentCaptured already covers this
  // We use it as a fallback in case payment.captured wasn't received
  const order = payload.payload.order?.entity
  const payment = payload.payload.payment?.entity
  if (!order || !payment) return

  const { data: existingOrder } = await supabaseAdmin
    .from('orders')
    .select('id, status')
    .eq('razorpay_order_id', order.id)
    .single()

  if (existingOrder && existingOrder.status !== 'paid') {
    console.log('[webhook] order.paid fallback — delegating to payment.captured handler')
    await handlePaymentCaptured(payload)
  }
}
