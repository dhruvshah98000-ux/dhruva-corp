import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, Star, ArrowRight, CheckCircle2, Users, Package, TrendingUp } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const features = [
  { icon: Shield, title: 'Undetected & Secure', desc: 'All panels use advanced bypass technology. Regular updates keep you protected.' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Get your panel access immediately after payment is verified.' },
  { icon: Star, title: 'All Devices Supported', desc: 'Works on Android, iOS, and all major emulators — BlueStacks, LDPlayer, MEmu and more.' },
]

const stats = [
  { icon: Users, label: 'Happy Customers', value: '10,000+' },
  { icon: Package, label: 'Panel Products', value: '7' },
  { icon: TrendingUp, label: 'Uptime', value: '99.9%' },
]

export const HomePage: React.FC = () => {
  const { user } = useAuth()

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="absolute inset-0 bg-gradient-radial from-brand-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <Zap className="h-3.5 w-3.5" />
            Premium Digital Services
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            DHRUVA{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">
              CORPORATION
            </span>
          </h1>
          <p className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Your trusted source for premium digital products and services. Secure, instant, and reliable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg" className="gap-2">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="outline">
                  Create Free Account
                </Button>
              </Link>
            )}
            {user && (
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-dark-800/50 bg-dark-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-brand-600/10 border border-brand-500/20 rounded-xl flex items-center justify-center mb-3">
                  <stat.icon className="h-6 w-6 text-brand-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-dark-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose Us</h2>
            <p className="text-dark-400 max-w-xl mx-auto">
              Built for reliability, security, and an exceptional customer experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 bg-dark-800/40 border border-dark-700/50 rounded-xl hover:border-brand-500/30 hover:bg-dark-800/60 transition-all duration-200"
              >
                <div className="w-11 h-11 bg-brand-600/10 border border-brand-500/20 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-dark-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-dark-900/30 border-y border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up with your email in seconds.' },
              { step: '02', title: 'Browse Products', desc: 'Explore our catalog and pick a plan.' },
              { step: '03', title: 'Secure Payment', desc: 'Pay safely via Razorpay.' },
              { step: '04', title: 'Get Access', desc: 'Receive your purchase instantly.' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className="text-5xl font-black text-brand-600/20 mb-3">{item.step}</div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-dark-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      {/* Game & Emulator Support */}
      <section className="py-16 bg-dark-900/30 border-y border-dark-800/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Game & Emulator Support</h2>
            <p className="text-dark-400 text-sm">All our panels are tested and confirmed working on the following platforms</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Games */}
            <div className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-5">
              <div className="text-brand-400 font-bold text-xs uppercase tracking-widest mb-4">🎮 Game Support</div>
              <ul className="space-y-2">
                {['Free Fire MAX', 'Free Fire', 'Free Fire 86'].map(g => (
                  <li key={g} className="flex items-center gap-2 text-sm text-dark-200">
                    <span className="text-green-400">✅</span> {g}
                  </li>
                ))}
              </ul>
            </div>
            {/* Emulators */}
            <div className="bg-dark-800/40 border border-dark-700/50 rounded-xl p-5">
              <div className="text-brand-400 font-bold text-xs uppercase tracking-widest mb-4">💻 Emulator Support</div>
              <ul className="space-y-2">
                {[
                  'BlueStacks 5.22.75 upto',
                  'MSI App Player 5.22.75 upto',
                  'Nox Player',
                  'LDPlayer',
                  'MEmu Player',
                  'SmartGaGa',
                  'GameLoop',
                ].map(e => (
                  <li key={e} className="flex items-center gap-2 text-sm text-dark-200">
                    <span className="text-green-400">✅</span> {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a
              href="https://discord.gg/mkMhUzpqU6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.02.011.04.027.052a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Join Discord for Panel Details
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-dark-400 mb-8">
            Join thousands of customers who trust Dhruva Corporation for their digital needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button size="lg">
                View Products <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="secondary">Create Account</Button>
              </Link>
            )}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center text-sm text-dark-400">
            {['Secure payments', 'Instant delivery', '24/7 support'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
