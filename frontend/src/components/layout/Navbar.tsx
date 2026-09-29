import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, User, LogOut, LayoutDashboard, ShoppingBag, ChevronDown, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { DhruvaLogo } from '../ui/DhruvaLogo'

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'))

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/products', label: 'Store', icon: ShoppingBag },
        { to: '/dashboard/purchases', label: 'My Keys', icon: null },
        { to: '/support', label: 'Support', icon: null },
      ]
    : [
        { to: '/', label: 'Home', icon: null },
        { to: '/products', label: 'Store', icon: ShoppingBag },
        { to: '/support', label: 'Support', icon: null },
      ]

  return (
    <header className="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group transition-transform active:scale-95">
            <DhruvaLogo size="md" subtitle="FREE FIRE HEADSHOT" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-dark-900/60 border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white bg-brand-600/30 border border-brand-500/40 shadow-glow'
                    : 'text-dark-300 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin')
                    ? 'text-red-400 bg-red-600/20 border border-red-500/30'
                    : 'text-red-400/80 hover:text-red-300 hover:bg-red-500/10'
                }`}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-dark-900/80 border border-white/[0.08] hover:border-brand-500/40 hover:bg-dark-850 transition-all text-sm group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-cyber-cyan flex items-center justify-center shadow-glow">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-medium max-w-[120px] truncate text-xs">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-dark-400 group-hover:text-white transition-colors" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-dark-900/95 border border-white/[0.1] rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden py-1 animate-slide-up z-50">
                    <div className="px-4 py-2.5 border-b border-white/[0.06]">
                      <p className="text-[11px] text-dark-400 uppercase font-mono">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark-200 hover:bg-brand-600/20 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-brand-400" />
                      Client Dashboard
                    </Link>
                    <Link
                      to="/dashboard/purchases"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark-200 hover:bg-brand-600/20 hover:text-white transition-colors"
                    >
                      <ShoppingBag className="h-4 w-4 text-cyber-cyan" />
                      Purchases & Loaders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-dark-200 hover:bg-brand-600/20 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-brand-300" />
                      Profile Settings
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-white/[0.06]" />
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors font-semibold"
                        >
                          <Sparkles className="h-4 w-4 text-amber-400" />
                          Master Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-white/[0.06]" />
                    <button
                      onClick={() => { setUserMenuOpen(false); handleSignOut() }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/15 transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-dark-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="relative group overflow-hidden px-4.5 py-2 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 border border-brand-400/40 shadow-glow hover:shadow-glow-lg transition-all"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-cyber-cyan" /> Get Access
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-800 border border-white/[0.06] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-dark-950/95 backdrop-blur-2xl animate-fade-in px-4 py-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? 'bg-brand-600/25 text-white border border-brand-500/40 shadow-glow'
                    : 'text-dark-300 hover:text-white hover:bg-dark-850'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10"
              >
                Admin Panel
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm text-dark-300 hover:text-white hover:bg-dark-850"
                >
                  Profile ({user.email})
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut() }}
                  className="w-full text-left px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-center text-dark-200 bg-dark-850 border border-white/[0.08]"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-center text-white bg-gradient-to-r from-brand-600 to-indigo-600 shadow-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

