import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Power, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { adminService } from '../../services/api'
import { formatCurrencyRaw } from '../../utils/format'

interface Plan { id: string; name: string; price_inr: number; duration_days: number | null; active: boolean }
interface Product { id: string; name: string; slug: string; description: string; features: string[]; category: string; active: boolean; plans: Plan[] }

const emptyProduct = { name: '', slug: '', description: '', features: [''], category: 'Software', image_url: '', active: true }
const emptyPlan = { name: '', price_inr: '', duration_days: '', active: true }

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Product modal state
  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState(emptyProduct)
  const [savingProduct, setSavingProduct] = useState(false)

  // Plan modal state
  const [planModal, setPlanModal] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [planForm, setPlanForm] = useState(emptyPlan)
  const [savingPlan, setSavingPlan] = useState(false)

  const reload = () => adminService.getProducts().then(setProducts).finally(() => setLoading(false))

  useEffect(() => { reload() }, [])

  const openNewProduct = () => { setEditingProduct(null); setProductForm(emptyProduct); setProductModal(true) }
  const openEditProduct = (p: Product) => {
    setEditingProduct(p)
    setProductForm({ name: p.name, slug: p.slug, description: p.description, features: p.features, category: p.category, image_url: '', active: p.active })
    setProductModal(true)
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProduct(true)
    try {
      const payload = { ...productForm, features: productForm.features.filter(f => f.trim()) }
      if (editingProduct) await adminService.updateProduct(editingProduct.id, payload)
      else await adminService.createProduct(payload)
      toast.success(editingProduct ? 'Product updated' : 'Product created')
      setProductModal(false)
      reload()
    } catch { toast.error('Failed to save product') }
    finally { setSavingProduct(false) }
  }

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await adminService.toggleProductActive(id, !active)
      toast.success(!active ? 'Product enabled' : 'Product disabled')
      reload()
    } catch { toast.error('Failed to update') }
  }

  const openNewPlan = (productId: string) => {
    setSelectedProductId(productId); setEditingPlan(null); setPlanForm(emptyPlan); setPlanModal(true)
  }
  const openEditPlan = (productId: string, plan: Plan) => {
    setSelectedProductId(productId); setEditingPlan(plan)
    setPlanForm({ name: plan.name, price_inr: String(plan.price_inr), duration_days: plan.duration_days === null ? '' : String(plan.duration_days), active: plan.active })
    setPlanModal(true)
  }

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPlan(true)
    try {
      const payload = {
        name: planForm.name,
        price_inr: Number(planForm.price_inr),
        duration_days: planForm.duration_days === '' ? null : Number(planForm.duration_days),
        active: planForm.active,
      }
      if (editingPlan) await adminService.updatePlan(editingPlan.id, payload)
      else await adminService.createPlan(selectedProductId, payload)
      toast.success(editingPlan ? 'Plan updated' : 'Plan created')
      setPlanModal(false)
      reload()
    } catch { toast.error('Failed to save plan') }
    finally { setSavingPlan(false) }
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-dark-400 text-sm mt-1">{products.length} products</p>
        </div>
        <Button onClick={openNewProduct} size="sm">
          <Plus className="h-4 w-4" /> New Product
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-20 bg-dark-800/40 rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer"
                onClick={() => setExpanded(expanded === product.id ? null : product.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full ${product.active ? 'bg-green-400' : 'bg-dark-600'}`} />
                  <div>
                    <p className="text-white font-semibold">{product.name}</p>
                    <p className="text-dark-500 text-xs mt-0.5">{product.category} · {product.plans?.length || 0} plans</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openEditProduct(product) }}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={product.active ? 'danger' : 'outline'}
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); toggleActive(product.id, product.active) }}
                  >
                    <Power className="h-3.5 w-3.5" />
                    {product.active ? 'Disable' : 'Enable'}
                  </Button>
                  {expanded === product.id ? <ChevronUp className="h-4 w-4 text-dark-500" /> : <ChevronDown className="h-4 w-4 text-dark-500" />}
                </div>
              </div>

              {expanded === product.id && (
                <div className="border-t border-dark-700/50 px-6 py-4">
                  <p className="text-dark-400 text-sm mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.features?.map((f) => <Badge key={f}>{f}</Badge>)}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-medium text-sm">Plans</p>
                    <Button variant="outline" size="sm" onClick={() => openNewPlan(product.id)}>
                      <Plus className="h-3.5 w-3.5" /> Add Plan
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(product.plans || []).map((plan) => (
                      <div
                        key={plan.id}
                        className={`p-3 rounded-xl border ${plan.active ? 'border-dark-600 bg-dark-900/40' : 'border-dark-800 bg-dark-900/20 opacity-50'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium text-sm">{plan.name}</span>
                          <Button variant="ghost" size="sm" onClick={() => openEditPlan(product.id, plan)}>
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <p className="text-brand-400 font-bold">{formatCurrencyRaw(plan.price_inr)}</p>
                        <p className="text-dark-500 text-xs mt-0.5">
                          {plan.duration_days === null ? 'Permanent' : `${plan.duration_days} days`}
                          {!plan.active && ' · Disabled'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
          {products.length === 0 && (
            <div className="text-center py-16 text-dark-400">No products yet. Create one!</div>
          )}
        </div>
      )}

      {/* Product Modal */}
      <Modal open={productModal} onClose={() => setProductModal(false)} title={editingProduct ? 'Edit Product' : 'New Product'} size="lg">
        <form onSubmit={saveProduct} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Product Name" value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} required />
            <Input label="Slug" value={productForm.slug} onChange={e => setProductForm(p => ({ ...p, slug: e.target.value }))} hint="e.g. my-product" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-1.5">Description</label>
            <textarea
              value={productForm.description}
              onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg text-sm bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
              required
            />
          </div>
          <Input label="Category" value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} required />
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">Features</label>
            {productForm.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={f}
                  placeholder={`Feature ${i + 1}`}
                  onChange={e => {
                    const updated = [...productForm.features]; updated[i] = e.target.value
                    setProductForm(p => ({ ...p, features: updated }))
                  }}
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
                <button type="button" onClick={() => setProductForm(p => ({ ...p, features: p.features.filter((_, j) => j !== i) }))} className="text-red-400 hover:text-red-300 px-2">×</button>
              </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => setProductForm(p => ({ ...p, features: [...p.features, ''] }))}>
              <Plus className="h-3.5 w-3.5" /> Add Feature
            </Button>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={productForm.active} onChange={e => setProductForm(p => ({ ...p, active: e.target.checked }))} className="rounded border-dark-600" />
            <span className="text-sm text-dark-300">Active (visible to customers)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setProductModal(false)}>Cancel</Button>
            <Button type="submit" fullWidth loading={savingProduct}>{editingProduct ? 'Update' : 'Create'} Product</Button>
          </div>
        </form>
      </Modal>

      {/* Plan Modal */}
      <Modal open={planModal} onClose={() => setPlanModal(false)} title={editingPlan ? 'Edit Plan' : 'New Plan'} size="sm">
        <form onSubmit={savePlan} className="space-y-4">
          <Input label="Plan Name" placeholder="e.g. 7 Days" value={planForm.name} onChange={e => setPlanForm(p => ({ ...p, name: e.target.value }))} required />
          <Input label="Price (₹)" type="number" min="1" placeholder="299" value={planForm.price_inr} onChange={e => setPlanForm(p => ({ ...p, price_inr: e.target.value }))} required />
          <Input label="Duration (days)" type="number" min="1" placeholder="Leave empty for permanent" value={planForm.duration_days} onChange={e => setPlanForm(p => ({ ...p, duration_days: e.target.value }))} hint="Leave empty for permanent/lifetime access" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={planForm.active} onChange={e => setPlanForm(p => ({ ...p, active: e.target.checked }))} className="rounded border-dark-600" />
            <span className="text-sm text-dark-300">Active</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" fullWidth onClick={() => setPlanModal(false)}>Cancel</Button>
            <Button type="submit" fullWidth loading={savingPlan}>{editingPlan ? 'Update' : 'Create'} Plan</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  )
}
