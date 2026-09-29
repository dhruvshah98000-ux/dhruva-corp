import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User } from 'lucide-react'
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
      toast.success('Details saved!')
      navigate('/payment/success', { state: { orderId: state.orderId, purchaseId: state.purchaseId } })
    } catch {
      toast.error('Failed to save details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="page-container max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Complete Your Order</h1>
          <p className="text-dark-400 mt-2 text-sm">Payment confirmed! Please provide your details to activate the purchase.</p>
        </div>

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                error={errors.fullName}
                required
              />
              <Input
                label="Mobile Number"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={errors.phone}
                hint="10-digit Indian mobile number"
                required
              />
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-dark-200">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-dark-800/40 border border-dark-700 text-dark-400 cursor-not-allowed"
                />
                <p className="text-xs text-dark-500">Auto-filled from your account</p>
              </div>
              <Input
                label="Discord Username"
                placeholder="username#1234 or @username"
                value={discord}
                onChange={(e) => setDiscord(e.target.value)}
                hint="Required for Discord-based product support"
              />

              <Button type="submit" fullWidth size="lg" loading={loading}>
                Save & View Purchase
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
