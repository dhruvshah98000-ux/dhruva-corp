import Razorpay from 'razorpay'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const keyId = process.env.RAZORPAY_KEY_ID
const keySecret = process.env.RAZORPAY_KEY_SECRET

if (!keyId || !keySecret) {
  throw new Error('Missing Razorpay credentials: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required')
}

export const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

/**
 * Verify the Razorpay payment signature returned by the checkout.
 * orderId: razorpay_order_id
 * paymentId: razorpay_payment_id
 * signature: razorpay_signature
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`
  const expected = crypto
    .createHmac('sha256', keySecret!)
    .update(body)
    .digest('hex')
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
}

/**
 * Verify Razorpay webhook signature.
 * body: raw request body (Buffer or string)
 * signature: X-Razorpay-Signature header value
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET not configured')
    return false
  }
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(body)
    .digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}
