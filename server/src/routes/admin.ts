import { Router } from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { validate } from '../middleware/validate'
import {
  createProductSchema, updateProductSchema,
  createPlanSchema, updatePlanSchema, updateSettingsSchema
} from '../validators/admin'
import {
  getAdminStats,
  getAdminOrders, getAdminOrderById,
  getAdminProducts, createProduct, updateProduct, toggleProductActive,
  createPlan, updatePlan,
  getAdminCustomers, getAdminCustomerPurchases,
  getAdminSettings, updateAdminSettings,
} from '../controllers/adminController'

const router = Router()

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin)

// Dashboard
router.get('/stats', getAdminStats)

// Orders
router.get('/orders', getAdminOrders)
router.get('/orders/:id', getAdminOrderById)

// Products
router.get('/products', getAdminProducts)
router.post('/products', validate(createProductSchema), createProduct)
router.put('/products/:id', validate(updateProductSchema), updateProduct)
router.patch('/products/:id/active', toggleProductActive)

// Plans
router.post('/products/:productId/plans', validate(createPlanSchema), createPlan)
router.put('/plans/:id', validate(updatePlanSchema), updatePlan)

// Customers
router.get('/customers', getAdminCustomers)
router.get('/customers/:userId/purchases', getAdminCustomerPurchases)

// Settings
router.get('/settings', getAdminSettings)
router.put('/settings', validate(updateSettingsSchema), updateAdminSettings)

export default router
