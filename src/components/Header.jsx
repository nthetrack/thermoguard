import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Menu, Bell, ChevronDown } from 'lucide-react'

export default function Header() {
  const { state, dispatch } = useApp()
  const [showAlertDropdown, setShowAlertDropdown] = useState(false)
  const { currentUser, alerts } = state

  if (!currentUser) return null

  const recentAlerts = alerts.filter(a => !a.acknowledged).slice(0, 5)

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20" data-tour="header">
      <div className="flex items-center gap-3">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <div className="hidden md:block">
          <h2 className="text-sm font-medium text-gray-500">Welcome back,</h2>
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live Monitoring
        </div>

        {/* Alert bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDropdown(!showAlertDropdown)}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {recentAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {recentAlerts.length}
              </span>
            )}
          </button>

          {showAlertDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowAlertDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Recent Alerts</h3>
                  {recentAlerts.length > 0 && (
                    <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {recentAlerts.length} new
                    </span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {recentAlerts.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      No new alerts
                    </div>
                  ) : (
                    recentAlerts.map(alert => (
                      <div key={alert.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                        <div className="flex items-start gap-2">
                          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            alert.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                          }`} />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{alert.deviceName}</p>
                            <p className="text-xs text-gray-500 truncate">{alert.location}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {alert.temperature.toFixed(1)}°C &bull; {new Date(alert.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User avatar (mobile) */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-medium">
            {currentUser.avatar}
          </div>
        </div>
      </div>
    </header>
  )
}
