import React from 'react'
import { useApp } from '../context/AppContext'
import DeviceCard from '../components/DeviceCard'
import AlertCard from '../components/AlertCard'
import TemperatureChart from '../components/TemperatureChart'
import { Thermometer, AlertTriangle, CheckCircle2, Activity } from 'lucide-react'

export default function CustomerDashboard() {
  const { state } = useApp()
  const { currentUser, devices, alerts } = state

  const myDevices = devices.filter(d => d.customerId === currentUser.customerId)
  const myAlerts = alerts.filter(a => a.customerId === currentUser.customerId)
  const criticalCount = myDevices.filter(d => d.status === 'critical').length
  const warningCount = myDevices.filter(d => d.status === 'warning').length
  const normalCount = myDevices.filter(d => d.status === 'normal').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{currentUser.company} — Device Fleet Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-tour="stats-grid">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={16} className="text-brand-500" />
            <span className="text-xs text-gray-500">Total Devices</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{myDevices.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="text-xs text-gray-500">Normal</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{normalCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-amber-500" />
            <span className="text-xs text-gray-500">Warning</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-xs text-gray-500">Critical</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
        </div>
      </div>

      {/* Device Fleet */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Device Fleet</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDevices.map(device => (
            <div key={device.id}>
              <DeviceCard device={device} />
              {device.history.length > 2 && (
                <div className="card mt-2 p-4">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Temperature History</p>
                  <TemperatureChart
                    history={device.history}
                    thresholdMin={device.thresholdMin}
                    thresholdMax={device.thresholdMax}
                    height={120}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      {myAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Recent Alerts</h2>
          <div className="space-y-3">
            {myAlerts.slice(0, 5).map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
