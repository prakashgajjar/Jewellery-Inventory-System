import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  FileText,
  Settings,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Sidebar = ({ open }) => {
  const location = useLocation()
  const { isAdmin } = useAuth()

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: ShoppingCart, label: 'Billing', path: '/billing' },
    { icon: FileText, label: 'Orders', path: '/orders' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    ...(isAdmin ? [{ icon: Settings, label: 'Settings', path: '/settings' }] : []),
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div
      className={`${
        open ? 'w-64' : 'w-0'
      } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">💎 Jewellery</h1>
        <p className="text-xs text-gray-500">Inventory System</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-soft transition-colors ${
                isActive(item.path)
                  ? 'bg-bg-light text-primary font-medium'
                  : 'text-gray-600 hover:bg-bg-lighter'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
        <p>v1.0.0</p>
      </div>
    </div>
  )
}

export default Sidebar
