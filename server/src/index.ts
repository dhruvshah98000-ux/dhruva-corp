import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import productRoutes from './routes/products'
import paymentRoutes from './routes/payment'
import purchaseRoutes from './routes/purchases'
import profileRoutes from './routes/profile'
import adminRoutes from './routes/admin'
import webhookRoutes from './routes/webhook'
import { errorHandler, notFound } from './middleware/errorHandler'

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security headers ────────────────────────────────────────────────────────
app.use(helmet())

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',')
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true)
      else callback(new Error(`CORS not allowed for origin: ${origin}`))
    },
    credentials: true,
  })
)

// ─── Webhook — raw body MUST come before express.json() ─────────────────────
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRoutes)

// ─── Body parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Global rate limiting ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
})

// Stricter limit for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many payment requests. Please try again later.' },
})

app.use('/api', globalLimiter)
app.use('/api/payment', paymentLimiter)

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/products', productRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/admin', adminRoutes)

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─── Error handling ──────────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  Dhruva Corp API running on http://localhost:${PORT}`)
})

export default app
