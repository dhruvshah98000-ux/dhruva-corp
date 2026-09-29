import { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'
import {
  CreateProductInput, UpdateProductInput,
  CreatePlanInput, UpdatePlanInput, UpdateSettingsInput
} from '../validators/admin'

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export async function getAdminStats(_req: Request, res: Response): Promise<void> {
  try {
    const [ordersRes, purchasesRes, customersRes] = await Promise.all([
      supabaseAdmin.from('orders').select('status, amount'),
      supabaseAdmin.from('purchases').select('status'),
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    const orders = ordersRes.data || []
    const purchases = purchasesRes.data || []

    const stats = {
      totalOrders: orders.length,
      successfulPayments: orders.filter((o) => o.status === 'paid').length,
      pendingPayments: orders.filter((o) => o.status === 'pending').length,
      failedPayments: orders.filter((o) => o.status === 'failed').length,
      totalRevenue: orders
        .filter((o) => o.status === 'paid')
        .reduce((sum, o) => sum + Number(o.amount), 0),
      activePurchases: purchases.filter((p) => p.status === 'active' || p.status === 'permanent').length,
      expiredPurchases: purchases.filter((p) => p.status === 'expired').length,
      totalCustomers: customersRes.count || 0,
    }

    res.json({ success: true, data: stats })
  } catch (err) {
    console.error('[getAdminStats]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch stats' })
  }
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function getAdminOrders(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const status = req.query.status as string | undefined
    const search = req.query.search as string | undefined
    const productId = req.query.productId as string | undefined
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('orders')
      .select(`
        *,
        product:products(id, name, slug),
        plan:product_plans(id, name, price_inr, duration_days),
        purchase:purchases(id, status, expires_at)
      `, { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (productId) query = query.eq('product_id', productId)
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,razorpay_order_id.ilike.%${search}%`
      )
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    res.json({
      success: true,
      data: data || [],
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
    })
  } catch (err) {
    console.error('[getAdminOrders]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch orders' })
  }
}

export async function getAdminOrderById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        product:products(*),
        plan:product_plans(*),
        purchase:purchases(*)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Order not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[getAdminOrderById]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch order' })
  }
}

// ─── Products ────────────────────────────────────────────────────────────────

export async function getAdminProducts(_req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*, plans:product_plans(*)')
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json({ success: true, data: data || [] })
  } catch (err) {
    console.error('[getAdminProducts]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch products' })
  }
}

export async function createProduct(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as CreateProductInput
    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        res.status(409).json({ success: false, error: 'A product with this slug already exists' })
        return
      }
      throw error
    }

    res.status(201).json({ success: true, data })
  } catch (err) {
    console.error('[createProduct]', err)
    res.status(500).json({ success: false, error: 'Failed to create product' })
  }
}

export async function updateProduct(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const body = req.body as UpdateProductInput

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Product not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[updateProduct]', err)
    res.status(500).json({ success: false, error: 'Failed to update product' })
  }
}

export async function toggleProductActive(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const { active } = req.body as { active: boolean }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ active })
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Product not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[toggleProductActive]', err)
    res.status(500).json({ success: false, error: 'Failed to update product' })
  }
}

// ─── Plans ───────────────────────────────────────────────────────────────────

export async function createPlan(req: Request, res: Response): Promise<void> {
  try {
    const { productId } = req.params
    const body = req.body as CreatePlanInput

    // Verify product exists
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (!product) {
      res.status(404).json({ success: false, error: 'Product not found' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('product_plans')
      .insert({ ...body, product_id: productId })
      .select()
      .single()

    if (error) throw error
    res.status(201).json({ success: true, data })
  } catch (err) {
    console.error('[createPlan]', err)
    res.status(500).json({ success: false, error: 'Failed to create plan' })
  }
}

export async function updatePlan(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params
    const body = req.body as UpdatePlanInput

    const { data, error } = await supabaseAdmin
      .from('product_plans')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Plan not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[updatePlan]', err)
    res.status(500).json({ success: false, error: 'Failed to update plan' })
  }
}

// ─── Customers ───────────────────────────────────────────────────────────────

export async function getAdminCustomers(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const search = req.query.search as string | undefined
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%`
      )
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    const { data: profiles, error, count } = await query
    if (error) throw error

    // Enrich with purchase stats
    const enriched = await Promise.all(
      (profiles || []).map(async (profile) => {
        const { data: purchases } = await supabaseAdmin
          .from('purchases')
          .select('status, amount_paid')
          .eq('user_id', profile.auth_user_id)

        const totalPurchases = purchases?.length || 0
        const totalSpent = (purchases || []).reduce((s, p) => s + Number(p.amount_paid), 0)
        const activePurchases = (purchases || []).filter(
          (p) => p.status === 'active' || p.status === 'permanent'
        ).length

        return { ...profile, totalPurchases, totalSpent, activePurchases }
      })
    )

    res.json({
      success: true,
      data: enriched,
      pagination: { page, limit, total: count || 0, pages: Math.ceil((count || 0) / limit) },
    })
  } catch (err) {
    console.error('[getAdminCustomers]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch customers' })
  }
}

export async function getAdminCustomerPurchases(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params

    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select(`
        *,
        order:orders(razorpay_order_id, razorpay_payment_id, status, paid_at)
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })

    if (error) throw error
    res.json({ success: true, data: data || [] })
  } catch (err) {
    console.error('[getAdminCustomerPurchases]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch customer purchases' })
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getAdminSettings(_req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin.from('site_settings').select('*').single()
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    console.error('[getAdminSettings]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch settings' })
  }
}

export async function updateAdminSettings(req: Request, res: Response): Promise<void> {
  try {
    const body = req.body as UpdateSettingsInput

    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .update(body)
      .not('id', 'is', null)
      .select()
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    console.error('[updateAdminSettings]', err)
    res.status(500).json({ success: false, error: 'Failed to update settings' })
  }
}
