import React from 'react'
import { useApp } from '../context/AppContext'
import { StatsGrid, PlatformStats, ActivityFeed } from '../components/AnalyticsWidgets'
import DeviceCard from '../components/DeviceCard'
import AlertCard from '../components/AlertCard'
import SimulationControls from '../components/SimulationControls'

export default function AdminDashboard() {
  const { state } = useApp()
  const recentAlerts = state.alerts.slice(0, 5)
  const criticalDevices = state.devices.filter(d => d.status === 'critical' || d.status === 'warning')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and system monitoring</p>
        </div>
      </div>

      <StatsGrid />
      <PlatformStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>

        {/* Simulation Controls */}
        <div>
          <SimulationControls />
        </div>
      </div>

      {/* Critical Devices */}
      {criticalDevices.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Devices Needing Attention</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalDevices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Alerts */}
      {recentAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* All Devices Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">All Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.devices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}
