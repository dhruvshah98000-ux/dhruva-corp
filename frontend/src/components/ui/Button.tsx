import React from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'cyber' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  glow?: boolean
}

const variants = {
  primary: 'bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white border border-brand-400/40 shadow-glow hover:shadow-glow-lg',
  cyber: 'bg-gradient-to-r from-brand-600 via-indigo-600 to-cyber-cyan text-white border border-cyan-400/50 shadow-glow-cyan hover:shadow-glow-lg',
  success: 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white border border-emerald-400/40 shadow-glow-green',
  secondary: 'bg-dark-800 hover:bg-dark-700 text-white border border-dark-600/80 hover:border-dark-500 shadow-sm',
  danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white border border-red-500/50 shadow-glow-pink',
  ghost: 'bg-transparent hover:bg-dark-800 text-dark-200 hover:text-white border border-transparent',
  outline: 'bg-dark-900/60 hover:bg-brand-600/15 text-brand-400 hover:text-brand-300 border border-brand-500/40 hover:border-brand-400/80 shadow-sm hover:shadow-glow',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-lg',
  md: 'px-5 py-2.5 text-sm font-semibold rounded-xl',
  lg: 'px-7 py-3 text-base font-bold rounded-xl',
  xl: 'px-9 py-4 text-lg font-bold rounded-2xl',
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  glow = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        relative group overflow-hidden inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-brand-500/40
        disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none
        ${variants[variant]}
        ${sizes[size]}
        ${glow ? 'shadow-glow-lg' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {/* Dynamic Hover Sheen Animation */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {loading && <Loader2 className="h-4 w-4 animate-spin text-current shrink-0" />}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  )
}

