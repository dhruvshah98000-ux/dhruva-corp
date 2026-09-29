import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Package, ShoppingCart, Search,
  ShieldCheck, Check
} from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { Modal } from '../components/ui/Modal'
import { ProductArt } from '../components/ui/ProductArt'
import { useProducts } from '../hooks/useProducts'
import { useAuth } from '../context/AuthContext'
import { Product, ProductPlan } from '../types'
import { formatCurrencyRaw } from '../utils/format'

const now = new Date().toISOString()

// Fallback seed products for immediate rich display if API is offline
const fallbackProducts: Product[] = [
  {
    id: 'fb-aimbot',
    name: 'Aimbot Pro',
    slug: 'aimbot',
    category: 'Panel',
    description: 'Precision humanized aimbot panel for Free Fire & Free Fire MAX. Smooth lock, zero shaking, and regular anti-detection updates.',
    features: [
      'Works on Free Fire, Free Fire MAX & Free Fire 86',
      'BlueStacks / MSI / LDPlayer / Nox / MEmu support',
      'Smooth aim calibration - fully configurable FOV',
      'Regular automated anti-detection updates',
      'Direct loader download + 24/7 Discord support',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p1', product_id: 'fb-aimbot', name: '1 Day', duration_days: 1, price_inr: 100, active: true, created_at: now },
      { id: 'p2', product_id: 'fb-aimbot', name: '7 Days', duration_days: 7, price_inr: 300, active: true, created_at: now },
      { id: 'p3', product_id: 'fb-aimbot', name: '1 Month', duration_days: 30, price_inr: 700, active: true, created_at: now },
      { id: 'p4', product_id: 'fb-aimbot', name: 'Permanent', duration_days: null, price_inr: 3500, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-brutal',
    name: 'Brutal / Max Aim',
    slug: 'brutal-max-aim',
    category: 'Panel',
    description: 'Maximum aggression aim panel. Highest damage output with brutal precision targeting for rank push and tournaments.',
    features: [
      'Works on Free Fire, Free Fire MAX & Free Fire 86',
      'Dual target fast-switch lock algorithm',
      'Auto recoil control & bullet curve correction',
      'All major PC emulators supported',
      'Dedicated VIP Discord role & ticket support',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p5', product_id: 'fb-brutal', name: '1 Day', duration_days: 1, price_inr: 200, active: true, created_at: now },
      { id: 'p6', product_id: 'fb-brutal', name: '7 Days', duration_days: 7, price_inr: 500, active: true, created_at: now },
      { id: 'p7', product_id: 'fb-brutal', name: '1 Month', duration_days: 30, price_inr: 1000, active: true, created_at: now },
      { id: 'p8', product_id: 'fb-brutal', name: 'Permanent', duration_days: null, price_inr: 5000, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-aimkill',
    name: 'Aimkill Headshot Lock',
    slug: 'aimkill',
    category: 'Panel',
    description: 'Auto-kill aim panel with instant target lock. Built for competitive Free Fire gameplay with 0ms trigger response.',
    features: [
      'Instant headshot lock system',
      'Configurable aim speed, FOV & trigger delay',
      'Full emulator compatibility',
      'Zero ban history with kernel shield',
      'Instant license activation',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p9', product_id: 'fb-aimkill', name: '1 Day', duration_days: 1, price_inr: 100, active: true, created_at: now },
      { id: 'p10', product_id: 'fb-aimkill', name: '7 Days', duration_days: 7, price_inr: 500, active: true, created_at: now },
      { id: 'p11', product_id: 'fb-aimkill', name: '1 Month', duration_days: 30, price_inr: 1000, active: true, created_at: now },
      { id: 'p12', product_id: 'fb-aimkill', name: 'Permanent', duration_days: null, price_inr: 4000, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-uid-bypass',
    name: 'UID Safe Bypass',
    slug: 'uid-bypass',
    category: 'Bypass',
    description: 'UID-level device and account protection bypass for Free Fire. Protects your main account from blacklists and bans.',
    features: [
      'UID-level account protection & spoofing',
      'Emulator hardware signature mask',
      'Safe for main gaming accounts',
      'Zero latency packet filtering',
      'Regular patch updates included',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p13', product_id: 'fb-uid-bypass', name: '1 Day', duration_days: 1, price_inr: 150, active: true, created_at: now },
      { id: 'p14', product_id: 'fb-uid-bypass', name: '7 Days', duration_days: 7, price_inr: 400, active: true, created_at: now },
      { id: 'p15', product_id: 'fb-uid-bypass', name: '1 Month', duration_days: 30, price_inr: 1000, active: true, created_at: now },
      { id: 'p16', product_id: 'fb-uid-bypass', name: 'Permanent', duration_days: null, price_inr: 4000, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-lib-bypass',
    name: 'LIB Kernel Bypass',
    slug: 'lib-bypass',
    category: 'Bypass',
    description: 'Library-level deep system bypass. Intercepts memory scanning and anti-cheat hooks for 100% undetected gameplay.',
    features: [
      'Ring-0 memory hooking architecture',
      'In-memory code obfuscation',
      'Compatible with BlueStacks, MSI & LDPlayer',
      'Automated background updates',
      'Instant delivery upon checkout',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p17', product_id: 'fb-lib-bypass', name: '1 Day', duration_days: 1, price_inr: 150, active: true, created_at: now },
      { id: 'p18', product_id: 'fb-lib-bypass', name: '7 Days', duration_days: 7, price_inr: 500, active: true, created_at: now },
      { id: 'p19', product_id: 'fb-lib-bypass', name: '1 Month', duration_days: 30, price_inr: 1200, active: true, created_at: now },
      { id: 'p20', product_id: 'fb-lib-bypass', name: 'Permanent', duration_days: null, price_inr: 5000, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-mobile',
    name: 'Android Mobile Panel',
    slug: 'mobile-panel',
    category: 'Mobile',
    description: 'Panel optimized exclusively for Android smartphones and tablets. No PC or emulator required — install and play directly.',
    features: [
      'Native Android APK installation',
      'No PC or USB debugging needed',
      'Non-root support for all modern devices',
      'Smooth touch sensitivity multiplier',
      'Frequent automated OTA patches',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p21', product_id: 'fb-mobile', name: '1 Day', duration_days: 1, price_inr: 100, active: true, created_at: now },
      { id: 'p22', product_id: 'fb-mobile', name: '7 Days', duration_days: 7, price_inr: 350, active: true, created_at: now },
      { id: 'p23', product_id: 'fb-mobile', name: '1 Month', duration_days: 30, price_inr: 800, active: true, created_at: now },
      { id: 'p24', product_id: 'fb-mobile', name: 'Permanent', duration_days: null, price_inr: 3500, active: true, created_at: now },
    ],
  },
  {
    id: 'fb-ios',
    name: 'iOS VIP Panel',
    slug: 'ios-panel',
    category: 'Mobile',
    description: 'Exclusive panel for iPhone and iPad devices. No jailbreak required with premium direct certificate configuration.',
    features: [
      'No jailbreak required on iOS 15 / 16 / 17+',
      'Direct Apple certificate profile installation',
      'Native Free Fire & MAX support',
      'Ultra smooth aim calibration',
      'VIP Discord ticket support included',
    ],
    active: true,
    image_url: null,
    created_at: now,
    updated_at: now,
    plans: [
      { id: 'p25', product_id: 'fb-ios', name: '7 Days', duration_days: 7, price_inr: 700, active: true, created_at: now },
      { id: 'p26', product_id: 'fb-ios', name: '1 Month', duration_days: 30, price_inr: 1500, active: true, created_at: now },
      { id: 'p27', product_id: 'fb-ios', name: 'Permanent', duration_days: null, price_inr: 8000, active: true, created_at: now },
    ],
  },
]

const PlanCard: React.FC<{
  plan: ProductPlan
  selected: boolean
  onSelect: () => void
}> = ({ plan, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full text-left p-2.5 sm:p-3 rounded-xl border transition-all duration-200 select-none ${
      selected
        ? 'border-brand-400 bg-brand-600/20 shadow-glow'
        : 'border-white/[0.08] hover:border-white/[0.2] bg-dark-900/60'
    }`}
  >
    <div className="flex items-center justify-between">
      <div>
        <div className="font-bold text-white text-xs">{plan.name}</div>
        <div className="text-[10px] text-dark-400">
          {plan.duration_days === null ? 'Permanent' : `${plan.duration_days} Days`}
        </div>
      </div>
      <div className={`text-sm font-black font-mono ${selected ? 'text-cyber-cyan' : 'text-white'}`}>
        {formatCurrencyRaw(plan.price_inr)}
      </div>
    </div>
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
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/products' } } })
      return
    }
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
      <Card hover glow className="flex flex-col h-full group">
        {/* Product Visual Art Banner */}
        <div className="h-52 overflow-hidden rounded-t-2xl relative bg-dark-950">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <ProductArt slug={product.slug} category={product.category} />
          )}
        </div>

        <CardBody className="flex flex-col flex-1 p-6 space-y-4">
          {/* Title & Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-brand-400 font-bold">
                {product.category}
              </span>
              <span className="text-[11px] font-mono text-dark-400">FF / FF MAX</span>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition-colors">
              {product.name}
            </h3>
            <p className="text-dark-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features Checklist */}
          <ul className="space-y-1.5 border-t border-white/[0.06] pt-3">
            {product.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-dark-300">
                <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
            {product.features.length > 4 && (
              <li className="text-[11px] font-mono text-brand-400 pt-0.5">
                +{product.features.length - 4} more features included
              </li>
            )}
          </ul>

          {/* Plan Selector */}
          {product.plans && product.plans.length > 0 && (
            <div className="space-y-2 mt-auto pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-dark-400">
                <span>Select Duration</span>
                <span className="text-cyber-cyan font-bold">
                  {selectedPlan ? formatCurrencyRaw(selectedPlan.price_inr) : ''}
                </span>
              </div>
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

          {/* Buy Now Button */}
          <Button
            fullWidth
            size="md"
            onClick={handleBuyNow}
            disabled={!selectedPlan}
            className="mt-2 font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-[0_0_15px_rgba(255,42,75,0.4)] border-none"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy Now {selectedPlan ? `— ${formatCurrencyRaw(selectedPlan.price_inr)}` : ''}
          </Button>
        </CardBody>
      </Card>

      {/* Order Summary Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm Order Details" size="sm">
        <div className="space-y-4">
          <div className="bg-dark-950/80 border border-white/[0.08] rounded-2xl p-4 space-y-3 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-dark-400">Product:</span>
              <span className="text-white font-bold">{product.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-400">Plan Duration:</span>
              <span className="text-brand-300 font-bold">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-dark-400">Support Channel:</span>
              <span className="text-white">Discord VIP / Ticket</span>
            </div>
            <div className="border-t border-white/[0.08] pt-3 flex justify-between items-center">
              <span className="text-dark-300 text-xs font-sans">Total Amount</span>
              <span className="text-amber-400 font-black text-xl">
                {selectedPlan ? formatCurrencyRaw(selectedPlan.price_inr) : '—'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Instant key generation & direct loader link on payment completion.</span>
          </div>

          <div className="flex gap-2.5 pt-1">
            <Button variant="secondary" fullWidth size="md" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              fullWidth
              size="md"
              onClick={handleConfirm}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-[0_0_15px_rgba(255,42,75,0.4)] border-none"
            >
              Proceed to Razorpay
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export const ProductsPage: React.FC = () => {
  const { products: apiProducts, loading } = useProducts()
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured')

  // Use API products if available; if API failed or empty, gracefully fallback to seed products
  const displayProducts = useMemo(() => {
    return apiProducts && apiProducts.length > 0 ? apiProducts : fallbackProducts
  }, [apiProducts])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(displayProducts.map((p) => p.category)))]
  }, [displayProducts])

  // Filter & Search
  const filtered = useMemo(() => {
    let result = displayProducts.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter
      const q = searchQuery.toLowerCase()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })

    if (sortOrder === 'price-asc') {
      result = [...result].sort((a, b) => (a.plans?.[0]?.price_inr || 0) - (b.plans?.[0]?.price_inr || 0))
    } else if (sortOrder === 'price-desc') {
      result = [...result].sort((a, b) => (b.plans?.[0]?.price_inr || 0) - (a.plans?.[0]?.price_inr || 0))
    }

    return result
  }, [displayProducts, categoryFilter, searchQuery, sortOrder])

  return (
    <MainLayout>
      <div className="page-container py-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(255,42,75,0.15)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            🔥 FREE FIRE MAX & OB44 VERIFIED • 100% HEADSHOT ACCURACY
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Free Fire Headshot Store
          </h1>
          <p className="text-dark-300 text-sm sm:text-base max-w-xl mx-auto">
            Battle-tested aimbot panels, drag-headshot configurations, and ring-0 kernel bypasses with zero ban risk and instant delivery.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
              <input
                type="text"
                placeholder="Search panels, bypasses, features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-dark-900/80 border border-white/[0.08] text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-400 transition-all shadow-inner"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-dark-400 font-mono hidden sm:inline">SORT:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs font-mono bg-dark-900/80 border border-white/[0.08] text-dark-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              >
                <option value="featured">Featured Builds</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map((cat) => {
              const count =
                cat === 'All'
                  ? displayProducts.length
                  : displayProducts.filter((p) => p.category === cat).length

              const active = categoryFilter === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all duration-200 flex items-center gap-2 select-none ${
                    active
                      ? 'bg-brand-600 text-white shadow-glow border border-brand-400/50'
                      : 'bg-dark-900/60 text-dark-400 hover:text-white border border-white/[0.06] hover:bg-dark-850'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? 'bg-white/20 text-white' : 'bg-dark-800 text-dark-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Products Grid */}
        {loading && displayProducts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 glass-card p-8">
            <Package className="h-16 w-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No matching products found</h3>
            <p className="text-dark-400 text-sm mt-1">Try modifying your search query or category filter.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearchQuery(''); setCategoryFilter('All') }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
