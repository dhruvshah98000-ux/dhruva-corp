import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, CheckCircle2, Clock, XCircle,
  DollarSign, TrendingUp, Users, Package, ArrowRight
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
    <Card hover={!!to}>
      <CardBody className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-dark-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          {loading ? <Skeleton className="h-7 w-20 mt-1" /> : <p className="text-2xl font-bold text-white mt-0.5">{value}</p>}
        </div>
      </CardBody>
    </Card>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
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
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-400 text-sm mt-1">Overview of all orders, revenue, and customers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Orders" value={s?.totalOrders ?? 0} color="bg-brand-600/10 text-brand-400 border border-brand-500/20" loading={loading} to="/admin/orders" />
        <StatCard icon={CheckCircle2} label="Successful Payments" value={s?.successfulPayments ?? 0} color="bg-green-500/10 text-green-400 border border-green-500/20" loading={loading} />
        <StatCard icon={Clock} label="Pending" value={s?.pendingPayments ?? 0} color="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" loading={loading} />
        <StatCard icon={XCircle} label="Failed" value={s?.failedPayments ?? 0} color="bg-red-500/10 text-red-400 border border-red-500/20" loading={loading} />
        <StatCard icon={DollarSign} label="Total Revenue" value={loading ? '…' : formatCurrencyRaw(s?.totalRevenue ?? 0)} color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" loading={loading} />
        <StatCard icon={TrendingUp} label="Active Purchases" value={s?.activePurchases ?? 0} color="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" loading={loading} />
        <StatCard icon={Package} label="Expired Purchases" value={s?.expiredPurchases ?? 0} color="bg-orange-500/10 text-orange-400 border border-orange-500/20" loading={loading} />
        <StatCard icon={Users} label="Total Customers" value={s?.totalCustomers ?? 0} color="bg-purple-500/10 text-purple-400 border border-purple-500/20" loading={loading} to="/admin/customers" />
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/admin/orders', label: 'Manage Orders', desc: 'View and search all orders', icon: ShoppingBag },
          { to: '/admin/products', label: 'Manage Products', desc: 'Add, edit, disable products', icon: Package },
          { to: '/admin/customers', label: 'Customers', desc: 'View customer details', icon: Users },
          { to: '/admin/settings', label: 'Site Settings', desc: 'Configure support & branding', icon: TrendingUp },
        ].map((item) => (
          <Link key={item.to} to={item.to}>
            <Card hover className="h-full">
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 bg-dark-700 border border-dark-600 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-dark-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-medium text-sm">{item.label}</p>
                  <p className="text-dark-500 text-xs">{item.desc}</p>
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
