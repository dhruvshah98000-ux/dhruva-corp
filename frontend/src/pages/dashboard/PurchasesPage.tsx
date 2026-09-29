import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ExternalLink, Search } from 'lucide-react'
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
    const matchSearch = !q || p.product_name_snapshot.toLowerCase().includes(q) || p.plan_name_snapshot.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Purchases</h1>
          <p className="text-dark-400 text-sm mt-1">Your complete purchase history</p>
        </div>
        <Link to="/products">
          <Button variant="outline" size="sm">
            <Package className="h-4 w-4" />
            Browse Products
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === s ? 'bg-brand-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table */}
      <Card className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700/50">
                {['Product', 'Plan', 'Amount', 'Purchased', 'Expires', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {loading
                ? [1, 2, 3].map((i) => <TableRowSkeleton key={i} cols={7} />)
                : filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white text-sm">{p.product_name_snapshot}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">{p.plan_name_snapshot}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white">{formatCurrencyRaw(p.amount_paid)}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">{formatDate(p.purchased_at)}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">
                      {p.expires_at ? formatDate(p.expires_at) : <span className="text-brand-400">Permanent</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <Link to={`/dashboard/purchases/${p.id}`} className="text-brand-400 hover:text-brand-300 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && (
            <div className="text-center py-14">
              <Package className="h-10 w-10 text-dark-600 mx-auto mb-3" />
              <p className="text-dark-400 text-sm">No purchases found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {loading
          ? [1, 2, 3].map((i) => (
            <Card key={i}>
              <div className="p-4 space-y-2">
                {[1, 2, 3].map(j => <div key={j} className="h-4 bg-dark-700 rounded animate-pulse" />)}
              </div>
            </Card>
          ))
          : filtered.map((p) => (
            <Link key={p.id} to={`/dashboard/purchases/${p.id}`}>
              <Card hover>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-white font-medium text-sm">{p.product_name_snapshot}</p>
                      <p className="text-dark-400 text-xs mt-0.5">{p.plan_name_snapshot}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-dark-500 block">Amount</span>
                      <span className="text-white font-medium">{formatCurrencyRaw(p.amount_paid)}</span>
                    </div>
                    <div>
                      <span className="text-dark-500 block">Purchased</span>
                      <span className="text-white">{formatDate(p.purchased_at)}</span>
                    </div>
                    <div>
                      <span className="text-dark-500 block">Expires</span>
                      <span className={p.expires_at ? 'text-white' : 'text-brand-400'}>
                        {p.expires_at ? formatDate(p.expires_at) : 'Permanent'}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-14 text-dark-400 text-sm">No purchases found</div>
        )}
      </div>
    </DashboardLayout>
  )
}
