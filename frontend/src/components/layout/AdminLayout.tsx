import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Zap, Menu
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
  { to: '/admin/products', label: 'Products', icon: Package, exact: false },
  { to: '/admin/customers', label: 'Customers', icon: Users, exact: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, exact: false },
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
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-dark-700/50">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm tracking-tight">DHRUVA CORP</div>
            <div className="text-xs text-red-400 font-medium">Admin Panel</div>
          </div>
        </Link>
      </div>

      <div className="px-4 py-3 border-b border-dark-700/50">
        <div className="text-xs text-dark-500 uppercase tracking-wider mb-1">Logged in as</div>
        <div className="text-sm text-dark-300 truncate">{user?.email}</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminNav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item.to, item.exact)
                ? 'bg-red-600/20 text-red-400 border border-red-500/20'
                : 'text-dark-300 hover:text-white hover:bg-dark-700/50'
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-dark-700/50 space-y-1">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-dark-400 hover:text-white hover:bg-dark-700/50 transition-colors">
          <LayoutDashboard className="h-4 w-4" />
          User Dashboard
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-dark-700/50 shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-dark-900 border-r border-dark-700/50 flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between h-14 px-4 bg-dark-900/90 border-b border-dark-700/50 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-dark-400 hover:text-white">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-white text-sm">Admin Panel</span>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
