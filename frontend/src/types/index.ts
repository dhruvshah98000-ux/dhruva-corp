// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
}

// ─── Profile ─────────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  discord_username: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  category: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
  plans?: ProductPlan[];
}

export interface ProductPlan {
  id: string;
  product_id: string;
  name: string;
  duration_days: number | null; // null = permanent
  price_inr: number;
  active: boolean;
  created_at: string;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_discord: string | null;
  created_at: string;
  paid_at: string | null;
  updated_at: string;
  product?: Product;
  plan?: ProductPlan;
}

// ─── Purchase ────────────────────────────────────────────────────────────────
export type PurchaseStatus = 'active' | 'expired' | 'permanent' | 'cancelled' | 'refunded';

export interface Purchase {
  id: string;
  user_id: string;
  order_id: string;
  product_id: string;
  plan_id: string;
  product_name_snapshot: string;
  plan_name_snapshot: string;
  amount_paid: number;
  purchased_at: string;
  starts_at: string;
  expires_at: string | null; // null = permanent
  status: PurchaseStatus;
  order?: Order;
}

// ─── Site Settings ───────────────────────────────────────────────────────────
export interface SiteSettings {
  id: string;
  company_name: string;
  logo_url: string | null;
  support_phone: string | null;
  support_email: string | null;
  discord_support_link: string | null;
  currency: string;
  footer_text: string | null;
  terms_url: string | null;
  privacy_url: string | null;
  updated_at: string;
}

// ─── Admin ───────────────────────────────────────────────────────────────────
export interface AdminRole {
  id: string;
  user_id: string;
  created_at: string;
}

// ─── API Response wrappers ───────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface CustomerInfoRequest {
  orderId: string;
  fullName: string;
  phone: string;
  discordUsername?: string;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  totalPurchases: number;
  activePurchases: number;
  expiredPurchases: number;
  totalSpent: number;
}

export interface AdminStats {
  totalOrders: number;
  successfulPayments: number;
  pendingPayments: number;
  failedPayments: number;
  totalRevenue: number;
  activePurchases: number;
  expiredPurchases: number;
  totalCustomers: number;
}
