import React, { useEffect, useState } from 'react'
import { Mail, Phone, MessageCircle, ExternalLink, ChevronDown, Zap } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { productService } from '../services/api'
import { SiteSettings } from '../types'

export const SupportPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => {
    productService.getSettings().then(setSettings).catch(() => {})
  }, [])

  const faqs = [
    {
      q: 'How do I download and inject the loader after payment?',
      a: 'Once your payment completes, navigate to Dashboard → Subscriptions & Licenses. You will find your unique license key and a direct download link for the latest loader. Extract the folder, run the loader as Administrator, paste your key, and launch Free Fire.',
    },
    {
      q: 'Will my account get banned or flagged?',
      a: 'All our panels feature ring-0 kernel memory masking, dynamic process name randomization, and UID encryption. We have maintained a 99.9% undetected record across all major game patches.',
    },
    {
      q: 'My payment was deducted but the order shows as failed. What should I do?',
      a: 'Do not worry! In rare gateway timeout cases, take a screenshot of your UPI/bank transaction reference and open a ticket on our Discord server. Our staff will manually verify and release your panel key within 5 minutes.',
    },
    {
      q: 'Can I switch between BlueStacks and LDPlayer on the same key?',
      a: 'Yes, your panel key works seamlessly across all supported PC emulators (BlueStacks 5, MSI, LDPlayer 9, MEmu, Nox) on your registered device.',
    },
    {
      q: 'How do updates work when Free Fire releases a new patch?',
      a: 'Whenever Garena releases an in-game patch or OB update, our development team pushes automated bypass updates within hours. Announcements and new loader releases are posted in our Discord server.',
    },
  ]

  return (
    <MainLayout>
      <div className="page-container max-w-5xl mx-auto py-12 space-y-12">
        {/* Support Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-mono font-medium">
            <Zap className="h-3.5 w-3.5 text-cyber-cyan" /> 24/7 CLIENT SUPPORT DESK
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-dark-400 text-sm sm:text-base">
            Our technical support team is online 24/7 on Discord to help with installation, loader injection, and subscription renewals.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discord VIP Card (Featured) */}
          <Card glow className="relative border-indigo-500/40 bg-gradient-to-b from-indigo-950/40 to-dark-900/90 text-center p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 shadow-glow">
                <MessageCircle className="h-8 w-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> RECOMMENDED • &lt; 5 MIN
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Discord VIP Helpdesk</h3>
                <p className="text-dark-300 text-xs mt-1 leading-relaxed">
                  Live ticket support, video installation guides, and direct voice help from our staff.
                </p>
              </div>
            </div>
            <a
              href={settings?.discord_support_link || 'https://discord.gg/mkMhUzpqU6'}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-2"
            >
              <Button variant="cyber" fullWidth size="md" className="font-bold shadow-glow-cyan gap-1.5">
                Join Discord VIP <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </Card>

          {/* Email Support */}
          <Card hover className="text-center p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-600/15 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400 shadow-glow">
                <Mail className="h-8 w-8" />
              </div>
              <div className="text-[10px] font-mono text-dark-400">RESPONSE WITHIN 24 HOURS</div>
              <div>
                <h3 className="text-lg font-bold text-white">Email Inquiries</h3>
                <p className="text-dark-300 text-xs mt-1 leading-relaxed">
                  For billing questions, partnerships, or official account support.
                </p>
                <p className="text-brand-300 font-mono text-xs mt-3 select-all font-semibold">
                  {settings?.support_email || 'support@dhruva.corp'}
                </p>
              </div>
            </div>
            <a href={`mailto:${settings?.support_email || 'support@dhruva.corp'}`} className="block pt-2">
              <Button variant="secondary" fullWidth size="md">
                Send Email
              </Button>
            </a>
          </Card>

          {/* Phone / WhatsApp Support */}
          <Card hover className="text-center p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-600/15 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyber-cyan shadow-glow-cyan">
                <Phone className="h-8 w-8" />
              </div>
              <div className="text-[10px] font-mono text-dark-400">MON–SAT (10 AM – 8 PM IST)</div>
              <div>
                <h3 className="text-lg font-bold text-white">Phone Support</h3>
                <p className="text-dark-300 text-xs mt-1 leading-relaxed">
                  Direct call and WhatsApp assistance for quick transaction verification.
                </p>
                <p className="text-white font-mono text-xs mt-3 font-semibold">
                  {settings?.support_phone || '+91 Contact on Discord'}
                </p>
              </div>
            </div>
            <a
              href={settings?.support_phone ? `tel:${settings.support_phone}` : 'https://discord.gg/mkMhUzpqU6'}
              target="_blank"
              rel="noopener noreferrer"
              className="block pt-2"
            >
              <Button variant="secondary" fullWidth size="md">
                Contact Support
              </Button>
            </a>
          </Card>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="space-y-6 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Help Center FAQ</h2>
            <p className="text-dark-400 text-xs sm:text-sm">Instant answers to the most common setup questions.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="rounded-2xl border border-white/[0.08] bg-dark-900/70 backdrop-blur-md overflow-hidden transition-all cursor-pointer hover:border-brand-500/30"
              >
                <div className="flex items-center justify-between p-5 text-white font-bold text-sm sm:text-base">
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-brand-400 transition-transform duration-200 shrink-0 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-dark-300 text-xs sm:text-sm leading-relaxed border-t border-white/[0.04] pt-3 animate-fade-in font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
