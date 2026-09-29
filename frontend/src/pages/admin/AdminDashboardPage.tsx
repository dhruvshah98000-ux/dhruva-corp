import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, CheckCircle2, Clock, XCircle,
  DollarSign, TrendingUp, Users, Package, ArrowRight, Sparkles
} from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Skeleton } from '../../components/ui/Skeleton'
import { adminService } from '../../services/api'
import { AdminStats } from '../../types'
import { formatCurrencyRaw } from '../../utils/format'

const StatCard: React.FC<{
  icon: React.ElementType; label: string; value: string | number
  color: string; loading: boolean; to?: string
}> = ({ icon: Icon, label, value, color, loading, to }) => {
  const inner = (
    <Card hover={!!to} className="h-full">
      <CardBody className="flex items-center gap-4 p-5">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${color} shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-dark-400 text-[11px] font-mono font-bold uppercase tracking-wider">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-20 mt-1" />
          ) : (
            <p className="text-2xl font-black text-white font-mono mt-0.5">{value}</p>
          )}
        </div>
      </CardBody>
    </Card>
  )
  return to ? <Link to={to} className="block h-full">{inner}</Link> : inner
}

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats().then(setStats).finally(() => setLoading(false))
  }, [])

  const s = stats

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono mb-2">
          <Sparkles className="h-3.5 w-3.5" /> ROOT OPERATIONS CONTROL
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">System Analytics & Revenue</h1>
        <p className="text-dark-400 text-xs sm:text-sm mt-1">Real-time breakdown of all orders, active licenses, and customers.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={s?.totalOrders ?? 0} color="bg-brand-600/15 text-brand-400 border-brand-500/30" loading={loading} to="/admin/orders" />
        <StatCard icon={CheckCircle2} label="Successful Orders" value={s?.successfulPayments ?? 0} color="bg-emerald-500/15 text-emerald-400 border-emerald-500/30" loading={loading} />
        <StatCard icon={Clock} label="Pending Payments" value={s?.pendingPayments ?? 0} color="bg-amber-500/15 text-amber-400 border-amber-500/30" loading={loading} />
        <StatCard icon={XCircle} label="Declined / Failed" value={s?.failedPayments ?? 0} color="bg-red-500/15 text-red-400 border-red-500/30" loading={loading} />
        <StatCard icon={DollarSign} label="Total Revenue (INR)" value={loading ? '…' : formatCurrencyRaw(s?.totalRevenue ?? 0)} color="bg-emerald-500/15 text-emerald-300 border-emerald-500/30" loading={loading} />
        <StatCard icon={TrendingUp} label="Active Subscriptions" value={s?.activePurchases ?? 0} color="bg-cyan-500/15 text-cyan-400 border-cyan-500/30" loading={loading} />
        <StatCard icon={Package} label="Expired Licenses" value={s?.expiredPurchases ?? 0} color="bg-orange-500/15 text-orange-400 border-orange-500/30" loading={loading} />
        <StatCard icon={Users} label="Total Customers" value={s?.totalCustomers ?? 0} color="bg-purple-500/15 text-purple-400 border-purple-500/30" loading={loading} to="/admin/customers" />
      </div>

      {/* Quick Navigation Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/admin/orders', label: 'Manage Orders', desc: 'Real-time payment verification feed', icon: ShoppingBag },
          { to: '/admin/products', label: 'Product Catalog', desc: 'Create, edit & manage panel pricing', icon: Package },
          { to: '/admin/customers', label: 'Client Database', desc: 'Customer accounts & contact numbers', icon: Users },
          { to: '/admin/settings', label: 'Store Settings', desc: 'Discord links, branding & support email', icon: TrendingUp },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="block">
            <Card hover className="h-full">
              <CardBody className="flex items-center gap-3.5 p-5">
                <div className="w-11 h-11 bg-dark-800 border border-white/[0.08] rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-dark-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-bold text-xs">{item.label}</p>
                  <p className="text-dark-500 text-[11px] truncate">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-dark-600 shrink-0" />
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </AdminLayout>
  )
}
