import { Request, Response } from 'express'
import { supabaseAdmin } from '../lib/supabase'

// GET /api/products — public, active products with their active plans
export async function getProducts(_req: Request, res: Response): Promise<void> {
  try {
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        plans:product_plans(*)
      `)
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Filter only active plans
    const result = (products || []).map((p) => ({
      ...p,
      plans: (p.plans || []).filter((pl: { active: boolean }) => pl.active),
    }))

    res.json({ success: true, data: result })
  } catch (err) {
    console.error('[getProducts]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch products' })
  }
}

// GET /api/products/:slug
export async function getProductBySlug(req: Request, res: Response): Promise<void> {
  try {
    const { slug } = req.params

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select(`*, plans:product_plans(*)`)
      .eq('slug', slug)
      .eq('active', true)
      .single()

    if (error || !product) {
      res.status(404).json({ success: false, error: 'Product not found' })
      return
    }

    product.plans = (product.plans || []).filter((p: { active: boolean }) => p.active)

    res.json({ success: true, data: product })
  } catch (err) {
    console.error('[getProductBySlug]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch product' })
  }
}

// GET /api/products/settings — site settings (public)
export async function getSiteSettings(_req: Request, res: Response): Promise<void> {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_settings')
      .select('company_name, logo_url, support_phone, support_email, discord_support_link, currency, footer_text, terms_url, privacy_url')
      .single()

    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    console.error('[getSiteSettings]', err)
    res.status(500).json({ success: false, error: 'Failed to fetch settings' })
  }
}
