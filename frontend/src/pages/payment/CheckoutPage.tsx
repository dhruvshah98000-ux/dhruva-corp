import React, { useState, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { paymentService } from '../../services/api'
import { Product, ProductPlan } from '../../types'
import { formatCurrencyRaw } from '../../utils/format'

// Razorpay is loaded via CDN in index.html
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill: { name: string; email: string; contact: string }
  theme: { color: string }
  handler: (response: RazorpayResponse) => void
  modal: { ondismiss: () => void }
}

interface RazorpayInstance {
  open: () => void
}

interface RazorpayResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export const CheckoutPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [processing, setProcessing] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const state = location.state as { product: Product; plan: ProductPlan } | null

  if (!state?.product || !state?.plan) {
    return (
      <MainLayout>
        <div className="page-container text-center py-20">
          <p className="text-dark-400">No product selected.</p>
          <Link to="/products" className="text-brand-400 mt-4 inline-block">← Back to Products</Link>
        </div>
      </MainLayout>
    )
  }

  const { product, plan } = state

  const handlePayNow = useCallback(async () => {
    if (!agreed) { toast.error('Please agree to the Terms and Privacy Policy'); return }
    if (processing) return

    setProcessing(true)

    try {
      // 1. Create order on backend
      const orderData = await paymentService.createOrder(product.id, plan.id)

      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Dhruva Corporation',
        description: `${product.name} — ${plan.name}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
          contact: profile?.phone || '',
        },
        theme: { color: '#5a6fff' },
        handler: async (response: RazorpayResponse) => {
          // 3. Verify on backend
          try {
            const verified = await paymentService.verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success('Payment successful!')
            navigate('/payment/customer-info', {
              state: { orderId: orderData.orderId, purchaseId: verified.purchaseId },
            })
          } catch {
            toast.error('Payment verification failed. Please contact support.')
            navigate('/payment/failed', { state: { orderId: orderData.orderId } })
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast.error('Payment cancelled.')
            navigate('/payment/failed', { state: { orderId: orderData.orderId } })
          },
        },
      })

      rzp.open()
    } catch (err) {
      console.error(err)
      toast.error('Could not initiate payment. Please try again.')
      setProcessing(false)
    }
  }, [agreed, processing, product, plan, user, profile, navigate])

  return (
    <MainLayout>
      <div className="page-container max-w-xl mx-auto">
        <Link to="/products" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Order Summary</h1>

        <Card>
          <CardBody className="space-y-6">
            {/* Product info */}
            <div className="bg-dark-900/60 rounded-xl p-4 space-y-3">
              <div className="text-xs text-brand-400 font-medium uppercase tracking-wider">{product.category}</div>
              <h2 className="text-white font-bold text-lg">{product.name}</h2>
              <p className="text-dark-400 text-sm">{product.description}</p>

              <div className="border-t border-dark-700 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Plan</span>
                  <span className="text-white font-medium">{plan.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Duration</span>
                  <span className="text-white font-medium">
                    {plan.duration_days === null ? 'Permanent / Lifetime' : `${plan.duration_days} days`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Account</span>
                  <span className="text-white font-medium truncate ml-4">{user?.email}</span>
                </div>
              </div>

              <div className="border-t border-dark-700 pt-3 flex justify-between items-center">
                <span className="text-dark-300 font-medium">Total Amount</span>
                <span className="text-brand-400 font-bold text-2xl">{formatCurrencyRaw(plan.price_inr)}</span>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500/50"
              />
              <span className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-brand-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" target="_blank" className="text-brand-400 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Button
              fullWidth
              size="lg"
              onClick={handlePayNow}
              loading={processing}
              disabled={!agreed || processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Opening Payment...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Pay {formatCurrencyRaw(plan.price_inr)} Securely
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-dark-500">
              <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
              Secured by Razorpay • 256-bit SSL encryption
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
