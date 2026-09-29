import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MessageCircle, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react'
import { DhruvaLogo } from '../ui/DhruvaLogo'

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-dark-950 border-t border-white/[0.08] mt-auto overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-600/10 blur-[100px] pointer-events-none" />

      {/* Discord Community Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden bg-gradient-to-r from-indigo-950/60 via-dark-900/90 to-brand-950/60 border border-brand-500/30 backdrop-blur-xl shadow-glass flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-glow">
              <MessageCircle className="h-7 w-7 text-indigo-400" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> 10,000+ Active Members
              </div>
              <h3 className="text-xl font-bold text-white">Join the Official Dhruva Corp Discord</h3>
              <p className="text-dark-400 text-sm mt-0.5">
                Instant panel downloads, live bypass patch updates, loader help & 24/7 staff support.
              </p>
            </div>
          </div>
          <a
            href="https://discord.gg/mkMhUzpqU6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-glow hover:shadow-glow-lg transition-all active:scale-95 shrink-0"
          >
            Join Discord VIP <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-white/[0.06]">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <DhruvaLogo size="lg" subtitle="FREE FIRE HEADSHOT" />
            <p className="text-dark-400 text-sm leading-relaxed max-w-sm">
              The premier destination for Free Fire optimization panels, advanced anti-detection bypasses, and high-performance gaming utilities.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Safe & Undetected Architecture</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home Page' },
                { to: '/products', label: 'Panel Store' },
                { to: '/dashboard', label: 'Customer Dashboard' },
                { to: '/support', label: '24/7 Support Desk' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-400 hover:text-brand-300 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Supported Panels */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Top Panels</h4>
            <ul className="space-y-2 text-sm text-dark-400">
              <li><Link to="/products" className="hover:text-brand-300 transition-colors">Free Fire Aimbot Pro</Link></li>
              <li><Link to="/products" className="hover:text-brand-300 transition-colors">Brutal / Max Aim Mode</Link></li>
              <li><Link to="/products" className="hover:text-brand-300 transition-colors">Aimkill Headshot Lock</Link></li>
              <li><Link to="/products" className="hover:text-brand-300 transition-colors">UID & LIB Bypass Tools</Link></li>
              <li><Link to="/products" className="hover:text-brand-300 transition-colors">iOS & Android Mobile Panels</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Direct Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-dark-300">
                <Mail className="h-4 w-4 text-brand-400 shrink-0" />
                <span className="truncate">support@dhruva.corp</span>
              </li>
              <li className="flex items-center gap-2 text-dark-300">
                <MessageCircle className="h-4 w-4 text-indigo-400 shrink-0" />
                <a
                  href="https://discord.gg/mkMhUzpqU6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-300 transition-colors"
                >
                  discord.gg/mkMhUzpqU6
                </a>
              </li>
              <li className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-900 border border-white/[0.06] text-xs text-dark-400">
                  <span>⏱ Avg Response: &lt; 15 mins</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Trust Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-dark-500 text-xs flex items-center gap-1.5">
            © {new Date().getFullYear()} Dhruva Corporation. Crafted with{' '}
            <Heart className="h-3 w-3 text-red-500 inline fill-red-500" /> for gamers worldwide.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">
              Privacy Policy
            </Link>
            <span className="text-xs font-mono text-dark-600">Razorpay Verified 🔒</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

