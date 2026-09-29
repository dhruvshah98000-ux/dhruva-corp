import React from 'react'
import { getStatusColor } from '../../utils/format'

interface BadgeProps {
  status: string
  label?: string
  className?: string
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, label, className = '' }) => {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        border capitalize ${getStatusColor(status)} ${className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {label || status}
    </span>
  )
}

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-dark-600 bg-dark-700 text-dark-300 ${className}`}>
    {children}
  </span>
)
