import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, CreditCard, User, Calendar, HelpCircle } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { purchaseService } from '../../services/api'
import { Purchase } from '../../types'
import { formatCurrencyRaw, formatDate, formatDateTime } from '../../utils/format'

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 py-2.5 border-b border-dark-800/50 last:border-0">
    <span className="text-dark-400 text-sm shrink-0">{label}</span>
    <span className="text-white text-sm font-medium text-right break-all">{value}</span>
  </div>
)

export const PurchaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    purchaseService.getById(id)
      .then(setPurchase)
      .catch(() => setError('Purchase not found'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <DashboardLayout>
      <Link to="/dashboard/purchases" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Purchases
      </Link>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/dashboard/purchases">
            <span className="text-brand-400 hover:underline">← Back to purchases</span>
          </Link>
        </div>
      )}

      {!loading && !error && purchase && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{purchase.product_name_snapshot}</h1>
              <p className="text-dark-400 text-sm mt-1">{purchase.plan_name_snapshot} Plan</p>
            </div>
            <StatusBadge status={purchase.status} className="self-start" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Product Details</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Product" value={purchase.product_name_snapshot} />
                <Row label="Plan" value={purchase.plan_name_snapshot} />
                <Row label="Amount Paid" value={<span className="text-brand-400 font-bold">{formatCurrencyRaw(purchase.amount_paid)}</span>} />
                <Row label="Status" value={<StatusBadge status={purchase.status} />} />
              </CardBody>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Purchase Period</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Purchased" value={formatDate(purchase.purchased_at)} />
                <Row label="Starts" value={formatDate(purchase.starts_at)} />
                <Row
                  label="Expires"
                  value={
                    purchase.expires_at
                      ? <span className={new Date(purchase.expires_at) < new Date() ? 'text-red-400' : 'text-green-400'}>{formatDate(purchase.expires_at)}</span>
                      : <span className="text-brand-400 font-medium">Permanent / Lifetime</span>
                  }
                />
              </CardBody>
            </Card>

            {/* Payment info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Payment Information</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Payment Status" value={<StatusBadge status={purchase.order?.status || 'paid'} />} />
                {purchase.order?.paid_at && <Row label="Paid At" value={formatDateTime(purchase.order.paid_at)} />}
                {purchase.order?.razorpay_order_id && (
                  <Row
                    label="Order ID"
                    value={
                      <span className="font-mono text-xs break-all">{purchase.order.razorpay_order_id}</span>
                    }
                  />
                )}
                {purchase.order?.razorpay_payment_id && (
                  <Row
                    label="Payment ID"
                    value={
                      <span className="font-mono text-xs break-all">{purchase.order.razorpay_payment_id}</span>
                    }
                  />
                )}
              </CardBody>
            </Card>

            {/* Customer info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Customer Details</span>
                </div>
              </CardHeader>
              <CardBody>
                {purchase.order?.customer_name && <Row label="Name" value={purchase.order.customer_name} />}
                {purchase.order?.customer_email && <Row label="Email" value={purchase.order.customer_email} />}
                {purchase.order?.customer_phone && <Row label="Phone" value={purchase.order.customer_phone} />}
                {purchase.order?.customer_discord && <Row label="Discord" value={purchase.order.customer_discord} />}
                {!purchase.order?.customer_name && (
                  <p className="text-dark-500 text-sm text-center py-4">Customer details not yet provided</p>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Support */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600/10 border border-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <HelpCircle className="h-5 w-5 text-brand-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Need Help?</p>
                  <p className="text-dark-400 text-xs mt-0.5">
                    Contact support at <span className="text-brand-400">support@dhruva.corp</span> or visit our{' '}
                    <Link to="/support" className="text-brand-400 hover:underline">Support page</Link>
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
