import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Package, CreditCard, Calendar } from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { adminService } from '../../services/api'
import { formatCurrencyRaw, formatDate, formatDateTime } from '../../utils/format'

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 py-2.5 border-b border-dark-800/50 last:border-0">
    <span className="text-dark-400 text-sm shrink-0">{label}</span>
    <span className="text-white text-sm font-medium text-right break-all">{value}</span>
  </div>
)

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    adminService.getOrderById(id)
      .then(setOrder)
      .finally(() => setLoading(false))
  }, [id])

  const o = order as {
    id: string; status: string; amount: number; currency: string
    customer_name: string; customer_email: string; customer_phone: string; customer_discord: string
    razorpay_order_id: string; razorpay_payment_id: string
    created_at: string; paid_at: string
    product: { name: string; category: string }
    plan: { name: string; price_inr: number; duration_days: number | null }
    purchase: { id: string; status: string; starts_at: string; expires_at: string | null }
  } | null

  return (
    <AdminLayout>
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-40 w-full rounded-xl" />)}</div>
      ) : !o ? (
        <div className="text-center py-20 text-red-400">Order not found</div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-white">Order Details</h1>
              <p className="text-dark-500 text-xs font-mono mt-0.5">{o.id}</p>
            </div>
            <StatusBadge status={o.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Customer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Customer</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Name" value={o.customer_name || '—'} />
                <Row label="Email" value={o.customer_email || '—'} />
                <Row label="Phone" value={o.customer_phone || '—'} />
                <Row label="Discord" value={o.customer_discord || '—'} />
              </CardBody>
            </Card>

            {/* Product */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Product</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Product" value={o.product?.name || '—'} />
                <Row label="Plan" value={o.plan?.name || '—'} />
                <Row label="Price" value={formatCurrencyRaw(o.plan?.price_inr || o.amount)} />
                <Row label="Duration" value={o.plan?.duration_days ? `${o.plan.duration_days} days` : 'Permanent'} />
              </CardBody>
            </Card>

            {/* Payment */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Payment</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Payment Status" value={<StatusBadge status={o.status} />} />
                <Row label="Amount" value={formatCurrencyRaw(o.amount)} />
                {o.paid_at && <Row label="Paid At" value={formatDateTime(o.paid_at)} />}
                <Row label="Razorpay Order ID" value={<span className="font-mono text-xs">{o.razorpay_order_id}</span>} />
                <Row label="Payment ID" value={<span className="font-mono text-xs">{o.razorpay_payment_id || '—'}</span>} />
              </CardBody>
            </Card>

            {/* Purchase */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-400" />
                  <span className="font-semibold text-white text-sm">Purchase</span>
                </div>
              </CardHeader>
              <CardBody>
                {o.purchase ? (
                  <>
                    <Row label="Purchase Status" value={<StatusBadge status={o.purchase.status} />} />
                    <Row label="Starts" value={formatDate(o.purchase.starts_at)} />
                    <Row label="Expires" value={o.purchase.expires_at ? formatDate(o.purchase.expires_at) : <span className="text-brand-400">Permanent</span>} />
                  </>
                ) : (
                  <p className="text-dark-500 text-sm text-center py-4">No purchase record yet</p>
                )}
                <Row label="Order Created" value={formatDate(o.created_at)} />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
