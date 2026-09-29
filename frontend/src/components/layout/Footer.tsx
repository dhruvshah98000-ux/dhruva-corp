import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Mail, Phone, MessageCircle } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-dark-800/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white tracking-tight">
                DHRUVA <span className="text-brand-400">CORPORATION</span>
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed max-w-xs">
              Premium digital services and software solutions. Trusted by thousands of customers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'Products' },
                { to: '/support', label: 'Support' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/privacy', label: 'Privacy Policy' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-dark-400 hover:text-brand-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-dark-400">
                <Mail className="h-4 w-4 text-brand-400" />
                <span>support@dhruva.corp</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-400">
                <Phone className="h-4 w-4 text-brand-400" />
                <span>+91 XXXXX XXXXX</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-dark-400">
                <MessageCircle className="h-4 w-4 text-brand-400" />
                <a href="https://discord.gg/mkMhUzpqU6" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors">
                  Discord Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-dark-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-dark-500 text-xs">
            © {new Date().getFullYear()} Dhruva Corporation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Terms</Link>
            <Link to="/privacy" className="text-dark-500 hover:text-dark-300 text-xs transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
