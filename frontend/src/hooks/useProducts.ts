import { useState, useEffect } from 'react'
import { Product } from '../types'
import { productService, purchaseService } from '../services/api'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}

export function usePurchaseStats() {
  const [stats, setStats] = useState({
    totalPurchases: 0,
    activePurchases: 0,
    expiredPurchases: 0,
    totalSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    purchaseService.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}
