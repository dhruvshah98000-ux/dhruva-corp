import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, Package, CreditCard, User, Calendar,
  Download, Key, Copy, Check, ShieldCheck
} from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { purchaseService } from '../../services/api'
import { Purchase } from '../../types'
import { formatCurrencyRaw, formatDate, formatDateTime } from '../../utils/format'

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between items-start gap-4 py-2.5 border-b border-white/[0.06] last:border-0">
    <span className="text-dark-400 text-xs sm:text-sm shrink-0">{label}</span>
    <span className="text-white text-xs sm:text-sm font-medium text-right break-all">{value}</span>
  </div>
)

export const PurchaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)

  useEffect(() => {
    if (!id) return
    purchaseService.getById(id)
      .then(setPurchase)
      .catch(() => setError('Purchase not found'))
      .finally(() => setLoading(false))
  }, [id])

  // Mock license key derived from order or purchase ID for instant user satisfaction
  const licenseKey = purchase
    ? `DHRUVA-${purchase.id.slice(0, 8).toUpperCase()}-${purchase.plan_name_snapshot.replace(/\s+/g, '').toUpperCase()}`
    : ''

  const handleCopyKey = () => {
    if (!licenseKey) return
    navigator.clipboard.writeText(licenseKey)
    setCopiedKey(true)
    toast.success('License key copied to clipboard!')
    setTimeout(() => setCopiedKey(false), 2000)
  }

  return (
    <DashboardLayout>
      <Link
        to="/dashboard/purchases"
        className="inline-flex items-center gap-2 text-dark-400 hover:text-white text-xs font-mono mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> BACK TO PURCHASES
      </Link>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      )}

      {error && (
        <div className="text-center py-20 glass-card p-8">
          <p className="text-red-400 mb-4">{error}</p>
          <Link to="/dashboard/purchases">
            <Button variant="outline" size="sm">Back to purchases</Button>
          </Link>
        </div>
      )}

      {!loading && !error && purchase && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-brand-950/70 via-dark-900/90 to-indigo-950/70 border border-brand-500/30 backdrop-blur-xl shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-mono font-medium mb-2">
                ACTIVE LICENSE
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{purchase.product_name_snapshot}</h1>
              <p className="text-dark-300 text-xs sm:text-sm mt-0.5 font-mono">
                Plan: <span className="text-white font-bold">{purchase.plan_name_snapshot}</span> • Purchased on {formatDate(purchase.purchased_at)}
              </p>
            </div>
            <StatusBadge status={purchase.status} className="self-start sm:self-center" />
          </div>

          {/* License Key & Loader Access Box */}
          <Card glow className="p-6 border-brand-500/40">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <span className="text-xs font-mono uppercase tracking-wider text-dark-400 font-bold flex items-center gap-1.5">
                  <Key className="h-4 w-4 text-brand-400" /> Panel License Key
                </span>
                <div className="flex items-center gap-3">
                  <code className="text-sm sm:text-base font-mono font-black text-cyber-cyan bg-dark-950/80 px-4 py-2 rounded-xl border border-white/[0.08] select-all tracking-wider">
                    {licenseKey}
                  </code>
                  <Button variant="secondary" size="sm" onClick={handleCopyKey} className="font-mono text-xs gap-1.5">
                    {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copiedKey ? 'Copied' : 'Copy Key'}
                  </Button>
                </div>
              </div>
              <a
                href="https://discord.gg/mkMhUzpqU6"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto"
              >
                <Button variant="cyber" size="md" fullWidth className="font-bold shadow-glow-cyan gap-2">
                  <Download className="h-4 w-4" /> Download Latest Loader
                </Button>
              </a>
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-brand-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Product Summary</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Product Name" value={purchase.product_name_snapshot} />
                <Row label="Plan Duration" value={purchase.plan_name_snapshot} />
                <Row label="Total Amount" value={<span className="text-cyber-cyan font-mono font-black">{formatCurrencyRaw(purchase.amount_paid)}</span>} />
                <Row label="Status" value={<StatusBadge status={purchase.status} />} />
              </CardBody>
            </Card>

            {/* Validity Period */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-brand-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Subscription Period</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Purchase Date" value={formatDate(purchase.purchased_at)} />
                <Row label="Activation Date" value={formatDate(purchase.starts_at)} />
                <Row
                  label="Expiration Date"
                  value={
                    purchase.expires_at ? (
                      <span className={new Date(purchase.expires_at) < new Date() ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                        {formatDate(purchase.expires_at)}
                      </span>
                    ) : (
                      <span className="text-cyber-cyan font-bold">Permanent / Lifetime Access</span>
                    )
                  }
                />
              </CardBody>
            </Card>

            {/* Payment Record */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-brand-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Payment Confirmation</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Status" value={<StatusBadge status={purchase.order?.status || 'paid'} />} />
                {purchase.order?.paid_at && <Row label="Processed At" value={formatDateTime(purchase.order.paid_at)} />}
                {purchase.order?.razorpay_order_id && (
                  <Row
                    label="Razorpay Order"
                    value={<span className="font-mono text-xs">{purchase.order.razorpay_order_id}</span>}
                  />
                )}
                {purchase.order?.razorpay_payment_id && (
                  <Row
                    label="Payment Reference"
                    value={<span className="font-mono text-xs text-brand-300">{purchase.order.razorpay_payment_id}</span>}
                  />
                )}
              </CardBody>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-400" />
                  <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Buyer Details</span>
                </div>
              </CardHeader>
              <CardBody>
                <Row label="Name" value={purchase.order?.customer_name || 'VIP Client'} />
                <Row label="Email" value={purchase.order?.customer_email || '—'} />
                <Row label="Phone" value={purchase.order?.customer_phone || '—'} />
                <Row label="Discord" value={purchase.order?.customer_discord || '—'} />
              </CardBody>
            </Card>
          </div>

          {/* Quick Setup Instructions */}
          <Card className="p-6 bg-dark-900/60 border border-white/[0.08]">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> 3-Step Setup Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-dark-950/60 border border-white/[0.06] space-y-1">
                <span className="font-mono font-bold text-brand-400">STEP 1</span>
                <p className="text-white font-semibold">Download Loader</p>
                <p className="text-dark-400 leading-relaxed">Download the latest loader build from our Discord announcement or download channel.</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-950/60 border border-white/[0.06] space-y-1">
                <span className="font-mono font-bold text-cyber-cyan">STEP 2</span>
                <p className="text-white font-semibold">Paste Your Key</p>
                <p className="text-dark-400 leading-relaxed">Launch the loader as Administrator and paste the unique License Key displayed above.</p>
              </div>
              <div className="p-4 rounded-xl bg-dark-950/60 border border-white/[0.06] space-y-1">
                <span className="font-mono font-bold text-emerald-400">STEP 3</span>
                <p className="text-white font-semibold">Launch Game & Dominate</p>
                <p className="text-dark-400 leading-relaxed">Start Free Fire on your emulator or mobile. Press the activation hotkey (INSERT or Home) to toggle HUD.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </DashboardLayout>
  )
}
