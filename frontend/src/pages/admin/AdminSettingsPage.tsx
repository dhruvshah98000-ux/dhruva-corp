import React, { useEffect, useState } from 'react'
import { Save, Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import { AdminLayout } from '../../components/layout/AdminLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { adminService } from '../../services/api'

interface SettingsForm {
  company_name: string
  support_phone: string
  support_email: string
  discord_support_link: string
  currency: string
  footer_text: string
  terms_url: string
  privacy_url: string
}

export const AdminSettingsPage: React.FC = () => {
  const [form, setForm] = useState<SettingsForm>({
    company_name: '', support_phone: '', support_email: '',
    discord_support_link: '', currency: 'INR', footer_text: '',
    terms_url: '', privacy_url: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminService.getSettings().then((data) => {
      setForm({
        company_name: data.company_name || '',
        support_phone: data.support_phone || '',
        support_email: data.support_email || '',
        discord_support_link: data.discord_support_link || '',
        currency: data.currency || 'INR',
        footer_text: data.footer_text || '',
        terms_url: data.terms_url || '',
        privacy_url: data.privacy_url || '',
      })
    }).finally(() => setLoading(false))
  }, [])

  const set = (key: keyof SettingsForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Only send non-empty optional fields
      const payload: Record<string, string | null> = {}
      const nullableFields: (keyof SettingsForm)[] = ['support_phone', 'support_email', 'discord_support_link', 'footer_text', 'terms_url', 'privacy_url']
      Object.entries(form).forEach(([k, v]) => {
        if (nullableFields.includes(k as keyof SettingsForm)) payload[k] = v || null
        else payload[k] = v
      })
      await adminService.updateSettings(payload)
      toast.success('Settings saved!')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Site Settings</h1>
        <p className="text-dark-400 text-sm mt-1">Configure company info, support contacts, and branding</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}</div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          {/* Company */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-brand-400" />
                <span className="font-semibold text-white text-sm">Company Information</span>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Company Name" value={form.company_name} onChange={set('company_name')} required placeholder="Dhruva Corporation" />
              <Input label="Currency Code" value={form.currency} onChange={set('currency')} placeholder="INR" required />
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">Footer Text</label>
                <textarea
                  value={form.footer_text}
                  onChange={set('footer_text')}
                  rows={2}
                  placeholder="© 2026 Dhruva Corporation. All rights reserved."
                  className="w-full px-4 py-2.5 rounded-lg text-sm bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                />
              </div>
            </CardBody>
          </Card>

          {/* Support */}
          <Card>
            <CardHeader>
              <span className="font-semibold text-white text-sm">Support Contacts</span>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Support Email" type="email" value={form.support_email} onChange={set('support_email')} placeholder="support@dhruva.corp" />
              <Input label="Support Phone" value={form.support_phone} onChange={set('support_phone')} placeholder="+91 XXXXX XXXXX" />
              <Input label="Discord Support Link" value={form.discord_support_link} onChange={set('discord_support_link')} placeholder="https://discord.gg/..." />
            </CardBody>
          </Card>

          {/* Legal */}
          <Card>
            <CardHeader>
              <span className="font-semibold text-white text-sm">Legal Pages</span>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Terms of Service URL" value={form.terms_url} onChange={set('terms_url')} placeholder="https://dhruva.corp/terms" />
              <Input label="Privacy Policy URL" value={form.privacy_url} onChange={set('privacy_url')} placeholder="https://dhruva.corp/privacy" />
            </CardBody>
          </Card>

          <Button type="submit" loading={saving} size="lg">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </form>
      )}
    </AdminLayout>
  )
}
