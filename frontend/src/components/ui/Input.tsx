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
        <label htmlFor={inputId} className="block text-sm font-medium text-dark-200">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={`
          w-full px-4 py-2.5 rounded-lg text-sm
          bg-dark-800 border text-white placeholder-dark-400
          focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50
          transition-colors duration-150
          ${error ? 'border-red-500/60' : 'border-dark-600'}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      />
      {hint && !error && <p className="text-xs text-dark-400">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
