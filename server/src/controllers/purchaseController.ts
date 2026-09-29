import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { supabaseAdmin } from '../lib/supabase'

// GET /api/purchases — user's own purchases
export async function getPurchases(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!

  try {
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select(`
        *,
        order:orders(
          id, razorpay_order_id, razorpay_payment_id, status,
          customer_name, customer_email, customer_phone, customer_discord
        )
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false })

    if (error) throw error

    res.json({ success: true, data: data || [] })
  } catch (err) {
    console.error('[getPurchases]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch purchases' })
  }
}

// GET /api/purchases/:id — single purchase (must belong to user)
export async function getPurchaseById(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!
  const { id } = req.params

  try {
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select(`
        *,
        order:orders(
          id, razorpay_order_id, razorpay_payment_id, status, amount, currency,
          customer_name, customer_email, customer_phone, customer_discord, paid_at
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      res.status(404).json({ success: false, error: 'Purchase not found' })
      return
    }

    res.json({ success: true, data })
  } catch (err) {
    console.error('[getPurchaseById]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch purchase' })
  }
}

// GET /api/purchases/stats — dashboard stats
export async function getPurchaseStats(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.userId!

  try {
    const { data, error } = await supabaseAdmin
      .from('purchases')
      .select('status, amount_paid')
      .eq('user_id', userId)

    if (error) throw error

    const purchases = data || []
    const stats = {
      totalPurchases: purchases.length,
      activePurchases: purchases.filter((p) => p.status === 'active' || p.status === 'permanent').length,
      expiredPurchases: purchases.filter((p) => p.status === 'expired').length,
      totalSpent: purchases.reduce((sum, p) => sum + Number(p.amount_paid), 0),
    }

    res.json({ success: true, data: stats })
  } catch (err) {
    console.error('[getPurchaseStats]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch stats' })
  }
}
