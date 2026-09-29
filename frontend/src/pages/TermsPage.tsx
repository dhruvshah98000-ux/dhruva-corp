import React from 'react'
import { MainLayout } from '../components/layout/MainLayout'

export const TermsPage: React.FC = () => (
  <MainLayout>
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
      <p className="text-dark-500 text-sm mb-8">Last updated: September 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-dark-300 text-sm leading-relaxed">
        {[
          {
            title: '1. Acceptance of Terms',
            body: 'By accessing or purchasing products from Dhruva Corporation, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
          },
          {
            title: '2. Products and Services',
            body: 'Dhruva Corporation provides digital products and software licenses. All purchases are for personal use only unless otherwise stated. Reselling or redistributing our products without written permission is strictly prohibited.',
          },
          {
            title: '3. Payments',
            body: 'All payments are processed securely via Razorpay. Prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes. We do not store your payment card information.',
          },
          {
            title: '4. Refund Policy',
            body: 'Refunds are handled on a case-by-case basis. Failed payments are automatically refunded. For other refund requests, contact our support team within 7 days of purchase with a valid reason.',
          },
          {
            title: '5. Account Responsibility',
            body: 'You are responsible for maintaining the security of your account credentials. Do not share your account with others. Dhruva Corporation is not liable for losses due to unauthorized account access.',
          },
          {
            title: '6. Prohibited Use',
            body: 'You may not use our products for illegal activities, to harm others, or to violate any applicable laws. We reserve the right to terminate accounts that violate these terms.',
          },
          {
            title: '7. Intellectual Property',
            body: 'All content, products, and software provided by Dhruva Corporation are the intellectual property of Dhruva Corporation and are protected by applicable copyright laws.',
          },
          {
            title: '8. Limitation of Liability',
            body: 'Dhruva Corporation is not liable for any indirect, incidental, or consequential damages arising from the use of our products or services. Our maximum liability is limited to the amount paid for the specific product.',
          },
          {
            title: '9. Changes to Terms',
            body: 'We reserve the right to update these terms at any time. Continued use of our services after changes constitutes acceptance of the new terms.',
          },
          {
            title: '10. Contact',
            body: 'For questions about these Terms, contact us at legal@dhruva.corp.',
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
