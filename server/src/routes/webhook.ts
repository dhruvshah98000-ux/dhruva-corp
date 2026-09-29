import { Router } from 'express'
import { razorpayWebhook } from '../controllers/webhookController'

const router = Router()

// Raw body needed for signature verification — handled in index.ts
router.post('/razorpay', razorpayWebhook)

export default router
