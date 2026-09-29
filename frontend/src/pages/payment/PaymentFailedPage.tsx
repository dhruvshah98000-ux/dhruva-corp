import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { XCircle, RefreshCw, MessageCircle } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export const PaymentFailedPage: React.FC = () => {
  const location = useLocation()
  const state = location.state as { orderId?: string } | null

  return (
    <MainLayout>
      <div className="page-container max-w-lg mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-red-500/15 border-2 border-red-500/30 rounded-3xl flex items-center justify-center mx-auto text-red-400 shadow-glow-pink">
          <XCircle className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Payment Incomplete</h1>
          <p className="text-dark-300 text-sm mt-1">
            The transaction was cancelled or declined by your bank / UPI provider.
          </p>
        </div>

        <Card glow className="border-red-500/20 text-left">
          <CardBody className="p-6 space-y-4">
            {state?.orderId && (
              <div className="bg-dark-950/80 rounded-xl p-3 border border-white/[0.06] text-xs font-mono">
                <span className="text-dark-400">Order Reference: </span>
                <span className="text-white font-bold">{state.orderId}</span>
              </div>
            )}

            <div className="p-4 rounded-xl bg-dark-950/60 border border-white/[0.06] space-y-2 text-xs text-dark-300">
              <p className="font-semibold text-white">Did your funds get deducted?</p>
              <p className="leading-relaxed">
                If the amount was deducted from your account, Razorpay will automatically reverse it within 3-5 business days. You can also contact our Discord support team with the transaction screenshot for instant key release.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/products" className="flex-1">
                <Button variant="cyber" size="md" fullWidth className="font-bold gap-2">
                  <RefreshCw className="h-4 w-4" /> Try Again
                </Button>
              </Link>
              <a
                href="https://discord.gg/mkMhUzpqU6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="secondary" size="md" fullWidth className="gap-2">
                  <MessageCircle className="h-4 w-4 text-indigo-400" /> Discord Help
                </Button>
              </a>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
