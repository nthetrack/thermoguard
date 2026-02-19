import React from 'react'
import { useApp } from '../context/AppContext'
import { AlertTriangle, Clock, CheckCircle2, Thermometer, Users, Building2, Truck, Activity } from 'lucide-react'

export function StatsGrid() {
  const { state } = useApp()

  const todayAlerts = state.alerts.filter(
    a => Date.now() - a.timestamp < 86400000
  ).length

  const activeIncidents = state.alerts.filter(a => !a.acknowledged).length

  const resolvedJobs = state.jobs.filter(j => j.status === 'resolved')
  const avgResponseTime = resolvedJobs.length > 0
    ? Math.round(resolvedJobs.reduce((sum, j) => sum + ((j.resolvedAt || 0) - j.createdAt), 0) / resolvedJobs.length / 60000)
    : 0

  const activeJobs = state.jobs.filter(j => !['resolved', 'declined'].includes(j.status)).length

  const stats = [
    {
      label: 'Alerts Today',
      value: todayAlerts,
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      change: todayAlerts > 0 ? `${todayAlerts} active` : 'None',
    },
    {
      label: 'Active Incidents',
      value: activeIncidents,
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      change: activeIncidents > 0 ? 'Needs attention' : 'All clear',
    },
    {
      label: 'Avg Response',
      value: avgResponseTime > 0 ? `${avgResponseTime}m` : '--',
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: resolvedJobs.length > 0 ? `${resolvedJobs.length} resolved` : 'No data',
    },
    {
      label: 'Active Jobs',
      value: activeJobs,
      icon: Truck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      change: `${state.jobs.length} total`,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-tour="stats-grid">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{stat.change}</p>
          </div>
        )
      })}
    </div>
  )
}

export function PlatformStats() {
  const { state } = useApp()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-2">
          <Building2 size={16} className="text-blue-500" />
          <span className="text-xs text-gray-500">Customers</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{state.customers.length}</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-2">
          <Thermometer size={16} className="text-emerald-500" />
          <span className="text-xs text-gray-500">Devices</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{state.devices.length}</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-2">
          <Users size={16} className="text-purple-500" />
          <span className="text-xs text-gray-500">Users</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{state.users.length}</p>
      </div>
      <div className="stat-card">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={16} className="text-amber-500" />
          <span className="text-xs text-gray-500">Vendors</span>
        </div>
        <p className="text-xl font-bold text-gray-900">{state.vendors.length}</p>
      </div>
    </div>
  )
}

export function ActivityFeed() {
  const { state } = useApp()

  const typeIcons = {
    system: Activity,
    alert: AlertTriangle,
    job: Truck,
    device: Thermometer,
  }

  const typeColors = {
    system: 'text-gray-500 bg-gray-100',
    alert: 'text-red-500 bg-red-100',
    job: 'text-blue-500 bg-blue-100',
    device: 'text-emerald-500 bg-emerald-100',
  }

  return (
    <div className="card" data-tour="activity-feed">
      <h3 className="font-semibold text-gray-900 mb-4">Activity Feed</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
        {state.activityFeed.slice(0, 15).map(item => {
          const Icon = typeIcons[item.type] || Activity
          const color = typeColors[item.type] || typeColors.system
          return (
            <div key={item.id} className="flex items-start gap-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{item.message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
