import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Zap, User, LogOut, LayoutDashboard, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

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

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/')

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/products', label: 'Products', icon: ShoppingBag },
        { to: '/dashboard/purchases', label: 'Purchases', icon: ShoppingBag },
        { to: '/support', label: 'Support', icon: null },
      ]
    : [
        { to: '/', label: 'Home', icon: null },
        { to: '/products', label: 'Products', icon: null },
        { to: '/support', label: 'Support', icon: null },
      ]

  return (
    <nav className="sticky top-0 z-40 bg-dark-900/90 backdrop-blur-md border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">
              DHRUVA <span className="text-brand-400">CORP</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(link.to)
                    ? 'bg-brand-600/20 text-brand-400'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive('/admin')
                    ? 'bg-brand-600/20 text-brand-400'
                    : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800 border border-dark-700 hover:border-brand-500/40 transition-all text-sm"
                >
                  <div className="w-7 h-7 bg-brand-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-dark-200 max-w-[120px] truncate">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-dark-400" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl overflow-hidden">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-dark-200 hover:bg-dark-700 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-dark-700" />
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-yellow-400 hover:bg-dark-700 transition-colors font-medium"
                        >
                          <Zap className="h-4 w-4" />
                          👑 Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="border-t border-dark-700" />
                    <button
                      onClick={() => { setUserMenuOpen(false); handleSignOut() }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-dark-700 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-dark-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition-all shadow-glow hover:shadow-glow-lg"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-dark-400 hover:text-white hover:bg-dark-700 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dark-700/50 bg-dark-900/95 backdrop-blur-md">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-brand-600/20 text-brand-400' : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium text-dark-300 hover:text-white hover:bg-dark-700/50">
                Admin
              </Link>
            )}
            <div className="pt-3 border-t border-dark-700/50 space-y-1">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-700/50">
                    Profile
                  </Link>
                  <button onClick={() => { setMobileOpen(false); handleSignOut() }} className="w-full text-left px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-dark-700/50">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm text-dark-300 hover:text-white hover:bg-dark-700/50">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-lg text-sm font-medium bg-brand-600 text-white rounded-lg text-center">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
