import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Key, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { purchaseService } from '../../services/api'
import { Purchase } from '../../types'
import { formatCurrencyRaw, formatDate } from '../../utils/format'
import { Skeleton } from '../../components/ui/Skeleton'

export const PaymentSuccessPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { orderId: string; purchaseId?: string } | null

  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!state?.purchaseId) { setLoading(false); return }
    purchaseService.getById(state.purchaseId)
      .then(setPurchase)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [state?.purchaseId])

  if (!state?.orderId) {
    navigate('/dashboard')
    return null
  }

  return (
    <MainLayout>
      <div className="page-container max-w-lg mx-auto py-12">
        {/* Celebration Banner */}
        <div className="text-center mb-8 space-y-3">
          <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500/40 rounded-3xl flex items-center justify-center mx-auto text-emerald-400 shadow-glow-green animate-bounce">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono">
            <Sparkles className="h-3.5 w-3.5" /> TRANSACTION CONFIRMED
          </div>
          <h1 className="text-3xl font-black text-white">Payment Successful!</h1>
          <p className="text-dark-300 text-sm">Your panel access has been automatically provisioned.</p>
        </div>

        <Card glow className="overflow-hidden border-emerald-500/30">
          <CardBody className="p-6 sm:p-8 space-y-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-6 w-full rounded-xl" />)}
              </div>
            ) : purchase ? (
              <div className="space-y-4">
                <div className="space-y-3 bg-dark-950/80 rounded-2xl p-4 border border-white/[0.06] font-mono text-xs">
                  {[
                    { label: 'Panel Build', value: purchase.product_name_snapshot },
                    { label: 'Subscription Plan', value: purchase.plan_name_snapshot },
                    { label: 'Total Paid', value: formatCurrencyRaw(purchase.amount_paid) },
                    { label: 'Date', value: formatDate(purchase.purchased_at) },
                    {
                      label: 'Validity',
                      value: purchase.expires_at ? formatDate(purchase.expires_at) : 'Permanent / Lifetime',
                    },
                    { label: 'Razorpay Ref', value: purchase.order?.razorpay_order_id || state.orderId },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-dark-400 font-sans">{label}</span>
                      <span className="text-white font-bold text-right break-all">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.08]">
                    <span className="text-dark-400 font-sans">Status</span>
                    <StatusBadge status={purchase.status} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-brand-300 font-bold text-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Next Steps for Activation</span>
                  </div>
                  <p className="text-dark-300 text-xs leading-relaxed">
                    View your purchase details to copy your unique activation key and download the loader application.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-dark-400 py-6 font-mono text-xs">
                Order ID: <span className="text-white font-bold">{state.orderId}</span>
                <p className="mt-2 text-dark-300">Your order is ready in your dashboard.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {purchase && (
                <Link to={`/dashboard/purchases/${purchase.id}`} className="flex-1">
                  <Button variant="cyber" size="md" fullWidth className="font-bold shadow-glow-cyan gap-1.5">
                    <Key className="h-4 w-4" /> Get License Key
                  </Button>
                </Link>
              )}
              <Link to="/dashboard" className="flex-1">
                <Button variant="secondary" size="md" fullWidth>
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
