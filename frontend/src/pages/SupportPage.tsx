import React, { useEffect, useState } from 'react'
import { Mail, Phone, MessageCircle, ExternalLink } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card, CardBody } from '../components/ui/Card'
import { productService } from '../services/api'
import { SiteSettings } from '../types'

export const SupportPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)

  useEffect(() => {
    productService.getSettings().then(setSettings).catch(() => {})
  }, [])

  const contacts = [
    {
      icon: Mail,
      title: 'Email Support',
      desc: 'Send us an email and we\'ll respond within 24 hours.',
      value: settings?.support_email || 'support@dhruva.corp',
      action: settings?.support_email ? `mailto:${settings.support_email}` : undefined,
      actionLabel: 'Send Email',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      desc: 'Available Mon–Sat, 10am–7pm IST.',
      value: settings?.support_phone || 'Contact via email',
      action: settings?.support_phone ? `tel:${settings.support_phone}` : undefined,
      actionLabel: 'Call Now',
    },
    {
      icon: MessageCircle,
      title: 'Discord Support',
      desc: 'Get real-time help from our community and team.',
      value: settings?.discord_support_link ? 'Join our Discord' : 'discord.gg/mkMhUzpqU6',
      action: settings?.discord_support_link || 'https://discord.gg/mkMhUzpqU6',
      actionLabel: 'Join Discord',
    },
  ]

  return (
    <MainLayout>
      <div className="page-container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Support Center</h1>
          <p className="text-dark-400 max-w-lg mx-auto">
            We're here to help. Choose the best way to reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {contacts.map((c) => (
            <Card key={c.title} className="text-center">
              <CardBody className="py-8">
                <div className="w-14 h-14 bg-brand-600/10 border border-brand-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <c.icon className="h-7 w-7 text-brand-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{c.title}</h3>
                <p className="text-dark-400 text-sm mb-3">{c.desc}</p>
                <p className="text-white font-medium text-sm mb-4 break-all">{c.value}</p>
                {c.action && (
                  <a
                    href={c.action}
                    target={c.action.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
                  >
                    {c.actionLabel}
                    {c.action.startsWith('http') && <ExternalLink className="h-3.5 w-3.5" />}
                  </a>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'How do I access my purchase after payment?',
                a: 'After a successful payment, go to Dashboard → My Purchases. Your purchase details, including any download links or activation information, will be available there.',
              },
              {
                q: 'My payment failed but the amount was deducted. What should I do?',
                a: 'If your payment was deducted but the order shows as failed, the amount will be automatically refunded within 5–7 business days by Razorpay. Contact us with your order ID for faster resolution.',
              },
              {
                q: 'Can I upgrade my plan?',
                a: 'Yes, you can purchase a new plan at any time. Contact support to discuss plan upgrades and we\'ll accommodate you.',
              },
              {
                q: 'How do I reset my password?',
                a: 'Click "Forgot Password" on the login page, enter your email, and you\'ll receive a reset link.',
              },
              {
                q: 'Where do I get product support?',
                a: 'For product-specific support, join our Discord server or email us. Include your Order ID for faster assistance.',
              },
            ].map((faq) => (
              <Card key={faq.q}>
                <CardBody>
                  <h4 className="text-white font-semibold mb-2 text-sm">{faq.q}</h4>
                  <p className="text-dark-400 text-sm leading-relaxed">{faq.a}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
