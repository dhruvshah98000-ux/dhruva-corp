import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, User, LogOut, Zap, Menu,
  HelpCircle, ExternalLink, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { DhruvaLogo } from '../ui/DhruvaLogo'

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/purchases', label: 'My Purchases & Keys', icon: ShoppingBag },
  { to: '/profile', label: 'Profile & Security', icon: User },
  { to: '/support', label: 'Discord & Support', icon: HelpCircle },
]

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) =>
    path === '/dashboard' ? location.pathname === path : location.pathname.startsWith(path)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-dark-950/80 backdrop-blur-2xl">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-white/[0.08]">
        <Link to="/" className="flex items-center group">
          <DhruvaLogo size="sm" subtitle="Client Terminal" />
        </Link>
      </div>

      {/* User Status Card */}
      <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyber-cyan flex items-center justify-center shrink-0 shadow-glow">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate">
              {profile?.full_name || 'VIP Client'}
            </p>
            <p className="text-xs text-dark-400 truncate font-mono">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive(item.to)
                ? 'bg-brand-600/25 text-white border border-brand-500/40 shadow-glow'
                : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <item.icon className={`h-4 w-4 ${isActive(item.to) ? 'text-cyber-cyan' : 'text-dark-400'}`} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/[0.08] space-y-2 bg-dark-900/40">
        <Link
          to="/products"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-cyber-cyan bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all shadow-sm"
        >
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Store Catalog
          </span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/15 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-brand-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-cyber-cyan/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-950/90 border-r border-white/[0.08] shrink-0 relative z-20">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-dark-950/80 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-dark-950 border-r border-white/[0.08] flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-dark-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between h-16 px-4 bg-dark-950/90 border-b border-white/[0.08] backdrop-blur-md sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-dark-400 hover:text-white hover:bg-dark-850 border border-white/[0.06]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <DhruvaLogo size="sm" withText={false} />
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
