import api from '../lib/api'
import {
  Product, Purchase, Order, Profile, SiteSettings,
  CreateOrderResponse, AdminStats, DashboardStats
} from '../types'

// ─── Products ─────────────────────────────────────────────────────────────────
export const productService = {
  getAll: () => api.get<{ success: boolean; data: Product[] }>('/products').then(r => r.data.data),
  getBySlug: (slug: string) => api.get<{ success: boolean; data: Product }>(`/products/${slug}`).then(r => r.data.data),
  getSettings: () => api.get<{ success: boolean; data: SiteSettings }>('/products/settings').then(r => r.data.data),
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export const paymentService = {
  createOrder: (productId: string, planId: string) =>
    api.post<{ success: boolean; data: CreateOrderResponse }>('/payment/create-order', { productId, planId })
      .then(r => r.data.data),

  verifyPayment: (payload: {
    orderId: string
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
  }) => api.post<{ success: boolean; data: { orderId: string; purchaseId: string } }>('/payment/verify', payload)
    .then(r => r.data.data),

  saveCustomerInfo: (payload: {
    orderId: string
    fullName: string
    phone: string
    discordUsername?: string
  }) => api.post('/payment/customer-info', payload).then(r => r.data),

  getOrder: (id: string) =>
    api.get<{ success: boolean; data: Order }>(`/payment/order/${id}`).then(r => r.data.data),
}

// ─── Purchases ────────────────────────────────────────────────────────────────
export const purchaseService = {
  getAll: () =>
    api.get<{ success: boolean; data: Purchase[] }>('/purchases').then(r => r.data.data),

  getById: (id: string) =>
    api.get<{ success: boolean; data: Purchase }>(`/purchases/${id}`).then(r => r.data.data),

  getStats: () =>
    api.get<{ success: boolean; data: DashboardStats }>('/purchases/stats').then(r => r.data.data),
}

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profileService = {
  get: () => api.get<{ success: boolean; data: Profile }>('/profile').then(r => r.data.data),

  update: (data: Partial<Pick<Profile, 'full_name' | 'phone' | 'discord_username'>>) =>
    api.patch<{ success: boolean; data: Profile }>('/profile', data).then(r => r.data.data),
}

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminService = {
  getStats: () =>
    api.get<{ success: boolean; data: AdminStats }>('/admin/stats').then(r => r.data.data),

  getOrders: (params?: Record<string, string | number>) =>
    api.get('/admin/orders', { params }).then(r => r.data),

  getOrderById: (id: string) =>
    api.get(`/admin/orders/${id}`).then(r => r.data.data),

  getProducts: () =>
    api.get('/admin/products').then(r => r.data.data),

  createProduct: (data: unknown) =>
    api.post('/admin/products', data).then(r => r.data.data),

  updateProduct: (id: string, data: unknown) =>
    api.put(`/admin/products/${id}`, data).then(r => r.data.data),

  toggleProductActive: (id: string, active: boolean) =>
    api.patch(`/admin/products/${id}/active`, { active }).then(r => r.data.data),

  createPlan: (productId: string, data: unknown) =>
    api.post(`/admin/products/${productId}/plans`, data).then(r => r.data.data),

  updatePlan: (id: string, data: unknown) =>
    api.put(`/admin/plans/${id}`, data).then(r => r.data.data),

  getCustomers: (params?: Record<string, string | number>) =>
    api.get('/admin/customers', { params }).then(r => r.data),

  getCustomerPurchases: (userId: string) =>
    api.get(`/admin/customers/${userId}/purchases`).then(r => r.data.data),

  getSettings: () =>
    api.get('/admin/settings').then(r => r.data.data),

  updateSettings: (data: unknown) =>
    api.put('/admin/settings', data).then(r => r.data.data),
}
