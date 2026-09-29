import React, { useState, useCallback } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft, Loader2, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { ProductArt } from '../../components/ui/ProductArt'
import { useAuth } from '../../context/AuthContext'
import { paymentService } from '../../services/api'
import { Product, ProductPlan } from '../../types'
import { formatCurrencyRaw } from '../../utils/format'

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
  const [agreed, setAgreed] = useState(true) // default to true for smoother UX

  const state = location.state as { product: Product; plan: ProductPlan } | null

  if (!state?.product || !state?.plan) {
    return (
      <MainLayout>
        <div className="page-container text-center py-24 glass-card p-8 max-w-lg mx-auto">
          <p className="text-dark-400">No product plan was selected.</p>
          <Link to="/products" className="mt-4 inline-block">
            <Button variant="cyber" size="sm">Browse Products</Button>
          </Link>
        </div>
      </MainLayout>
    )
  }

  const { product, plan } = state

  const handlePayNow = useCallback(async () => {
    if (!agreed) {
      toast.error('Please accept the Terms of Service to proceed')
      return
    }
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
        description: `${product.name} (${plan.name})`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: profile?.full_name || '',
          email: user?.email || '',
          contact: profile?.phone || '',
        },
        theme: { color: '#4353ff' },
        handler: async (response: RazorpayResponse) => {
          try {
            const verified = await paymentService.verifyPayment({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            toast.success('Payment verified successfully!')
            navigate('/payment/customer-info', {
              state: { orderId: orderData.orderId, purchaseId: verified.purchaseId },
            })
          } catch {
            toast.error('Payment verification failed. Please contact Discord support.')
            navigate('/payment/failed', { state: { orderId: orderData.orderId } })
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false)
            toast.error('Payment was cancelled.')
            navigate('/payment/failed', { state: { orderId: orderData.orderId } })
          },
        },
      })

      rzp.open()
    } catch (err) {
      console.error(err)
      toast.error('Could not initiate payment gateway. Please try again.')
      setProcessing(false)
    }
  }, [agreed, processing, product, plan, user, profile, navigate])

  return (
    <MainLayout>
      <div className="page-container max-w-xl mx-auto py-12">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-xs font-mono mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> BACK TO STORE
        </Link>

        {/* Checkout Header */}
        <div className="text-center mb-8 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-xs font-mono font-medium">
            <Lock className="h-3 w-3 text-emerald-400" /> SECURE 256-BIT ENCRYPTED CHECKOUT
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Complete Your Order</h1>
        </div>

        <Card glow className="overflow-hidden border-brand-500/40">
          {/* Product Banner Preview */}
          <div className="h-36 overflow-hidden relative bg-dark-950">
            <ProductArt slug={product.slug} category={product.category} />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent pointer-events-none" />
          </div>

          <CardBody className="p-6 sm:p-8 space-y-6">
            {/* Order Specification */}
            <div className="space-y-3 bg-dark-950/70 rounded-2xl p-5 border border-white/[0.06] font-mono text-xs">
              <div className="flex justify-between items-center text-sm">
                <span className="text-dark-400 font-sans">Panel Build</span>
                <span className="text-white font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400 font-sans">Selected Plan</span>
                <span className="text-brand-300 font-bold">{plan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400 font-sans">Duration</span>
                <span className="text-white">
                  {plan.duration_days === null ? 'Permanent / Lifetime' : `${plan.duration_days} Days`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-dark-400 font-sans">Account Email</span>
                <span className="text-white truncate max-w-[180px]">{user?.email}</span>
              </div>

              <div className="border-t border-white/[0.08] pt-3 flex justify-between items-center font-sans">
                <span className="text-white font-bold text-sm">Total Payable</span>
                <span className="text-cyber-cyan font-black text-2xl font-mono">
                  {formatCurrencyRaw(plan.price_inr)}
                </span>
              </div>
            </div>

            {/* Payment Methods Accepted */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase text-dark-400">Accepted Payment Methods</div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono font-bold text-dark-300">
                <div className="p-2 rounded-xl bg-dark-950/60 border border-white/[0.06]">UPI / GPay</div>
                <div className="p-2 rounded-xl bg-dark-950/60 border border-white/[0.06]">PhonePe</div>
                <div className="p-2 rounded-xl bg-dark-950/60 border border-white/[0.06]">Paytm</div>
                <div className="p-2 rounded-xl bg-dark-950/60 border border-white/[0.06]">Debit/Cards</div>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-dark-600 bg-dark-800 text-brand-500 focus:ring-brand-500/50"
              />
              <span className="text-xs text-dark-400 group-hover:text-dark-300 transition-colors">
                I agree to the{' '}
                <Link to="/terms" target="_blank" className="text-brand-400 hover:underline">Terms of Service</Link>
                {' '}and understand that panels are delivered instantly after payment.
              </span>
            </label>

            {/* Pay Button */}
            <Button
              fullWidth
              size="lg"
              variant="cyber"
              onClick={handlePayNow}
              loading={processing}
              disabled={!agreed || processing}
              className="font-bold shadow-glow-cyan text-base"
            >
              {processing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Connecting Razorpay...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  Pay {formatCurrencyRaw(plan.price_inr)} Securely
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-dark-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Secured by Razorpay • Instant Auto-Fulfillment</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
