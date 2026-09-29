import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, ArrowRight } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../context/AuthContext'
import { paymentService } from '../../services/api'

export const CustomerInfoPage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const state = location.state as { orderId: string; purchaseId?: string } | null

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [discord, setDiscord] = useState(profile?.discord_username || '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!state?.orderId) {
    navigate('/dashboard')
    return null
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim() || fullName.trim().length < 2) errs.fullName = 'Full name must be at least 2 characters'
    if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    try {
      await paymentService.saveCustomerInfo({
        orderId: state.orderId,
        fullName: fullName.trim(),
        phone,
        discordUsername: discord.trim() || undefined,
      })
      await refreshProfile()
      toast.success('Information saved successfully!')
      navigate('/payment/success', { state: { orderId: state.orderId, purchaseId: state.purchaseId } })
    } catch {
      toast.error('Failed to save details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="page-container max-w-lg mx-auto py-12">
        <div className="text-center mb-8 space-y-2">
          <div className="w-16 h-16 bg-brand-500/15 border border-brand-500/30 rounded-2xl flex items-center justify-center mx-auto text-brand-400 shadow-glow">
            <User className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Activation Details</h1>
          <p className="text-dark-400 text-xs sm:text-sm">
            Payment verified! Please provide your phone and Discord handle to bind your license.
          </p>
        </div>

        <Card glow className="border-brand-500/30">
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full Name"
                placeholder="Aman Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                required
              />
              <Input
                label="Mobile Phone (WhatsApp Support)"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                hint="10-digit Indian mobile number"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-300">
                  Account Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-medium bg-dark-950/70 border border-white/[0.06] text-dark-400 cursor-not-allowed font-mono"
                />
              </div>
              <Input
                label="Discord Username (For VIP Roles)"
                placeholder="username#1234 or @username"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                hint="Used to assign your VIP customer role on Discord"
              />

              <div className="pt-2">
                <Button type="submit" fullWidth size="lg" variant="cyber" loading={loading} className="font-bold shadow-glow-cyan">
                  Save & Retrieve License <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
