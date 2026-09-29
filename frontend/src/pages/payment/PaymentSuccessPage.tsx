import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, ExternalLink } from 'lucide-react'
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
      <div className="page-container max-w-lg mx-auto">
        {/* Success banner */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <CheckCircle2 className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful ✓</h1>
          <p className="text-dark-400">Your order has been successfully processed.</p>
        </div>

        <Card>
          <CardBody className="space-y-5">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
            ) : purchase ? (
              <>
                <div className="space-y-3">
                  {[
                    { label: 'Product', value: purchase.product_name_snapshot },
                    { label: 'Plan', value: purchase.plan_name_snapshot },
                    { label: 'Amount Paid', value: formatCurrencyRaw(purchase.amount_paid) },
                    { label: 'Purchase Date', value: formatDate(purchase.purchased_at) },
                    {
                      label: 'Expiry',
                      value: purchase.expires_at
                        ? formatDate(purchase.expires_at)
                        : 'Permanent / Lifetime',
                    },
                    { label: 'Order ID', value: purchase.order?.razorpay_order_id || state.orderId },
                    { label: 'Payment ID', value: purchase.order?.razorpay_payment_id || '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start gap-4">
                      <span className="text-dark-400 text-sm shrink-0">{label}</span>
                      <span className="text-white text-sm font-medium text-right break-all">{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="text-dark-400 text-sm">Status</span>
                    <StatusBadge status={purchase.status} />
                  </div>
                </div>

                <div className="border-t border-dark-700 pt-4 bg-dark-900/40 rounded-xl p-4">
                  <div className="text-xs text-dark-400 mb-2 font-medium uppercase tracking-wider">Support</div>
                  <p className="text-sm text-dark-300">
                    Need help? Contact us at{' '}
                    <span className="text-brand-400">support@dhruva.corp</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center text-dark-400 py-4">
                Order ID: <span className="font-mono text-white text-sm">{state.orderId}</span>
                <br /><span className="text-xs mt-1 block">Your purchase is being processed.</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {purchase && (
                <Link to={`/dashboard/purchases/${purchase.id}`} className="flex-1">
                  <Button variant="outline" fullWidth>
                    <ExternalLink className="h-4 w-4" />
                    View Purchase
                  </Button>
                </Link>
              )}
              <Link to="/dashboard" className="flex-1">
                <Button fullWidth>Go to Dashboard</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
