import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { TableRowSkeleton } from '../../components/ui/Skeleton'
import { adminService } from '../../services/api'
import { formatCurrencyRaw, formatDate } from '../../utils/format'

interface OrderRow {
  id: string
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  customer_discord: string | null
  razorpay_order_id: string
  razorpay_payment_id: string | null
  amount: number
  status: string
  created_at: string
  paid_at: string | null
  product?: { name: string }
  plan?: { name: string; price_inr: number }
  purchase?: { status: string; expires_at: string | null }
}

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 20 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await adminService.getOrders(params)
      setOrders(res.data || [])
      setPagination(res.pagination)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const statuses = ['', 'pending', 'paid', 'failed', 'cancelled', 'refunded']

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-dark-400 text-sm mt-1">{pagination.total} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by name, email, order ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="px-3 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-dark-700/50">
                {['Customer', 'Product', 'Plan', 'Amount', 'Status', 'Purchase Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {loading
                ? [1, 2, 3, 4, 5].map(i => <TableRowSkeleton key={i} cols={8} />)
                : orders.map((o) => (
                  <tr key={o.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium">{o.customer_name || '—'}</div>
                      <div className="text-dark-500 text-xs mt-0.5 truncate max-w-[160px]">{o.customer_email || '—'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">{o.product?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">{o.plan?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-white whitespace-nowrap">{formatCurrencyRaw(o.amount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3">
                      {o.purchase ? <StatusBadge status={o.purchase.status} /> : <span className="text-dark-600 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-400 whitespace-nowrap">{formatDate(o.created_at)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/orders/${o.id}`} className="text-brand-400 hover:text-brand-300">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <div className="text-center py-12 text-dark-400 text-sm">No orders found</div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-700/50">
            <p className="text-dark-400 text-sm">
              Page {page} of {pagination.pages} · {pagination.total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </AdminLayout>
  )
}
