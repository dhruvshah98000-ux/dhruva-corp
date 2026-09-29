import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim & Blur Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`
          relative w-full ${sizes[size]} bg-dark-900/95 border border-white/[0.12]
          rounded-2xl shadow-glass shadow-2xl backdrop-blur-2xl animate-slide-up overflow-hidden
        `}
      >
        {/* Top ambient highlight */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-brand-400/80 to-transparent" />

        {title && (
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.08] bg-white/[0.02]">
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-dark-400 hover:text-white hover:bg-dark-800 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

