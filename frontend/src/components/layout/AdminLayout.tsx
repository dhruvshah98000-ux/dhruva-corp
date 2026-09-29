import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Users, Package, Settings,
  LogOut, Menu, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { DhruvaLogo } from '../ui/DhruvaLogo'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Orders & Payments', icon: ShoppingBag, exact: false },
  { to: '/admin/products', label: 'Manage Products', icon: Package, exact: false },
  { to: '/admin/customers', label: 'Customer Base', icon: Users, exact: false },
  { to: '/admin/settings', label: 'System Settings', icon: Settings, exact: false },
]

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-dark-950/90 backdrop-blur-2xl">
      <div className="px-6 py-5 border-b border-white/[0.08]">
        <Link to="/" className="flex items-center gap-2">
          <DhruvaLogo size="sm" subtitle="Master Admin Console" />
        </Link>
      </div>

      <div className="px-5 py-3.5 border-b border-white/[0.06] bg-amber-500/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider">Root Admin</span>
        </div>
        <div className="text-xs font-mono text-dark-300 truncate mt-1">{user?.email}</div>
      </div>

      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {adminNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
              isActive(item.to, item.exact)
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow'
                : 'text-dark-300 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.08] space-y-2 bg-dark-900/40">
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold text-dark-300 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <LayoutDashboard className="h-4 w-4 text-brand-400" />
          Switch to User Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/15 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Admin Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex relative overflow-hidden">
      {/* Background ambient red/amber glow for admin feel */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

      <aside className="hidden md:flex flex-col w-64 bg-dark-950/90 border-r border-white/[0.08] shrink-0 relative z-20">
        <SidebarContent />
      </aside>

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

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <div className="md:hidden flex items-center justify-between h-16 px-4 bg-dark-950/90 border-b border-white/[0.08] sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-dark-400 hover:text-white border border-white/[0.06]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-white text-sm">ADMIN CONSOLE</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
