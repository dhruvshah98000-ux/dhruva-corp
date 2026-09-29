import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { DhruvaLogo } from '../components/ui/DhruvaLogo'

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) { toast.error(error.message); return }
      toast.success('Password updated successfully!')
      navigate('/login')
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
            <DhruvaLogo size="lg" subtitle="Password Reset" />
          </Link>
        </div>

        <div className="rounded-3xl p-1 bg-gradient-to-b from-brand-500/30 via-white/[0.08] to-transparent shadow-2xl backdrop-blur-xl">
          <div className="rounded-[22px] bg-dark-900/90 p-7 sm:p-8 border border-white/[0.06] space-y-5">
            <div>
              <h2 className="text-xl font-black text-white">Create New Password</h2>
              <p className="text-dark-400 text-xs sm:text-sm mt-1">Enter your new secure password below.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <div className="pt-2">
                <Button type="submit" loading={loading} fullWidth size="lg" variant="cyber" className="font-bold shadow-glow-cyan">
                  Update Password <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
