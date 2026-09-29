import React from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { Card } from '../components/ui/Card'
import { FileText } from 'lucide-react'

export const TermsPage: React.FC = () => (
  <MainLayout>
    <div className="page-container max-w-4xl mx-auto py-12">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-500/15 text-brand-300 text-xs font-mono">
          <FileText className="h-3.5 w-3.5" /> LEGAL DOCUMENTATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Service</h1>
        <p className="text-dark-400 text-xs sm:text-sm font-mono">Effective Date: September 2026</p>
      </div>

      <Card glow className="p-6 sm:p-10 border-white/[0.08]">
        <div className="space-y-8 text-dark-300 text-sm leading-relaxed">
          {[
            {
              title: '1. Acceptance of Terms',
              body: 'By accessing or purchasing digital subscriptions from Dhruva Corporation, you agree to be bound by these Terms of Service. If you disagree with any portion of these conditions, please discontinue use of our platform.',
            },
            {
              title: '2. Products and Digital Licenses',
              body: 'Dhruva Corporation provides digital enhancement utilities and software licenses. Purchases are intended for personal single-device execution. Redistribution, reverse-engineering, or unauthorized resale of our builds will result in immediate license termination without refund.',
            },
            {
              title: '3. Payment Processing & Gateways',
              body: 'Payments are securely processed via Razorpay supporting UPI, Cards, and NetBanking. All pricing is displayed in Indian Rupees (INR). Dhruva Corporation does not store credit/debit card numbers.',
            },
            {
              title: '4. Refund & Replacement Policy',
              body: 'Given the immediate provisioning of digital goods and unique license keys, all verified sales are final. If an unresolvable technical incompatibility arises on your device within 48 hours of purchase, our Discord technical desk will provide license exchange or store credit.',
            },
            {
              title: '5. Account & Credential Security',
              body: 'Users are strictly responsible for safeguarding their login credentials and generated license keys. Dhruva Corporation is not liable for key leakage or sharing among third parties.',
            },
            {
              title: '6. Limitation of Liability',
              body: 'Dhruva Corporation is not responsible for any in-game disciplinary actions taken by third-party game publishers. Our software is designed strictly for educational, security analysis, and performance optimization purposes.',
            },
            {
              title: '7. Official Contact',
              body: 'For legal queries, reach out directly at support@dhruva.corp or via our verified Discord server.',
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
