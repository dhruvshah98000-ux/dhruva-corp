import React, { useEffect, useState, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { Modal } from '../../components/ui/Modal'
import { TableRowSkeleton } from '../../components/ui/Skeleton'
import { adminService } from '../../services/api'
import { formatCurrencyRaw, formatDate } from '../../utils/format'

interface Customer {
  id: string; auth_user_id: string; full_name: string | null; email: string
  phone: string | null; discord_username: string | null; created_at: string
  totalPurchases: number; totalSpent: number; activePurchases: number
}

interface PurchaseRow {
  id: string; product_name_snapshot: string; plan_name_snapshot: string
  amount_paid: number; purchased_at: string; expires_at: string | null; status: string
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerPurchases, setCustomerPurchases] = useState<PurchaseRow[]>([])
  const [loadingPurchases, setLoadingPurchases] = useState(false)

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page, limit: 20 }
      if (search) params.search = search
      const res = await adminService.getCustomers(params)
      setCustomers(res.data || [])
      setPagination(res.pagination)
    } finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])

  const viewCustomer = async (c: Customer) => {
    setSelectedCustomer(c)
    setLoadingPurchases(true)
    try {
      const data = await adminService.getCustomerPurchases(c.auth_user_id)
      setCustomerPurchases(data)
    } finally { setLoadingPurchases(false) }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-dark-400 text-sm mt-1">{pagination.total} registered customers</p>
      </div>

      <div className="mb-5">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-sm text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-dark-700/50">
                {['Customer', 'Phone', 'Discord', 'Joined', 'Purchases', 'Spent', 'Active', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800/50">
              {loading
                ? [1,2,3,4,5].map(i => <TableRowSkeleton key={i} cols={8} />)
                : customers.map((c) => (
                  <tr key={c.id} className="hover:bg-dark-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="text-white text-sm font-medium">{c.full_name || '—'}</div>
                      <div className="text-dark-500 text-xs mt-0.5">{c.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-300">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-dark-300">{c.discord_username || '—'}</td>
                    <td className="px-4 py-3 text-sm text-dark-400 whitespace-nowrap">{formatDate(c.created_at)}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium text-center">{c.totalPurchases}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium whitespace-nowrap">{formatCurrencyRaw(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${c.activePurchases > 0 ? 'bg-green-500/20 text-green-400' : 'bg-dark-700 text-dark-500'}`}>
                        {c.activePurchases}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => viewCustomer(c)} className="text-brand-400 hover:text-brand-300 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!loading && customers.length === 0 && (
            <div className="text-center py-12 text-dark-400 text-sm">No customers found</div>
          )}
        </div>
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-700/50">
            <p className="text-dark-400 text-sm">Page {page} of {pagination.pages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1} className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(pagination.pages, p+1))} disabled={page >= pagination.pages} className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-dark-400 hover:text-white disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Customer detail modal */}
      <Modal open={!!selectedCustomer} onClose={() => setSelectedCustomer(null)} title="Customer Details" size="xl">
        {selectedCustomer && (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              {[
                ['Name', selectedCustomer.full_name || '—'],
                ['Email', selectedCustomer.email],
                ['Phone', selectedCustomer.phone || '—'],
                ['Discord', selectedCustomer.discord_username || '—'],
                ['Joined', formatDate(selectedCustomer.created_at)],
                ['Total Spent', formatCurrencyRaw(selectedCustomer.totalSpent)],
              ].map(([l, v]) => (
                <div key={l}>
                  <span className="text-dark-400">{l}: </span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
            </div>
            <h4 className="text-white font-semibold mb-3 text-sm">Purchase History</h4>
            {loadingPurchases ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-10 bg-dark-700 rounded animate-pulse" />)}</div>
            ) : customerPurchases.length === 0 ? (
              <p className="text-dark-500 text-sm text-center py-4">No purchases</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {customerPurchases.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg">
                    <div>
                      <p className="text-white text-sm font-medium">{p.product_name_snapshot}</p>
                      <p className="text-dark-500 text-xs">{p.plan_name_snapshot} · {formatDate(p.purchased_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white text-sm font-semibold">{formatCurrencyRaw(p.amount_paid)}</span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </AdminLayout>
  )
}
