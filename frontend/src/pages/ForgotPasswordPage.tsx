import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DhruvaLogo } from '../components/ui/DhruvaLogo'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your registered email'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) { toast.error(error.message); return }
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
            <DhruvaLogo size="lg" subtitle="Account Recovery" />
          </Link>
        </div>

        <div className="rounded-3xl p-1 bg-gradient-to-b from-brand-500/30 via-white/[0.08] to-transparent shadow-2xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-dark-900/90 p-7 sm:p-8 border border-white/[0.06] space-y-5">
            {sent ? (
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-glow-green">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white">Reset Link Dispatched</h2>
                <p className="text-dark-300 text-xs sm:text-sm">
                  We've sent an encrypted password recovery link to <span className="text-brand-300 font-mono font-bold">{email}</span>.
                </p>
                <Link to="/login" className="block pt-2">
                  <Button variant="cyber" fullWidth size="md">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-xl font-black text-white">Reset Your Password</h2>
                  <p className="text-dark-400 text-xs sm:text-sm mt-1">
                    Enter your email address and we'll send you an instant reset link.
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Registered Email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="pt-2">
                    <Button type="submit" loading={loading} fullWidth size="lg" variant="cyber" className="font-bold shadow-glow-cyan">
                      Send Reset Instructions <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
                <div className="border-t border-white/[0.06] pt-4 text-center text-xs text-dark-400">
                  Remembered your password?{' '}
                  <Link to="/login" className="text-brand-400 hover:text-brand-300 font-bold transition-colors">
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-mono text-dark-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Encrypted Password Recovery System</span>
        </div>
      </div>
    </div>
  )
}
