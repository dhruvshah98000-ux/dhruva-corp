import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ExternalLink, Search, Zap } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/DashboardLayout'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { TableRowSkeleton } from '../../components/ui/Skeleton'
import { Button } from '../../components/ui/Button'
import { purchaseService } from '../../services/api'
import { Purchase } from '../../types'
import { formatCurrencyRaw, formatDate } from '../../utils/format'

export const PurchasesPage: React.FC = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    purchaseService.getAll()
      .then(setPurchases)
      .finally(() => setLoading(false))
  }, [])

  const statuses = ['all', 'active', 'permanent', 'expired', 'cancelled', 'refunded']

  const filtered = purchases.filter((p) => {
    const matchStatus = filter === 'all' || p.status === filter
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      p.product_name_snapshot.toLowerCase().includes(q) ||
      p.plan_name_snapshot.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-brand-400" /> Subscriptions & Licenses
          </h1>
          <p className="text-dark-400 text-xs sm:text-sm mt-1">
            Access your keys, download loaders, and review renewal dates.
          </p>
        </div>
        <Link to="/products">
          <Button variant="cyber" size="sm" className="font-bold shadow-glow-cyan gap-1.5">
            <Zap className="h-4 w-4" />
            Buy New Panel
          </Button>
        </Link>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by panel or plan name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-900/80 border border-white/[0.08] rounded-xl text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold capitalize transition-all select-none ${
                filter === s
                  ? 'bg-brand-600 text-white shadow-glow border border-brand-400/40'
                  : 'bg-dark-900/60 text-dark-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                {['Panel Name', 'Plan Duration', 'Amount Paid', 'Purchased On', 'Expiration', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-xs font-mono font-bold text-dark-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-sm">
              {loading
                ? [1, 2, 3].map((i) => <TableRowSkeleton key={i} cols={7} />)
                : filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-bold text-white group-hover:text-brand-300 transition-colors flex items-center gap-2">
                        <Zap className="h-4 w-4 text-brand-400 shrink-0" />
                        {p.product_name_snapshot}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-dark-300 font-mono text-xs">{p.plan_name_snapshot}</td>
                    <td className="px-5 py-4 font-mono font-bold text-white">{formatCurrencyRaw(p.amount_paid)}</td>
                    <td className="px-5 py-4 text-dark-400 font-mono text-xs">{formatDate(p.purchased_at)}</td>
                    <td className="px-5 py-4 font-mono text-xs">
                      {p.expires_at ? (
                        <span className={new Date(p.expires_at) < new Date() ? 'text-red-400' : 'text-emerald-400 font-semibold'}>
                          {formatDate(p.expires_at)}
                        </span>
                      ) : (
                        <span className="text-cyber-cyan font-bold">Permanent</span>
                      )}
                    </td>
                    <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/dashboard/purchases/${p.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-300 text-xs font-mono font-semibold transition-colors border border-brand-500/30"
                      >
                        Details <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">No subscriptions found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Mobile Cards List */}
      <div className="md:hidden space-y-3">
        {loading
          ? [1, 2, 3].map((i) => (
            <Card key={i} className="p-4 space-y-2">
              <div className="h-4 bg-dark-800 rounded animate-pulse" />
              <div className="h-4 bg-dark-800 rounded animate-pulse w-2/3" />
            </Card>
          ))
          : filtered.map((p) => (
            <Link key={p.id} to={`/dashboard/purchases/${p.id}`}>
              <Card hover className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white font-bold text-sm">{p.product_name_snapshot}</p>
                    <p className="text-dark-400 text-xs font-mono mt-0.5">{p.plan_name_snapshot}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-white/[0.06]">
                  <div>
                    <span className="text-dark-500 block text-[10px]">PAID</span>
                    <span className="text-white font-bold">{formatCurrencyRaw(p.amount_paid)}</span>
                  </div>
                  <div>
                    <span className="text-dark-500 block text-[10px]">EXPIRES</span>
                    <span className={p.expires_at ? 'text-white' : 'text-cyber-cyan font-bold'}>
                      {p.expires_at ? formatDate(p.expires_at) : 'Lifetime'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-brand-400 font-semibold inline-flex items-center gap-1">
                      View <ExternalLink className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 glass-card p-6 text-dark-400 text-sm">
            No purchases match the selected filter.
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
