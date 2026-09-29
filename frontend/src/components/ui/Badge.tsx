import React from 'react'
import { getStatusColor } from '../../utils/format'

interface BadgeProps {
  status: string
  label?: string
  className?: string
  pulse?: boolean
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, label, className = '', pulse = true }) => {
  const norm = status.toLowerCase()
  const isGood = norm === 'active' || norm === 'paid' || norm === 'permanent' || norm === 'undetected'

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
        border capitalize tracking-wide backdrop-blur-md transition-all
        ${getStatusColor(status)} ${className}
      `}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        {pulse && isGood && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
        )}
        <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
      </span>
      {label || status}
    </span>
  )
}

export const Badge: React.FC<{
  children: React.ReactNode
  variant?: 'brand' | 'cyan' | 'green' | 'red' | 'purple' | 'dark'
  className?: string
}> = ({ children, variant = 'dark', className = '' }) => {
  const styles = {
    brand: 'bg-brand-600/15 text-brand-300 border-brand-500/30',
    cyan: 'bg-cyber-cyan/10 text-cyan-300 border-cyber-cyan/30',
    green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dark: 'bg-dark-800 text-dark-300 border-dark-700/80',
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
        backdrop-blur-sm ${styles[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}

