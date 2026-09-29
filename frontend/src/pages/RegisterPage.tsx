import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DhruvaLogo } from '../components/ui/DhruvaLogo'

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const validate = () => {
    if (!fullName.trim()) { toast.error('Full name is required'); return false }
    if (!email) { toast.error('Email is required'); return false }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return false }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return false }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) { toast.error(error.message); return }
      setSuccess(true)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="w-full max-w-md text-center relative z-10">
          <div className="rounded-3xl p-8 bg-dark-900/90 border border-emerald-500/30 backdrop-blur-xl shadow-glass space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-green">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Verification Link Sent</h2>
            <p className="text-dark-300 text-sm">
              We've dispatched a confirmation email to <span className="text-brand-300 font-mono">{email}</span>.
              Click the link inside to activate your account.
            </p>
            <div className="pt-2">
              <Button onClick={() => navigate('/login')} variant="cyber" fullWidth size="lg">
                Proceed to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-cyber-purple/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <DhruvaLogo size="lg" subtitle="Client Registration" />
          </Link>
          <p className="mt-3 text-dark-400 text-xs sm:text-sm">
            Create an account to manage panel subscriptions & loader keys.
          </p>
        </div>

        <div className="rounded-3xl p-1 bg-gradient-to-b from-brand-500/30 via-white/[0.08] to-transparent shadow-2xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-dark-900/90 p-7 sm:p-8 border border-white/[0.06] space-y-5">
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="Aman Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm font-medium bg-dark-900/80 border border-white/[0.08] text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400 transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="pt-2">
                <Button type="submit" loading={loading} fullWidth size="lg" variant="cyber" className="shadow-glow-cyan font-bold">
                  Create Account <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            <div className="border-t border-white/[0.06] pt-5 text-center text-xs text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-dark-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Zero Spam Guarantee • Private & Encrypted</span>
        </div>
      </div>
    </div>
  )
}
