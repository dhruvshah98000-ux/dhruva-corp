import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Package, ShoppingCart, Zap } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { Modal } from '../components/ui/Modal'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { Product, ProductPlan } from '../types'
import { formatCurrencyRaw } from '../utils/format'

const PlanCard: React.FC<{
  plan: ProductPlan
  selected: boolean
  onSelect: () => void
}> = ({ plan, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 ${
      selected
        ? 'border-brand-500 bg-brand-600/10 shadow-glow'
        : 'border-dark-600 hover:border-dark-500 bg-dark-800/40'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-white text-sm">{plan.name}</div>
        <div className="text-xs text-dark-400 mt-0.5">
          {plan.duration_days === null ? 'Lifetime access' : `${plan.duration_days} day${plan.duration_days !== 1 ? 's' : ''}`}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-bold ${selected ? 'text-brand-400' : 'text-white'}`}>
          {formatCurrencyRaw(plan.price_inr)}
        </div>
      </div>
    </div>
    {selected && (
      <div className="mt-2 flex items-center gap-1 text-xs text-brand-400">
        <CheckCircle2 className="h-3.5 w-3.5" /> Selected
      </div>
    )}
  </button>
)

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [selectedPlan, setSelectedPlan] = useState<ProductPlan | null>(
    product.plans?.[0] ?? null
  )
  const [showModal, setShowModal] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return }
    if (!selectedPlan) return
    setShowModal(true)
  }

  const handleConfirm = () => {
    if (!selectedPlan) return
    navigate('/checkout', {
      state: { product, plan: selectedPlan },
    })
  }

  return (
    <>
      <Card className="flex flex-col h-full">
        {product.image_url && (
          <div className="h-44 overflow-hidden rounded-t-xl">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}
        {!product.image_url && (
          <div className="h-44 bg-gradient-to-br from-brand-600/20 to-dark-800 rounded-t-xl flex items-center justify-center">
            <Package className="h-14 w-14 text-brand-400/50" />
          </div>
        )}
        <CardBody className="flex flex-col flex-1 gap-4">
          {/* Header */}
          <div>
            <div className="text-xs text-brand-400 font-medium uppercase tracking-wider mb-1">{product.category}</div>
            <h3 className="text-lg font-bold text-white">{product.name}</h3>
            <p className="text-dark-400 text-sm mt-1 leading-relaxed line-clamp-2">{product.description}</p>
          </div>

          {/* Features */}
          <ul className="space-y-1.5">
            {product.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-dark-300">
                <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
            {product.features.length > 4 && (
              <li className="text-xs text-dark-500">+{product.features.length - 4} more features</li>
            )}
          </ul>

          {/* Plans */}
          {product.plans && product.plans.length > 0 && (
            <div className="space-y-2 mt-auto">
              <div className="text-xs text-dark-400 font-medium uppercase tracking-wider">Select Plan</div>
              <div className="grid grid-cols-2 gap-2">
                {product.plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    selected={selectedPlan?.id === plan.id}
                    onSelect={() => setSelectedPlan(plan)}
                  />
                ))}
              </div>
            </div>
          )}

          <Button
            fullWidth
            size="lg"
            onClick={handleBuyNow}
            disabled={!selectedPlan}
            className="mt-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now {selectedPlan ? `— ${formatCurrencyRaw(selectedPlan.price_inr)}` : ''}
          </Button>
        </CardBody>
      </Card>

      {/* Order summary modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Order Summary" size="sm">
        <div className="space-y-4">
          <div className="bg-dark-900/60 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Product</span>
              <span className="text-white font-medium">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Plan</span>
              <span className="text-white font-medium">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Duration</span>
              <span className="text-white font-medium">
                {selectedPlan?.duration_days === null
                  ? 'Permanent'
                  : `${selectedPlan?.duration_days} days`}
              </span>
            </div>
            <div className="border-t border-dark-700 pt-3 flex justify-between">
              <span className="text-dark-400">Total</span>
              <span className="text-brand-400 font-bold text-lg">
                {selectedPlan ? formatCurrencyRaw(selectedPlan.price_inr) : '—'}
              </span>
            </div>
          </div>

          <div className="text-xs text-dark-500 text-center">
            You'll be redirected to secure Razorpay checkout
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button fullWidth onClick={handleConfirm}>
              Proceed to Pay
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const ProductsPage: React.FC = () => {
  const { products, loading, error } = useProducts()
  const [categoryFilter, setCategoryFilter] = useState('All')

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]
  const filtered = categoryFilter === 'All' ? products : products.filter((p) => p.category === categoryFilter)

  return (
    <MainLayout>
      <div className="page-container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-4">
            <Zap className="h-3 w-3" /> Premium Products
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Our Products</h1>
          <p className="text-dark-400 max-w-lg mx-auto">
            Professional digital products with flexible plans. Secure payment, instant access.
          </p>
        </div>

        {/* Category filter */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-dark-800 text-dark-400 hover:text-white border border-dark-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <Package className="h-14 w-14 text-dark-600 mx-auto mb-4" />
            <p className="text-dark-400">No products available at the moment.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
