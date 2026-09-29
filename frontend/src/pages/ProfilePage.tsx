import React, { useState, useEffect } from 'react'
import { User, Mail, Save, Lock, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/api'
import { supabase } from '../lib/supabase'

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [discord, setDiscord] = useState('')
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sendingReset, setSendingReset] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setDiscord(profile.discord_username || '')
    }
  }, [profile])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (fullName && fullName.trim().length < 2) errs.fullName = 'Name must be at least 2 characters'
    if (phone && !/^[6-9]\d{9}$/.test(phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number'
    return errs
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      await profileService.update({
        full_name: fullName.trim() || null,
        phone: phone || null,
        discord_username: discord.trim() || null,
      })
      await refreshProfile()
      toast.success('Profile updated successfully!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user?.email) return
    setSendingReset(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      toast.success('Password reset email sent! Check your inbox.')
    } catch {
      toast.error('Failed to send reset email')
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <User className="h-6 w-6 text-brand-400" /> Account & Security
        </h1>
        <p className="text-dark-400 text-xs sm:text-sm mt-1">
          Manage your personal details, phone number for WhatsApp receipts, and Discord link.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="space-y-6">
          <Card glow className="text-center p-6">
            <CardBody className="py-4 space-y-4">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-brand-600 to-cyber-cyan blur-md opacity-70 animate-pulse-slow" />
                <div className="relative w-full h-full rounded-3xl bg-dark-900 border-2 border-brand-400/50 flex items-center justify-center text-white shadow-glow">
                  <User className="h-10 w-10 text-cyber-cyan" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{profile?.full_name || 'VIP Client'}</h3>
                <p className="text-dark-400 font-mono text-xs mt-0.5">{user?.email}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-semibold mt-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Verified Customer
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Security Card */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 pb-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Password Security</span>
              </div>
            </CardHeader>
            <CardBody className="px-0 py-2 space-y-3">
              <p className="text-dark-400 text-xs leading-relaxed">
                Need to change your password? We will send an encrypted reset link to your registered email address.
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={handlePasswordReset}
                loading={sendingReset}
                size="sm"
              >
                Send Reset Link
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-400" />
                <span className="font-bold text-white text-xs uppercase tracking-wider font-mono">Client Credentials</span>
              </div>
            </CardHeader>
            <CardBody className="p-6">
              <form onSubmit={handleSave} className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Aman Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium bg-dark-950/70 border border-white/[0.06] text-dark-400 cursor-not-allowed font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-dark-500">Email is permanently bound to your license profile</p>
                </div>

                <Input
                  label="Mobile Number (WhatsApp)"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  hint="Used for key recovery and direct support"
                />

                <Input
                  label="Discord Username"
                  placeholder="username#1234 or @username"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  hint="Used to grant VIP customer role on our Discord server"
                />

                <div className="pt-2">
                  <Button type="submit" loading={saving} variant="cyber" size="md" className="font-bold shadow-glow-cyan gap-2">
                    <Save className="h-4 w-4" /> Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
