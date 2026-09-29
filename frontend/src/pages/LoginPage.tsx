import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DhruvaLogo } from '../components/ui/DhruvaLogo'

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter your email and password')
      return
    }
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cyber Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-cyber-cyan/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <DhruvaLogo size="lg" subtitle="Client Authentication Portal" />
          </Link>
          <p className="mt-3 text-dark-400 text-xs sm:text-sm">
            Access your active panel keys, downloads & profile.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-brand-500/30 via-white/[0.08] to-transparent shadow-2xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-dark-900/90 p-7 sm:p-8 border border-white/[0.06] space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm font-medium bg-dark-900/80 border border-white/[0.08] text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" loading={loading} fullWidth size="lg" variant="cyber" className="shadow-glow-cyan font-bold">
                  Sign In to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="border-t border-white/[0.06] pt-5 text-center text-xs text-dark-400">
              New customer?{' '}
              <Link to="/register" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>

        {/* Security Trust Footnote */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-dark-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>256-bit Encrypted Session • Instant Key Activation</span>
        </div>
      </div>
    </div>
  )
}
