import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../data/users'
import {
  LayoutDashboard, Thermometer, Bell, Wrench, FileBarChart,
  Settings, Users, Building2, Truck, PlayCircle, LogOut, X, Cpu
} from 'lucide-react'

const roleNavItems = {
  [ROLES.ADMIN]: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, tourId: 'nav-dashboard' },
    { path: '/devices', label: 'All Devices', icon: Thermometer, tourId: 'nav-devices' },
    { path: '/alerts', label: 'Alerts', icon: Bell, tourId: 'nav-alerts' },
    { path: '/jobs', label: 'Jobs', icon: Wrench },
    { path: '/customers', label: 'Customers', icon: Building2 },
    { path: '/vendors', label: 'Vendors', icon: Truck },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
    { path: '/notifications', label: 'Notification Log', icon: Bell },
    { path: '/simulation', label: 'Simulation', icon: PlayCircle, tourId: 'nav-simulation' },
  ],
  [ROLES.CUSTOMER]: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/devices', label: 'My Devices', icon: Thermometer },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/rules', label: 'Automation Rules', icon: Cpu },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
  ],
  [ROLES.MANAGER]: [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/devices', label: 'Devices', icon: Thermometer },
    { path: '/alerts', label: 'Alerts & Actions', icon: Bell },
    { path: '/jobs', label: 'Jobs', icon: Wrench },
    { path: '/reports', label: 'Reports', icon: FileBarChart },
  ],
  [ROLES.TECHNICIAN]: [
    { path: '/dashboard', label: 'Job Board', icon: LayoutDashboard },
    { path: '/jobs', label: 'My Jobs', icon: Wrench },
  ],
  [ROLES.RENTAL]: [
    { path: '/dashboard', label: 'Job Board', icon: LayoutDashboard },
    { path: '/jobs', label: 'My Jobs', icon: Wrench },
  ],
}

export default function Sidebar() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, sidebarOpen, alerts } = state

  if (!currentUser) return null

  const navItems = roleNavItems[currentUser.role] || []
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-gray-900 text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center gap-2" data-tour="brand">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-sm">
            TG
          </div>
          <div>
            <span className="font-bold text-lg">ThermoGuard</span>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
          className="lg:hidden p-1 hover:bg-gray-800 rounded"
        >
          <X size={20} />
        </button>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center font-medium text-sm">
            {currentUser.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{currentUser.name}</p>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${ROLE_COLORS[currentUser.role]}`}>
              {ROLE_LABELS[currentUser.role]}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin" data-tour="navigation">
        <ul className="space-y-1 px-3">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <li key={item.path}>
                <button
                  onClick={() => {
                    navigate(item.path)
                    dispatch({ type: 'CLOSE_SIDEBAR' })
                  }}
                  data-tour={item.tourId}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors duration-150
                    ${isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                  {item.label.includes('Alert') && unacknowledgedAlerts > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {unacknowledgedAlerts}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Tour button */}
      <div className="px-3 pb-2">
        <button
          onClick={() => {
            dispatch({ type: 'START_TOUR' })
            navigate('/dashboard')
            dispatch({ type: 'CLOSE_SIDEBAR' })
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <PlayCircle size={18} />
          <span>Start Guided Tour</span>
        </button>
      </div>

      {/* Quick switch & logout */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        {currentUser.role === 'admin' && (
          <div className="mb-2">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-3">Quick Switch</p>
            {state.users.filter(u => u.id !== currentUser.id).slice(0, 4).map(user => (
              <button
                key={user.id}
                onClick={() => {
                  dispatch({ type: 'SWITCH_USER', payload: user.id })
                  navigate('/dashboard')
                  dispatch({ type: 'CLOSE_SIDEBAR' })
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs
                  text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-medium">
                  {user.avatar}
                </span>
                <span className="truncate">{user.name}</span>
                <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded ${ROLE_COLORS[user.role]}`}>
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => {
            dispatch({ type: 'LOGOUT' })
            navigate('/login')
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
