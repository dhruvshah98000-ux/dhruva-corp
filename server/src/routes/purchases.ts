import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { getPurchases, getPurchaseById, getPurchaseStats } from '../controllers/purchaseController'

const router = Router()

router.use(requireAuth)

router.get('/', getPurchases)
router.get('/stats', getPurchaseStats)
router.get('/:id', getPurchaseById)

export default router
