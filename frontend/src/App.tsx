import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Public pages
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { ProductsPage } from './pages/ProductsPage'
import { SupportPage } from './pages/SupportPage'
import { TermsPage } from './pages/TermsPage'
import { PrivacyPage } from './pages/PrivacyPage'

// Payment pages
import { CheckoutPage } from './pages/payment/CheckoutPage'
import { PaymentSuccessPage } from './pages/payment/PaymentSuccessPage'
import { PaymentFailedPage } from './pages/payment/PaymentFailedPage'
import { CustomerInfoPage } from './pages/payment/CustomerInfoPage'

// Dashboard pages
import { DashboardPage } from './pages/dashboard/DashboardPage'
import { PurchasesPage } from './pages/dashboard/PurchasesPage'
import { PurchaseDetailPage } from './pages/dashboard/PurchaseDetailPage'
import { ProfilePage } from './pages/ProfilePage'

// Admin pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminOrderDetailPage } from './pages/admin/AdminOrderDetailPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'

// Route guards
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute'

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />

      {/* Payment (protected) */}
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
      <Route path="/payment/failed" element={<ProtectedRoute><PaymentFailedPage /></ProtectedRoute>} />
      <Route path="/payment/customer-info" element={<ProtectedRoute><CustomerInfoPage /></ProtectedRoute>} />

      {/* Dashboard (protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/dashboard/purchases" element={<ProtectedRoute><PurchasesPage /></ProtectedRoute>} />
      <Route path="/dashboard/purchases/:id" element={<ProtectedRoute><PurchaseDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Admin (protected + admin role) */}
      <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailPage /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
      <Route path="/admin/customers" element={<AdminRoute><AdminCustomersPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
