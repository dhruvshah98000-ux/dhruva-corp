import React, { useState, useEffect } from 'react'
import { User, Mail, Save, Lock } from 'lucide-react'
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

  // Password reset
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
      toast.success('Profile updated!')
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
      toast.success('Password reset email sent. Check your inbox.')
    } catch {
      toast.error('Failed to send reset email')
    } finally {
      setSendingReset(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-dark-400 text-sm mt-1">Manage your account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar card */}
        <div>
          <Card>
            <CardBody className="text-center py-8">
              <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-white" />
              </div>
              <p className="text-white font-semibold text-lg">{profile?.full_name || 'User'}</p>
              <p className="text-dark-400 text-sm mt-1">{user?.email}</p>
              <div className="mt-4 text-xs text-dark-500">
                Member since {profile?.created_at ? new Date(profile.created_at).getFullYear() : '—'}
              </div>
            </CardBody>
          </Card>

          {/* Security */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand-400" />
                <span className="font-semibold text-white text-sm">Security</span>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-dark-400 text-sm mb-4">
                Send a password reset link to your email.
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={handlePasswordReset}
                loading={sendingReset}
                size="sm"
              >
                Send Reset Email
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Edit form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand-400" />
                <span className="font-semibold text-white text-sm">Personal Information</span>
              </div>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSave} className="space-y-5">
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={errors.fullName}
                />

                <div>
                  <label className="block text-sm font-medium text-dark-200 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dark-500" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm bg-dark-800/40 border border-dark-700 text-dark-400 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-dark-500 mt-1">Email cannot be changed here</p>
                </div>

                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={errors.phone}
                  hint="10-digit Indian mobile number"
                />

                <Input
                  label="Discord Username"
                  placeholder="username#1234 or @username"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                />

                <div className="pt-2">
                  <Button type="submit" loading={saving} size="md">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Account info (read only) */}
          <Card className="mt-4">
            <CardHeader>
              <span className="font-semibold text-white text-sm">Account Information</span>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: 'User ID', value: user?.id ? `${user.id.slice(0, 8)}...` : '—' },
                  { label: 'Email Verified', value: user?.email_confirmed_at ? '✓ Verified' : '✗ Not verified' },
                  { label: 'Account Created', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-dark-400">{label}</span>
                    <span className="text-white font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
