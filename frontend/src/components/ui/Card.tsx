import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  glass?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  glow = false,
  glass = true,
}) => {
  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden
        ${glass ? 'bg-dark-900/70 backdrop-blur-xl border border-white/[0.08]' : 'bg-dark-850 border border-dark-700/60'}
        ${hover ? 'hover:border-brand-500/40 hover:bg-dark-850/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow cursor-pointer' : 'transition-all duration-200'}
        ${glow ? 'shadow-glow border-brand-500/30' : 'shadow-card'}
        ${className}
      `}
    >
      {/* Top subtle sheen line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  )
}

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4.5 border-b border-white/[0.06] bg-white/[0.01] ${className}`}>
    {children}
  </div>
)

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`px-6 py-4 border-t border-white/[0.06] bg-white/[0.01] ${className}`}>
    {children}
  </div>
)

