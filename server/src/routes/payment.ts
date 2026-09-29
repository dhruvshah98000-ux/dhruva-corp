import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { createOrderSchema, verifyPaymentSchema, customerInfoSchema } from '../validators/payment'
import {
  createOrder,
  verifyPayment,
  saveCustomerInfo,
  getOrder,
} from '../controllers/paymentController'

const router = Router()

router.use(requireAuth)

router.post('/create-order', validate(createOrderSchema), createOrder)
router.post('/verify', validate(verifyPaymentSchema), verifyPayment)
router.post('/customer-info', validate(customerInfoSchema), saveCustomerInfo)
router.get('/order/:id', getOrder)

export default router
