import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Shield, Zap, Star, ArrowRight, CheckCircle2, Users, Package,
  Crosshair, Cpu, Eye, Monitor,
  ChevronDown, MessageCircle, Sparkles, Check, Flame, Target
} from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Button } from '../components/ui/Button'
import { Card, CardBody } from '../components/ui/Card'
import { ProductArt } from '../components/ui/ProductArt'
import { useAuth } from '../context/AuthContext'

// Supported Platform Data
const platforms = [
  { name: 'Free Fire MAX', category: 'Game', ver: 'OB44 / Latest', status: 'Undetected', icon: '🎮' },
  { name: 'Free Fire Classic', category: 'Game', ver: 'All Versions', status: 'Undetected', icon: '🔥' },
  { name: 'Free Fire 86 (x86)', category: 'Game', ver: 'Optimized FPS', status: 'Undetected', icon: '⚡' },
  { name: 'BlueStacks 5.22+', category: 'Emulator', ver: 'Pie 64 & Android 11', status: 'Supported', icon: '💻' },
  { name: 'MSI App Player', category: 'Emulator', ver: '5.22.75 Upto', status: 'Supported', icon: '🕹️' },
  { name: 'LDPlayer 9', category: 'Emulator', ver: 'High FPS Mode', status: 'Supported', icon: '🖥️' },
  { name: 'MEmu & Nox', category: 'Emulator', ver: 'Ultra Low Lag', status: 'Supported', icon: '⚙️' },
  { name: 'Android Mobile', category: 'Mobile', ver: 'Direct APK (No PC)', status: 'Active', icon: '📱' },
  { name: 'Apple iOS', category: 'iOS', ver: 'No Jailbreak', status: 'Exclusive', icon: '🍏' },
]

const securityFeatures = [
  {
    icon: Shield,
    title: 'Zero Ban Technology',
    desc: 'Our proprietary UID & LIB bypasses conceal memory hooks, bypassing anti-cheat inspection and maintaining a flawless 0% ban history.',
    badge: 'KERNEL LVL',
  },
  {
    icon: Eye,
    title: 'Stream & Screenshot Proof',
    desc: 'Visual overlays remain completely invisible to OBS, Discord screen share, and in-game screenshot captures. Play with total peace of mind.',
    badge: 'INVISIBLE',
  },
  {
    icon: Zap,
    title: 'Instant Automated Delivery',
    desc: 'No manual waiting for admin verification. Your loader download and unique panel license are generated instantly upon checkout.',
    badge: '0 SEC DELAY',
  },
  {
    icon: Cpu,
    title: 'Ultra Low Latency & FPS Boost',
    desc: 'Engineered in lightweight native C++ with zero overhead. Experience 144+ FPS performance with zero frame drops or input lag.',
    badge: '144 FPS',
  },
]

const testimonials = [
  {
    name: 'Aman Sharma',
    handle: '@aman_ff_pro',
    role: 'Tournament Player',
    rating: 5,
    comment: 'Been using the Aimbot + LIB Bypass for 4 months on BlueStacks 5. Still 100% undetected and my headshot rate went from 35% to 88%!',
    product: 'Aimbot Pro + LIB Bypass',
  },
  {
    name: 'Rohan Verma',
    handle: '@rohan_v',
    role: 'Content Creator',
    rating: 5,
    comment: 'The stream proof feature works perfectly on OBS. Nobody on my stream can see the panel, yet headshots lock on effortlessly.',
    product: 'Brutal / Max Aim',
  },
  {
    name: 'Kartik D.',
    handle: '@kartik_ios',
    role: 'iOS Mobile Gamer',
    rating: 5,
    comment: 'Best iOS panel hands down. No jailbreak was needed and the certificate setup took literally 2 minutes on Discord.',
    product: 'iOS VIP Panel',
  },
]

const faqs = [
  {
    q: 'Will my Free Fire account get banned using these panels?',
    a: 'Dhruva Corporation panels utilize ring-0 kernel memory masking and dynamic UID encryption. We push automatic OTA updates prior to any game patch, ensuring unmatched account safety.',
  },
  {
    q: 'How fast do I receive my panel key after paying?',
    a: 'Instantly! As soon as payment completes via Razorpay (UPI, Cards, NetBanking), your purchase record, loader download, and activation key appear in your Dashboard.',
  },
  {
    q: 'Do these work on both PC emulators and Mobile phones?',
    a: 'Yes! We offer dedicated PC solutions (BlueStacks, LDPlayer, MSI, MEmu) as well as standalone Android APKs and iOS non-jailbreak configurations.',
  },
  {
    q: 'What if I need help setting up the loader?',
    a: 'Our Discord support team is available 24/7 with step-by-step video guides, remote configuration assistance, and instant ticket response.',
  },
]

export const HomePage: React.FC = () => {
  const { user } = useAuth()

  // Interactive Gaming HUD State for Hero
  const [previewTab, setPreviewTab] = useState<'onetap' | 'skull' | 'laser' | 'shield'>('onetap')
  const [hudSmoothAim, setHudSmoothAim] = useState(true)
  const [hudAutoHead, setHudAutoHead] = useState(true)
  const [hudBypassActive, setHudBypassActive] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const previewConfig = {
    onetap: {
      image: '/images/ff-onetap-headshot.jpg',
      title: 'ONE TAP HEADSHOTS',
      badge: '100% ONE TAP RATE',
      badgeClass: 'bg-red-500/25 text-red-300 border-red-500/40',
      subtitle: 'Free Fire MAX & 86 One Tap Calibration',
      recoil: 'SPREAD: 0.00% (RED ONLY)',
      target: 'TARGET: HEADSHOT SKULL',
      fps: '144 FPS',
      ping: '8ms',
    },
    skull: {
      image: '/images/ff-skull-headshot.jpg',
      title: 'SKULL HEADSHOT ELIMINATION',
      badge: 'AUTO DRAG HEADSHOT',
      badgeClass: 'bg-orange-500/25 text-orange-300 border-orange-500/40',
      subtitle: 'Iconic Red Splatter Skull Kill',
      recoil: 'TRIGGER: 0ms INSTANT',
      target: 'LOCK: SKULL (BONE #8)',
      fps: '165 FPS',
      ping: '10ms',
    },
    laser: {
      image: '/images/ff-laser-aim.jpg',
      title: 'LASER LINE TARGET TRACKER',
      badge: 'GRANDMASTER RANK 1',
      badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/40',
      subtitle: 'Multi-Target Enemy Line Tracing',
      recoil: 'AIMBOT: DUAL TRACER',
      target: 'HIT: RED NUMBERS 55 55',
      fps: '180 FPS',
      ping: '12ms',
    },
    shield: {
      image: '/images/shield-bypass.jpg',
      title: 'RING-0 KERNEL SHIELD',
      badge: '100% UNDETECTED BAN ZERO',
      badgeClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40',
      subtitle: 'Emulator & UID Cloaking Protection',
      recoil: 'MEM_HOOK: CLOAKED',
      target: 'UID: DYNAMIC ENCRYPTED',
      fps: '240 FPS',
      ping: '5ms',
    },
  }[previewTab]

  return (
    <MainLayout>
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-10 pb-24 md:py-24 border-b border-white/[0.08]">
        {/* Cinematic Free Fire Background Hero Art with Dark Vignette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-banner.jpg"
            alt="Free Fire Hero Soldier"
            className="w-full h-full object-cover object-top opacity-35 filter brightness-90 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/80 to-dark-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/90 to-transparent" />
          {/* Ambient Fiery Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-amber-500/15 blur-[130px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              {/* Free Fire Live Status Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-medium backdrop-blur-md shadow-[0_0_15px_rgba(255,42,75,0.2)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="font-bold text-white tracking-wide">FREE FIRE OB44 UPDATE LIVE</span>
                <span className="text-dark-600">|</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 100% ONE TAP HEADSHOTS
                </span>
              </div>

              {/* Title with Real Free Fire Headshot Skull Emblem */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                ONE TAP <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 drop-shadow-[0_0_25px_rgba(255,42,75,0.5)]">
                  HEADSHOT ONLY
                </span>
                <br />
                <span className="text-white flex items-center justify-center lg:justify-start gap-3">
                  <span>DOMINATION</span>
                  <img
                    src="/images/ff-headshot-skull-badge.png"
                    alt="Free Fire Headshot Skull"
                    className="w-12 h-10 sm:w-16 sm:h-12 object-contain inline-block rounded-xl border border-red-500/40 shadow-[0_0_15px_rgba(255,42,75,0.5)] bg-black/50"
                  />
                </span>
              </h1>

              <p className="text-dark-300 text-base sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Next-generation Free Fire panels, auto-drag headshot algorithms, and ring-0 kernel bypasses. Guaranteed undetected on PC Emulators (BlueStacks, LDPlayer, MSI), Android APK & iOS.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start pt-2">
                <Link to="/products">
                  <Button size="lg" variant="cyber" className="w-full sm:w-auto shadow-[0_0_25px_rgba(255,42,75,0.5)] text-base gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 border-none text-white font-bold">
                    <Crosshair className="h-5 w-5 text-white" />
                    Get Headshot Panel
                  </Button>
                </Link>
                <a
                  href="https://discord.gg/mkMhUzpqU6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base gap-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10">
                    <MessageCircle className="h-5 w-5 text-red-400" />
                    Join Discord VIP
                  </Button>
                </a>
              </div>

              {/* Quick Trust Checklist */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs font-mono text-dark-300">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> 0s Instant Key Delivery
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Shield className="h-4 w-4" /> Ring-0 Kernel Anti-Ban
                </div>
                <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                  <Crosshair className="h-4 w-4" /> 100% Drag Headshot
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Free Fire Headshot HUD Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-b from-red-500/50 via-amber-500/20 to-dark-800/40 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[22px] bg-dark-900/95 p-5 sm:p-6 border border-white/[0.08] overflow-hidden space-y-4">
                  
                  {/* Mode Selector Tabs (4 Live Modes) */}
                  <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-dark-950/80 border border-white/[0.06]">
                    <button
                      onClick={() => setPreviewTab('onetap')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        previewTab === 'onetap'
                          ? 'bg-red-600 text-white shadow-glow'
                          : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Crosshair className="h-3 w-3 shrink-0" />
                      <span className="truncate">One Tap</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('skull')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        previewTab === 'skull'
                          ? 'bg-orange-600 text-white shadow-glow'
                          : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Flame className="h-3 w-3 shrink-0" />
                      <span className="truncate">Skull Kill</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('laser')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        previewTab === 'laser'
                          ? 'bg-amber-600 text-white shadow-glow'
                          : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Target className="h-3 w-3 shrink-0" />
                      <span className="truncate">Laser Aim</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('shield')}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        previewTab === 'shield'
                          ? 'bg-emerald-600 text-white shadow-glow'
                          : 'text-dark-400 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      <Shield className="h-3 w-3 shrink-0" />
                      <span className="truncate">Bypass</span>
                    </button>
                  </div>

                  {/* High-Resolution Dynamic Image Showcase with In-Game HUD */}
                  <div className="relative h-48 rounded-xl overflow-hidden border border-red-500/30 group">
                    <img
                      src={previewConfig.image}
                      alt={previewConfig.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-black/40 pointer-events-none" />

                    {/* HUD Coordinates Top */}
                    <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10">
                      <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 text-white font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {previewConfig.target}
                      </span>
                      <span className={`px-2 py-0.5 rounded border font-bold ${previewConfig.badgeClass} backdrop-blur-md`}>
                        {previewConfig.badge}
                      </span>
                    </div>

                    {/* Center Animated Aim Reticle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full border border-red-500/60 animate-pulse flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border border-amber-400/80 animate-spin-slow" />
                        <div className="absolute w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_#ff2a4b]" />
                      </div>
                    </div>

                    {/* HUD Coordinates Bottom */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono z-10">
                      <span className="text-white/90 bg-black/70 px-2 py-0.5 rounded border border-white/10 font-bold">
                        {previewConfig.recoil}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 bg-black/70 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                          {previewConfig.fps}
                        </span>
                        <span className="text-amber-400 bg-black/70 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                          {previewConfig.ping}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Feature Controls */}
                  <div className="space-y-2 pt-1 font-mono">
                    <div className="flex items-center justify-between text-[11px] text-dark-400 uppercase tracking-wider mb-1">
                      <span>Live Panel Configuration</span>
                      <span className="text-red-400 font-bold">FREE FIRE MAX</span>
                    </div>

                    {/* Toggle 1: Drag Headshot */}
                    <div
                      onClick={() => setHudSmoothAim(!hudSmoothAim)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850/80 border border-white/[0.06] hover:border-red-500/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-400" />
                        <span className="text-xs text-white">Auto Drag Headshot (100%)</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${hudSmoothAim ? 'bg-red-500/20 text-red-300 border border-red-500/40' : 'bg-dark-800 text-dark-500'}`}>
                        {hudSmoothAim ? 'LOCKED' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle 2: Zero Recoil */}
                    <div
                      onClick={() => setHudAutoHead(!hudAutoHead)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850/80 border border-white/[0.06] hover:border-orange-500/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-400" />
                        <span className="text-xs text-white">Recoil Neutralizer (0% Spread)</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${hudAutoHead ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'bg-dark-800 text-dark-500'}`}>
                        {hudAutoHead ? 'ACTIVE' : 'OFF'}
                      </span>
                    </div>

                    {/* Toggle 3: Ring-0 Kernel Cloak */}
                    <div
                      onClick={() => setHudBypassActive(!hudBypassActive)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-dark-850/80 border border-white/[0.06] hover:border-emerald-500/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-white">Ring-0 UID Anti-Ban Shield</span>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${hudBypassActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-dark-800 text-dark-500'}`}>
                        {hudBypassActive ? 'PROTECTED' : 'BYPASSING'}
                      </span>
                    </div>
                  </div>

                  <Link to="/products" className="block pt-1">
                    <Button fullWidth size="md" className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-[0_0_20px_rgba(255,42,75,0.4)] border-none">
                      Get Your License Key Now <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 2. LIVE METRICS COUNTERS ─── */}
      <section className="border-y border-white/[0.08] bg-dark-900/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'Active Players', value: '15,000+', icon: Users, color: 'text-brand-400' },
              { label: 'Undetected Record', value: '99.9%', icon: Shield, color: 'text-emerald-400' },
              { label: 'Key Delivery Time', value: 'Instant', icon: Zap, color: 'text-cyber-cyan' },
              { label: 'Active Panel Builds', value: '7 Products', icon: Package, color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div className={`text-2xl sm:text-4xl font-black ${stat.color} mb-1 font-mono`}>
                  {stat.value}
                </div>
                <div className="text-dark-400 text-xs sm:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. FEATURED PRODUCTS SHOWCASE WITH CUSTOM ARTWORK ─── */}
      <section className="py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" /> FREE FIRE MAX & OB44 COMBAT PANELS
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Featured Free Fire Panels
            </h2>
            <p className="text-dark-400 text-sm sm:text-base mt-3">
              Precision coded for competitive rank push, tournaments, and non-stop victories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {[
              {
                slug: 'aimbot',
                title: 'Aimbot Pro',
                badge: 'BESTSELLER',
                category: 'Panel',
                price: '₹100',
                period: 'Starts 1 Day',
                desc: 'Ultra smooth, humanized aim lock algorithm. Custom FOV, aim speed, and bone selection for Free Fire MAX.',
                features: ['Free Fire MAX & 86 Support', 'Zero Shaking / Smooth Lock', 'Undetected Bypass Included'],
              },
              {
                slug: 'brutal-max-aim',
                title: 'Brutal / Max Aim',
                badge: 'MAX DAMAGE',
                category: 'Aggressive',
                price: '₹200',
                period: 'Starts 1 Day',
                desc: 'Maximum aggression aim calibration for instant multi-kill wipes. Optimized for close-quarter combat and clutch rounds.',
                features: ['Instant Dual Target Lock', 'Highest Damage Output', 'Auto Recoil Neutralizer'],
              },
              {
                slug: 'uid-bypass',
                title: 'UID Safe Bypass',
                badge: 'PROTECTION',
                category: 'Bypass',
                price: '₹150',
                period: 'Starts 1 Day',
                desc: 'Standalone memory protection layer. Masks your device identifier, emulator signature, and in-game telemetry.',
                features: ['Emulator Signature Spoof', '100% Anti-Blacklist', 'Works with all third-party loaders'],
              },
            ].map((p) => (
              <Card key={p.slug} hover glow className="flex flex-col h-full group">
                {/* Visual Art Header */}
                <div className="h-48 overflow-hidden rounded-t-2xl relative">
                  <ProductArt slug={p.slug} category={p.category} />
                </div>
                
                <CardBody className="flex flex-col flex-1 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
                      {p.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-dark-400 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <ul className="space-y-2 border-t border-white/[0.06] pt-4 flex-1">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-xs sm:text-sm text-dark-300">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div>
                      <span className="text-dark-400 text-xs block font-mono">{p.period}</span>
                      <span className="text-2xl font-black text-white font-mono">{p.price}</span>
                    </div>
                    <Link to="/products">
                      <Button size="sm" className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-[0_0_12px_rgba(255,42,75,0.35)] border-none">
                        View Plans <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline" className="gap-2 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-white font-bold">
                Browse All 7 Free Fire Panels & Mobile Builds <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 4. GAME & EMULATOR SUPPORT GRID ─── */}
      <section className="py-20 bg-dark-900/40 border-y border-white/[0.08] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-3">
              <Monitor className="h-3.5 w-3.5 text-emerald-400" /> FULL HARDWARE COMPATIBILITY
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Tested on All Games & Emulators
            </h2>
            <p className="text-dark-400 text-sm mt-2">
              Every build is verified before distribution to ensure seamless 0-lag execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="p-4 rounded-2xl bg-dark-850/80 border border-white/[0.06] hover:border-brand-500/40 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center text-xl border border-white/[0.06]">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-[11px] text-dark-400">{p.ver}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. SECURITY & ARCHITECTURE ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Why Dhruva Corp Is #1
            </h2>
            <p className="text-dark-400 text-sm sm:text-base mt-3">
              Engineered with advanced evasion techniques so you can focus entirely on victory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((f) => (
              <Card key={f.title} hover className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-brand-600/15 border border-brand-500/30 flex items-center justify-center shadow-glow">
                    <f.icon className="h-6 w-6 text-brand-400" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-dark-800 text-dark-300 border border-white/[0.06]">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-dark-400 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT WORKS 4-STEP PIPELINE ─── */}
      <section className="py-20 bg-dark-900/40 border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white">How It Works</h2>
            <p className="text-dark-400 text-sm mt-2">Get playing with your panel in under 3 minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Pick Your Plan', desc: 'Select your preferred duration (1 Day, 7 Days, 1 Month, or Lifetime).' },
              { step: '02', title: 'Instant Pay', desc: 'Secure checkout via Razorpay (UPI, GPay, Paytm, Cards).' },
              { step: '03', title: 'Get Key & Loader', desc: 'Your license key and direct loader link are generated automatically.' },
              { step: '04', title: 'Inject & Win', desc: 'One-click launch with zero complicated installation steps.' },
            ].map((st) => (
              <div key={st.step} className="p-6 rounded-2xl bg-dark-850/60 border border-white/[0.06] relative">
                <div className="text-4xl font-mono font-black text-brand-500/20 mb-3">{st.step}</div>
                <h4 className="text-white font-bold text-base mb-2">{st.title}</h4>
                <p className="text-dark-400 text-xs leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. TESTIMONIALS / CUSTOMER FEEDBACK ─── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono mb-3">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> 10,000+ SATISFIED CLIENTS
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Player Reviews</h2>
            <p className="text-dark-400 text-sm mt-2">Read real experiences from competitive Free Fire players.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} hover className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-dark-300 text-sm leading-relaxed italic">"{t.comment}"</p>
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-dark-500 font-mono">{t.role}</p>
                  </div>
                  <span className="text-[11px] font-mono text-brand-300 px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/30">
                    {t.product}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. FAQ ACCORDION SECTION ─── */}
      <section className="py-20 bg-dark-900/40 border-y border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-dark-400 text-sm mt-2">Everything you need to know about our panels.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={faq.q}
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="rounded-2xl border border-white/[0.08] bg-dark-850/80 backdrop-blur-md overflow-hidden transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between p-5 text-white font-semibold text-sm sm:text-base">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-brand-400 transition-transform duration-200 shrink-0 ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 text-dark-400 text-sm leading-relaxed border-t border-white/[0.04] pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. FINAL CTA CALLOUT ─── */}
      <section className="py-24 relative overflow-hidden border-t border-white/[0.08]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero-banner.jpg"
            alt="Free Fire Arena"
            className="w-full h-full object-cover object-bottom opacity-15 filter blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/90 to-dark-950/70" />
          <div className="absolute inset-0 bg-radial-gradient from-red-600/20 via-transparent to-transparent pointer-events-none" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
            <Flame className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> GRANDMASTER RANK GUARANTEED
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Dominate with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">
              100% Free Fire Headshots?
            </span>
          </h2>
          <p className="text-dark-300 text-base sm:text-lg max-w-xl mx-auto">
            Get instant access to Dhruva Corp's top-rated Free Fire panels. Instant key activation, zero ban risk, and 24/7 Discord help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link to="/products">
              <Button size="lg" className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold shadow-[0_0_25px_rgba(255,42,75,0.45)] border-none text-base">
                View Headshot Store <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="secondary" className="text-base border-white/10 hover:border-red-500/30">
                  Create Free Account
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/dashboard">
                <Button size="lg" variant="secondary" className="text-base border-white/10 hover:border-red-500/30">
                  My Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
