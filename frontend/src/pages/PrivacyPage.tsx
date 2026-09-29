import React from 'react'
import { MainLayout } from '../components/layout/MainLayout'

export const PrivacyPage: React.FC = () => (
  <MainLayout>
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
      <p className="text-dark-500 text-sm mb-8">Last updated: September 2026</p>

      <div className="space-y-6 text-dark-300 text-sm leading-relaxed">
        {[
          {
            title: '1. Information We Collect',
            body: 'We collect information you provide directly: name, email address, phone number, and Discord username. We also collect transaction data such as order IDs and payment references (no card details are stored by us).',
          },
          {
            title: '2. How We Use Your Information',
            body: 'We use your information to: process orders and payments, provide customer support, send order confirmations and updates, improve our products and services, and comply with legal obligations.',
          },
          {
            title: '3. Payment Information',
            body: 'All payment processing is handled by Razorpay. We do not store credit card numbers or banking information. Only Razorpay Order IDs and Payment IDs are stored for reconciliation purposes.',
          },
          {
            title: '4. Data Sharing',
            body: 'We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers (Supabase, Razorpay) solely to operate our platform.',
          },
          {
            title: '5. Data Security',
            body: 'We implement industry-standard security measures including encrypted connections (HTTPS), Row Level Security on our database, and server-side authentication for all sensitive operations.',
          },
          {
            title: '6. Cookies',
            body: 'We use session cookies to maintain your authenticated state. We do not use tracking or advertising cookies.',
          },
          {
            title: '7. Data Retention',
            body: 'We retain your account data as long as your account is active. Order and purchase records are retained for 7 years as required by financial regulations.',
          },
          {
            title: '8. Your Rights',
            body: 'You have the right to access, correct, or request deletion of your personal data. Contact us at privacy@dhruva.corp to exercise these rights.',
          },
          {
            title: '9. Contact',
            body: 'For privacy-related questions, email us at privacy@dhruva.corp.',
          },
        ].map(({ title, body }) => (
          <div key={title}>
            <h2 className="text-white font-semibold text-base mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </div>
  </MainLayout>
)
