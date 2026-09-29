import { format, parseISO } from 'date-fns'

export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount / 100) // Razorpay uses paise
}

export const formatCurrencyRaw = (amountInRupees: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountInRupees)
}

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

export const formatDateTime = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy, hh:mm a')
  } catch {
    return dateStr
  }
}

export const truncateId = (id: string, length = 16): string => {
  if (id.length <= length) return id
  return `${id.slice(0, length)}...`
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'paid':
      return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'pending':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    case 'expired':
    case 'failed':
    case 'cancelled':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'permanent':
      return 'text-brand-400 bg-brand-400/10 border-brand-400/20'
    case 'refunded':
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
  }
}
