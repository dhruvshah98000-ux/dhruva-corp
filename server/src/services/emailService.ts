import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, ''), // Remove spaces
  },
})

export interface PurchaseNotificationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerDiscord: string
  productName: string
  planName: string
  amount: number
  orderId: string
  paymentId: string
  purchasedAt: string
  expiresAt: string | null
}

export async function sendPurchaseNotification(data: PurchaseNotificationData): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || !process.env.GMAIL_USER) {
    console.log('[Email] Gmail not configured, skipping notification')
    return
  }

  const expiryText = data.expiresAt
    ? new Date(data.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Permanent / Lifetime'

  const amount = `₹${data.amount.toLocaleString('en-IN')}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #141414; border: 1px solid #333; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1a1a2e, #16213e); padding: 30px; text-align: center; border-bottom: 1px solid #333; }
    .header h1 { margin: 0; font-size: 24px; color: #5a6fff; }
    .header p { margin: 8px 0 0; color: #888; font-size: 14px; }
    .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-top: 10px; }
    .body { padding: 30px; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: bold; color: #5a6fff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #222; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
    .row:last-child { border-bottom: none; }
    .label { color: #888; font-size: 13px; }
    .value { color: #fff; font-size: 13px; font-weight: 500; text-align: right; }
    .amount { color: #5a6fff; font-size: 20px; font-weight: bold; }
    .footer { background: #0d0d0d; padding: 20px 30px; text-align: center; border-top: 1px solid #222; }
    .footer p { color: #555; font-size: 12px; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ DHRUVA CORPORATION</h1>
      <p>New Purchase Alert</p>
      <span class="badge">✅ PAYMENT SUCCESSFUL</span>
    </div>
    <div class="body">
      <div class="section">
        <div class="section-title">💰 Payment Details</div>
        <div class="row">
          <span class="label">Amount Paid</span>
          <span class="value amount">${amount}</span>
        </div>
        <div class="row">
          <span class="label">Product</span>
          <span class="value">${data.productName}</span>
        </div>
        <div class="row">
          <span class="label">Plan</span>
          <span class="value">${data.planName}</span>
        </div>
        <div class="row">
          <span class="label">Expiry</span>
          <span class="value">${expiryText}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👤 Customer Details</div>
        <div class="row">
          <span class="label">Name</span>
          <span class="value">${data.customerName || '—'}</span>
        </div>
        <div class="row">
          <span class="label">Email</span>
          <span class="value">${data.customerEmail || '—'}</span>
        </div>
        <div class="row">
          <span class="label">Phone</span>
          <span class="value">${data.customerPhone || '—'}</span>
        </div>
        <div class="row">
          <span class="label">Discord</span>
          <span class="value">${data.customerDiscord || '—'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🔑 Order Reference</div>
        <div class="row">
          <span class="label">Order ID</span>
          <span class="value" style="font-size:11px; font-family:monospace;">${data.orderId}</span>
        </div>
        <div class="row">
          <span class="label">Payment ID</span>
          <span class="value" style="font-size:11px; font-family:monospace;">${data.paymentId || '—'}</span>
        </div>
        <div class="row">
          <span class="label">Purchase Time</span>
          <span class="value">${new Date(data.purchasedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Dhruva Corporation Admin Panel • Auto-generated notification</p>
    </div>
  </div>
</body>
</html>
  `

  try {
    await transporter.sendMail({
      from: `"Dhruva Corp" <${process.env.GMAIL_USER}>`,
      to: adminEmail,
      subject: `🛍️ New Purchase — ${data.productName} ${data.planName} ${amount}`,
      html,
    })
    console.log('[Email] Purchase notification sent to', adminEmail)
  } catch (err) {
    console.error('[Email] Failed to send notification:', err)
  }
}
