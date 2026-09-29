import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import serverless from 'serverless-http'

import productRoutes from '../../server/src/routes/products'
import paymentRoutes from '../../server/src/routes/payment'
import purchaseRoutes from '../../server/src/routes/purchases'
import profileRoutes from '../../server/src/routes/profile'
import adminRoutes from '../../server/src/routes/admin'
import webhookRoutes from '../../server/src/routes/webhook'

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: '*', credentials: true }))

// Webhook needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/webhook', webhookRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export const handler = serverless(app)
