import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, TrendingUp, Clock, DollarSign,
  ArrowRight, Package, HelpCircle, User
} from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/Badge'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAuth } from '../../context/AuthContext'
import { purchaseService } from '../../services/api'
import { Purchase, DashboardStats } from '../../types'
import { formatCurrencyRaw, formatDate } from '../../utils/format'

const StatCard: React.FC<{
  icon: React.ElementType
  label: string
  value: string | number
  color: string
  loading: boolean
}> = ({ icon: Icon, label, value, color, loading }) => (
  <Card>
    <CardBody className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-dark-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        )}
      </div>
    </CardBody>
  </Card>
)

export const DashboardPage: React.FC = () => {
  const { profile, user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalPurchases: 0, activePurchases: 0, expiredPurchases: 0, totalSpent: 0,
  })
  const [recentPurchases, setRecentPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      purchaseService.getStats(),
      purchaseService.getAll(),
    ]).then(([s, purchases]) => {
      setStats(s)
      setRecentPurchases(purchases.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [])

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'there'

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="text-brand-400">{displayName}</span> 👋
        </h1>
        <p className="text-dark-400 mt-1 text-sm">Here's what's happening with your account.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={ShoppingBag} label="Total Purchases" value={stats.totalPurchases} color="bg-brand-600/10 text-brand-400 border border-brand-500/20" loading={loading} />
        <StatCard icon={TrendingUp} label="Active" value={stats.activePurchases} color="bg-green-500/10 text-green-400 border border-green-500/20" loading={loading} />
        <StatCard icon={Clock} label="Expired" value={stats.expiredPurchases} color="bg-red-500/10 text-red-400 border border-red-500/20" loading={loading} />
        <StatCard icon={DollarSign} label="Total Spent" value={loading ? '…' : formatCurrencyRaw(stats.totalSpent)} color="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Purchases</h2>
            <Link to="/dashboard/purchases" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Card>
            {loading ? (
              <CardBody className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </CardBody>
            ) : recentPurchases.length === 0 ? (
              <CardBody className="text-center py-10">
                <Package className="h-10 w-10 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-400 text-sm">No purchases yet</p>
                <Link to="/products">
                  <Button variant="outline" size="sm" className="mt-4">Browse Products</Button>
                </Link>
              </CardBody>
            ) : (
              <div className="divide-y divide-dark-700/50">
                {recentPurchases.map((p) => (
                  <Link
                    key={p.id}
                    to={`/dashboard/purchases/${p.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-dark-700/20 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-600/10 border border-brand-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate group-hover:text-brand-300 transition-colors">
                        {p.product_name_snapshot}
                      </p>
                      <p className="text-dark-500 text-xs mt-0.5">
                        {p.plan_name_snapshot} • {formatDate(p.purchased_at)}
                        {p.expires_at
                          ? ` • Expires ${formatDate(p.expires_at)}`
                          : ' • Permanent'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white font-semibold text-sm">{formatCurrencyRaw(p.amount_paid)}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <Card>
            <CardBody className="space-y-3">
              {[
                { to: '/products', icon: ShoppingBag, label: 'Browse Products', desc: 'Find a new product' },
                { to: '/dashboard/purchases', icon: Package, label: 'My Purchases', desc: 'View all purchases' },
                { to: '/support', icon: HelpCircle, label: 'Get Support', desc: 'Contact our team' },
                { to: '/profile', icon: User, label: 'Edit Profile', desc: 'Update your details' },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-dark-700/50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-brand-600/20 group-hover:border-brand-500/20 border border-dark-600 transition-colors">
                    <item.icon className="h-4 w-4 text-dark-400 group-hover:text-brand-400 transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium">{item.label}</p>
                    <p className="text-dark-500 text-xs">{item.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-dark-600 group-hover:text-brand-400 transition-colors ml-auto shrink-0" />
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
