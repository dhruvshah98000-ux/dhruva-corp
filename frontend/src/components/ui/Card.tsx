import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, glow = false }) => {
  return (
    <div
      className={`
        bg-dark-800/60 border border-dark-700/50 rounded-xl backdrop-blur-sm
        ${hover ? 'hover:border-brand-500/30 hover:bg-dark-800/80 transition-all duration-200 cursor-pointer' : ''}
        ${glow ? 'shadow-glow' : 'shadow-card'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 border-b border-dark-700/50 ${className}`}>{children}</div>
)

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-dark-700/50 ${className}`}>{children}</div>
)
