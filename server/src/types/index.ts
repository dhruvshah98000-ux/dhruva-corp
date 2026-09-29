import { Request } from 'express'

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
export type PurchaseStatus = 'active' | 'expired' | 'permanent' | 'cancelled' | 'refunded'

export interface Profile {
  id: string
  auth_user_id: string
  full_name: string | null
  email: string
  phone: string | null
  discord_username: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  features: string[]
  category: string
  image_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface ProductPlan {
  id: string
  product_id: string
  name: string
  duration_days: number | null
  price_inr: number
  active: boolean
  created_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  plan_id: string
  razorpay_order_id: string
  razorpay_payment_id: string | null
  amount: number
  currency: string
  status: OrderStatus
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  customer_discord: string | null
  created_at: string
  paid_at: string | null
  updated_at: string
}

export interface Purchase {
  id: string
  user_id: string
  order_id: string
  product_id: string
  plan_id: string
  product_name_snapshot: string
  plan_name_snapshot: string
  amount_paid: number
  purchased_at: string
  starts_at: string
  expires_at: string | null
  status: PurchaseStatus
}

export interface AuthenticatedRequest extends Request {
  userId?: string
  userEmail?: string
}
