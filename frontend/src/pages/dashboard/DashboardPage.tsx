import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag, TrendingUp, Clock, DollarSign,
  ArrowRight, Package, HelpCircle, User, Zap,
  Key, ExternalLink
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
  glowClass: string
  loading: boolean
}> = ({ icon: Icon, label, value, color, glowClass, loading }) => (
  <Card hover className="relative overflow-hidden group">
    <CardBody className="flex items-center gap-4 p-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${color} ${glowClass} transition-transform group-hover:scale-110 duration-300`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-dark-400 text-[11px] font-mono font-medium uppercase tracking-wider">{label}</p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl font-black text-white font-mono mt-0.5">{value}</p>
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

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Gamer'

  return (
    <DashboardLayout>
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden bg-gradient-to-r from-brand-950/70 via-dark-900/90 to-indigo-950/70 border border-brand-500/30 backdrop-blur-xl shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> VIP ACCESS PORTAL
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyber-cyan">{displayName}</span>
          </h1>
          <p className="text-dark-300 text-xs sm:text-sm">
            Manage your active panel subscriptions, view loader downloads, and track licenses.
          </p>
        </div>
        <div className="flex gap-2.5 z-10 shrink-0">
          <Link to="/products">
            <Button variant="cyber" size="sm" className="font-bold shadow-glow-cyan gap-1.5">
              <ShoppingBag className="h-4 w-4" /> Browse Store
            </Button>
          </Link>
          <a href="https://discord.gg/mkMhUzpqU6" target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <HelpCircle className="h-4 w-4 text-indigo-400" /> Discord Help
            </Button>
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={ShoppingBag}
          label="Total Purchases"
          value={stats.totalPurchases}
          color="bg-brand-600/15 text-brand-400 border-brand-500/30"
          glowClass="shadow-glow"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Subscriptions"
          value={stats.activePurchases}
          color="bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
          glowClass="shadow-glow-green"
          loading={loading}
        />
        <StatCard
          icon={Clock}
          label="Expired Keys"
          value={stats.expiredPurchases}
          color="bg-red-500/15 text-red-400 border-red-500/30"
          glowClass="shadow-glow-pink"
          loading={loading}
        />
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={loading ? '…' : formatCurrencyRaw(stats.totalSpent)}
          color="bg-amber-500/15 text-amber-400 border-amber-500/30"
          glowClass="shadow-sm"
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchases List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="h-5 w-5 text-brand-400" /> Recent Licenses & Purchases
            </h2>
            <Link to="/dashboard/purchases" className="text-xs font-mono text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors">
              View all history <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <Card>
            {loading ? (
              <CardBody className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </CardBody>
            ) : recentPurchases.length === 0 ? (
              <CardBody className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-white/[0.06] flex items-center justify-center mx-auto text-dark-500">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="text-base font-bold text-white">No active subscriptions yet</h3>
                <p className="text-dark-400 text-xs max-w-xs mx-auto">
                  Explore our catalog and choose your preferred game panel with instant setup.
                </p>
                <Link to="/products" className="inline-block pt-2">
                  <Button variant="cyber" size="sm">
                    Browse Panel Store <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardBody>
            ) : (
              <div className="divide-y divide-white/[0.06]">
                {recentPurchases.map((p) => (
                  <Link
                    key={p.id}
                    to={`/dashboard/purchases/${p.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="w-11 h-11 bg-brand-600/15 border border-brand-500/30 rounded-xl flex items-center justify-center shrink-0 shadow-glow group-hover:scale-105 transition-transform">
                      <Zap className="h-5 w-5 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-sm truncate group-hover:text-brand-300 transition-colors">
                        {p.product_name_snapshot}
                      </p>
                      <p className="text-dark-400 text-xs mt-0.5 font-mono">
                        {p.plan_name_snapshot} • {formatDate(p.purchased_at)}
                        {p.expires_at ? ` • Expires ${formatDate(p.expires_at)}` : ' • Permanent'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white font-mono font-bold text-sm">{formatCurrencyRaw(p.amount_paid)}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions & Discord Widget */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyber-cyan" /> Quick Access
            </h2>
            <Card>
              <CardBody className="p-3 space-y-2">
                {[
                  { to: '/products', icon: ShoppingBag, label: 'Get New Key', desc: 'Browse available panel plans' },
                  { to: '/dashboard/purchases', icon: Key, label: 'My Subscriptions', desc: 'Retrieve license & loader link' },
                  { to: '/support', icon: HelpCircle, label: 'Support & Guides', desc: 'Step-by-step setup guides' },
                  { to: '/profile', icon: User, label: 'Account Profile', desc: 'Update mobile & Discord username' },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/[0.04] transition-all group border border-transparent hover:border-white/[0.06]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-dark-800/80 border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:bg-brand-600/20 group-hover:border-brand-500/30 transition-colors">
                      <item.icon className="h-4 w-4 text-dark-400 group-hover:text-brand-300 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-xs font-bold">{item.label}</p>
                      <p className="text-dark-500 text-[11px] truncate">{item.desc}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-dark-600 group-hover:text-brand-300 transition-colors" />
                  </Link>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Discord VIP Direct Card */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-indigo-950/80 to-dark-900 border border-indigo-500/30 shadow-glass space-y-3">
            <div className="flex items-center gap-2.5 text-indigo-400">
              <HelpCircle className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wider font-mono">Need Setup Assistance?</span>
            </div>
            <p className="text-dark-300 text-xs leading-relaxed">
              Open a ticket on our Discord server with your Order ID for instant remote loader setup assistance.
            </p>
            <a
              href="https://discord.gg/mkMhUzpqU6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              Open Discord Ticket <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
