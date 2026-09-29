import React from 'react'
import { Crosshair, Shield, Flame, Smartphone, Apple } from 'lucide-react'

interface ProductArtProps {
  slug?: string
  className?: string
  category?: string
}

export const ProductArt: React.FC<ProductArtProps> = ({ slug = '', className = '', category = '' }) => {
  const normSlug = slug.toLowerCase()

  // Select authentic Free Fire game imagery based on product slug
  let imageSrc = '/images/ff-onetap-headshot.jpg'
  let badgeLabel = 'FREE FIRE MAX'
  let badgeColor = 'bg-red-500/25 text-red-300 border-red-500/40'
  let statTopLeft = 'ONE TAP HEADSHOT'
  let statTopRight = 'UNDETECTED'
  let IconComponent = Crosshair
  let accentGlow = 'rgba(255, 42, 75, 0.45)'

  if (normSlug.includes('brutal') || normSlug.includes('max-aim')) {
    imageSrc = '/images/ff-skull-headshot.jpg'
    badgeLabel = 'RED NUMBERS ONLY'
    badgeColor = 'bg-red-600/30 text-red-200 border-red-500/50'
    statTopLeft = 'SKULL HEADSHOT KILL'
    statTopRight = 'AUTO DRAG'
    IconComponent = Flame
    accentGlow = 'rgba(255, 42, 75, 0.6)'
  } else if (normSlug.includes('aimkill')) {
    imageSrc = '/images/ff-fov-aim.jpg'
    badgeLabel = '360° FOV AIMBOT'
    badgeColor = 'bg-red-500/30 text-red-300 border-red-500/40'
    statTopLeft = 'INSTANT TRIGGERBOT'
    statTopRight = 'AUTO LOCK'
    IconComponent = Crosshair
    accentGlow = 'rgba(255, 42, 75, 0.5)'
  } else if (normSlug.includes('aimbot')) {
    imageSrc = '/images/ff-onetap-headshot.jpg'
    badgeLabel = 'ONE TAP HEADSHOT'
    badgeColor = 'bg-red-500/25 text-red-300 border-red-500/40'
    statTopLeft = '100% HEADSHOT RATE'
    statTopRight = 'GRANDMASTER'
    IconComponent = Crosshair
    accentGlow = 'rgba(255, 42, 75, 0.5)'
  } else if (normSlug.includes('uid')) {
    imageSrc = '/images/shield-bypass.jpg'
    badgeLabel = 'UID ANTI-BLACKLIST'
    badgeColor = 'bg-amber-500/25 text-amber-300 border-amber-500/40'
    statTopLeft = 'HWID CLOAKED'
    statTopRight = '0% BAN RATE'
    IconComponent = Shield
    accentGlow = 'rgba(245, 158, 11, 0.4)'
  } else if (normSlug.includes('lib') || normSlug.includes('bypass')) {
    imageSrc = '/images/shield-bypass.jpg'
    badgeLabel = 'KERNEL RING-0'
    badgeColor = 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
    statTopLeft = 'MEMORY HOOK SAFE'
    statTopRight = 'OB44 COMPLIANT'
    IconComponent = Shield
    accentGlow = 'rgba(16, 185, 129, 0.4)'
  } else if (normSlug.includes('mobile')) {
    imageSrc = '/images/ff-laser-aim.jpg'
    badgeLabel = 'ANDROID APK DIRECT'
    badgeColor = 'bg-blue-500/25 text-blue-300 border-blue-500/40'
    statTopLeft = 'LASER AIM LOCK'
    statTopRight = 'NO PC / NO ROOT'
    IconComponent = Smartphone
    accentGlow = 'rgba(59, 130, 246, 0.4)'
  } else if (normSlug.includes('ios')) {
    imageSrc = '/images/mobile-gaming.jpg'
    badgeLabel = 'IOS CERTIFICATE'
    badgeColor = 'bg-purple-500/25 text-purple-300 border-purple-500/40'
    statTopLeft = 'IOS 15 / 16 / 17+'
    statTopRight = 'NO JAILBREAK'
    IconComponent = Apple
    accentGlow = 'rgba(168, 85, 247, 0.4)'
  }

  return (
    <div className={`relative w-full h-full overflow-hidden bg-dark-950 flex items-center justify-center select-none ${className}`}>
      {/* High-Resolution Authentic Free Fire Gameplay Image */}
      <img
        src={imageSrc}
        alt={category || slug}
        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Cyberpunk & Vignette Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-black/40 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${accentGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Subtle Scanlines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />

      {/* Tactical HUD Header */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono tracking-wider z-10">
        <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white/90 border border-white/10 flex items-center gap-1">
          <IconComponent className="h-3 w-3 text-red-400" />
          <span>{statTopLeft}</span>
        </span>
        <span className={`px-2 py-0.5 rounded backdrop-blur-md border font-bold ${badgeColor}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Center Tactical Crosshair Watermark */}
      <div className="relative z-10 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 rounded-full border border-red-500/50 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-white/60 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff2a4b]" />
        </div>
      </div>

      {/* Tactical HUD Footer */}
      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[9px] font-mono text-white/80 z-10">
        <span className="flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold">{statTopRight}</span>
        </span>
        <span className="text-red-300 bg-black/70 px-2 py-0.5 rounded font-mono border border-red-500/20 font-bold">
          FREE FIRE MAX
        </span>
      </div>
    </div>
  )
}
