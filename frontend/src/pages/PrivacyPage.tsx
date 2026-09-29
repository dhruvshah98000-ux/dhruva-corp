import React from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card } from '../components/ui/Card'
import { ShieldCheck } from 'lucide-react'

export const PrivacyPage: React.FC = () => (
  <MainLayout>
    <div className="page-container max-w-4xl mx-auto py-12">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="h-3.5 w-3.5" /> PRIVACY & DATA ENCRYPTION
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
        <p className="text-dark-400 text-xs sm:text-sm font-mono">Last revised: September 2026</p>
      </div>

      <Card glow className="p-6 sm:p-10 border-white/[0.08]">
        <div className="space-y-8 text-dark-300 text-sm leading-relaxed">
          {[
            {
              title: '1. Information We Collect',
              body: 'We collect minimal user information necessary to provide and manage digital licenses: account email, full name, phone number (for WhatsApp receipts), and optional Discord handles for VIP ticket routing.',
            },
            {
              title: '2. Payment Security',
              body: 'All financial transactions are conducted directly through Razorpay with 256-bit SSL encryption. We never see, store, or process credit card numbers or banking secrets.',
            },
            {
              title: '3. Zero Data Sale Policy',
              body: 'We never sell, rent, or trade customer information to advertisers or marketing networks. All stored records are protected using Postgres Row Level Security (RLS) policies.',
            },
            {
              title: '4. Session & Cookies',
              body: 'We use necessary cryptographic session tokens solely to maintain authenticated user login states on our dashboard. No tracking or advertising cookies are utilized.',
            },
            {
              title: '5. Contact and Data Purging',
              body: 'You retain the right to request deletion of your client profile at any time by contacting privacy@dhruva.corp or creating a ticket on Discord.',
            },
          ].map(({ title, body }) => (
            <div key={title} className="border-b border-white/[0.06] pb-6 last:border-0 last:pb-0">
              <h2 className="text-white font-bold text-base mb-2">{title}</h2>
              <p className="text-dark-400 leading-relaxed text-xs sm:text-sm">{body}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  </MainLayout>
)
