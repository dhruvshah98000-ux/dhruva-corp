import { Router } from 'express'
import { getProducts, getProductBySlug, getSiteSettings } from '../controllers/productController'

const router = Router()

router.get('/', getProducts)
router.get('/settings', getSiteSettings)
router.get('/:slug', getProductBySlug)

export default router
