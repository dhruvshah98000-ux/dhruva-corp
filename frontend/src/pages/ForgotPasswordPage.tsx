import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Zap, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Please enter your email'); return }
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
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shadow-glow">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="font-bold text-white text-lg">DHRUVA CORPORATION</span>
          </Link>
        </div>
        <div className="bg-dark-800/60 border border-dark-700/50 rounded-2xl p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Email Sent</h2>
              <p className="text-dark-400 text-sm mb-6">
                Check your inbox for a password reset link.
              </p>
              <Link to="/login">
                <Button variant="outline" fullWidth>Back to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
              <p className="text-dark-400 text-sm mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} fullWidth size="lg">
                  Send Reset Link
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-dark-400">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300">Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
