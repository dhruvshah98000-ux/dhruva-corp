import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  withText?: boolean
  subtitle?: string
  iconType?: 'mascot' | 'headshot-skull'
}

export const DhruvaLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  withText = true,
  subtitle = 'FREE FIRE HEADSHOT',
  iconType = 'headshot-skull',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
  }

  const logoImgSrc = iconType === 'mascot' ? '/images/logo.jpg' : '/images/ff-headshot-skull-badge.png'

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Free Fire Headshot Emblem */}
      <div className={`relative ${iconSizes[size]} shrink-0 group`}>
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-red-600/50 rounded-full blur-md group-hover:bg-red-500/70 transition-all duration-300" />
        
        <img
          src={logoImgSrc}
          alt="Free Fire Headshot Logo"
          className="relative w-full h-full object-cover rounded-xl border border-red-500/50 shadow-[0_0_15px_rgba(255,42,75,0.7)] group-hover:scale-105 transition-transform duration-300 bg-black/60 p-0.5"
        />
      </div>

      {/* Brand & Headshot Typography */}
      {withText && (
        <div className="flex flex-col leading-tight">
          <div className={`font-black tracking-wider text-white ${textSizes[size]} flex items-center gap-1.5`}>
            <span>DHRUVA</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-400 font-extrabold">
              CORP
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold -mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
