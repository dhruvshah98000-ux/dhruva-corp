import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          {...props}
          className={`
            w-full px-4 py-2.5 rounded-xl text-sm font-medium
            bg-dark-900/80 backdrop-blur-md border text-white placeholder-dark-500
            focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400
            transition-all duration-200 shadow-inner
            ${error ? 'border-red-500/70 focus:ring-red-500/30' : 'border-white/[0.08] hover:border-white/[0.15]'}
            ${props.disabled ? 'opacity-50 cursor-not-allowed bg-dark-950/60' : ''}
            ${className}
          `}
        />
      </div>
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  )
}

