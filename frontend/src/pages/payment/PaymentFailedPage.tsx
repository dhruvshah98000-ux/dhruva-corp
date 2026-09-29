import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { XCircle, RefreshCw, ShoppingBag } from 'lucide-react'
import { MainLayout } from '../../components/layout/MainLayout'
import { Card, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export const PaymentFailedPage: React.FC = () => {
  const location = useLocation()
  const state = location.state as { orderId?: string } | null

  return (
    <MainLayout>
      <div className="page-container max-w-md mx-auto text-center">
        <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
        <p className="text-dark-400 mb-8">
          Payment could not be completed. Please try again or contact support if the issue persists.
        </p>

        <Card>
          <CardBody className="space-y-4">
            {state?.orderId && (
              <div className="bg-dark-900/60 rounded-lg p-3 text-sm">
                <span className="text-dark-400">Order Reference: </span>
                <span className="text-white font-mono">{state.orderId}</span>
              </div>
            )}

            <p className="text-sm text-dark-400">
              If your payment was deducted, it will be refunded within 5–7 business days.
              Contact us at <span className="text-brand-400">support@dhruva.corp</span>
            </p>

            <div className="flex gap-3 pt-2">
              <Link to="/products" className="flex-1">
                <Button variant="outline" fullWidth>
                  <ShoppingBag className="h-4 w-4" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/products" className="flex-1">
                <Button fullWidth>
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  )
}
