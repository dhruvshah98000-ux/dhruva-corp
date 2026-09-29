const serverless = require('serverless-http')
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

// Load env
require('dotenv').config()

const app = express()

app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({ origin: '*', credentials: true }))

// Webhook raw body — must come before express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Import routes
const productRoutes = require('../../server/src/routes/products')
const paymentRoutes = require('../../server/src/routes/payment')
const purchaseRoutes = require('../../server/src/routes/purchases')
const profileRoutes = require('../../server/src/routes/profile')
const adminRoutes = require('../../server/src/routes/admin')
const webhookRoutes = require('../../server/src/routes/webhook')

app.use('/api/products', productRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/purchases', purchaseRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/webhook', webhookRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

module.exports.handler = serverless(app)
