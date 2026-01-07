import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Trello,
  FileText,
  CreditCard,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft
} from 'lucide-react'

const menuItems = [
  { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, path: '/admin/overview' },
  { id: 'users', label: 'Users Management', icon: Users, path: '/admin/users' },
  { id: 'templates', label: 'Templates Management', icon: FileText, path: '/admin/templates' },
  { id: 'plans', label: 'Plans & Subscriptions', icon: CreditCard, path: '/admin/plans' },
  { id: 'payments', label: 'Payments & Billing', icon: DollarSign, path: '/admin/payments' },
]

export function AdminSidebar({
  isOpen,
  onToggle
}) {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {isOpen && (
          <h1 className="text-xl text-gray-900">
            Admin Panel
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 text-gray-600 transition-transform ${
              !isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                {isOpen && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Admin Dashboard v1.0
          </div>
        </div>
      )}
    </aside>
  )
}