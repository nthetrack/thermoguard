import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import AlertCard from '../components/AlertCard'
import { Bell, Filter } from 'lucide-react'

export default function AlertsPage() {
  const { state, dispatch } = useApp()
  const { currentUser, alerts } = state
  const [filter, setFilter] = useState('all')

  let myAlerts = currentUser.role === 'admin'
    ? alerts
    : alerts.filter(a => a.customerId === currentUser.customerId)

  if (filter === 'unacknowledged') {
    myAlerts = myAlerts.filter(a => !a.acknowledged)
  } else if (filter === 'critical') {
    myAlerts = myAlerts.filter(a => a.severity === 'critical')
  } else if (filter === 'warning') {
    myAlerts = myAlerts.filter(a => a.severity === 'warning')
  }

  const isManager = currentUser.role === 'manager'

  const handleDispatch = (alert) => {
    dispatch({
      type: 'ADD_JOB',
      payload: {
        alertId: alert.id,
        vendorId: 'v1',
        vendorName: 'ProCool HVAC Services',
        customerId: alert.customerId,
        customerName: alert.customerName,
        type: 'repair',
        status: 'new',
        location: alert.location,
        deviceName: alert.deviceName,
        issue: `Temperature ${alert.severity}: ${alert.temperature.toFixed(1)}°C`,
        temperature: alert.temperature,
        createdAt: Date.now(),
      },
    })
  }

  const handleRental = (alert) => {
    dispatch({
      type: 'ADD_JOB',
      payload: {
        alertId: alert.id,
        vendorId: 'v2',
        vendorName: 'CoolAir Rentals',
        customerId: alert.customerId,
        customerName: alert.customerName,
        type: 'rental',
        status: 'new',
        location: alert.location,
        deviceName: alert.deviceName,
        issue: `Temporary AC required. Temperature ${alert.severity}: ${alert.temperature.toFixed(1)}°C`,
        temperature: alert.temperature,
        createdAt: Date.now(),
      },
    })
  }

  const handleMonitor = (alert) => {
    // Just acknowledge, no dispatch
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isManager ? 'Alerts & Actions' : 'Alert History'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {myAlerts.length} alert{myAlerts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'unacknowledged', 'critical', 'warning'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {myAlerts.length === 0 ? (
        <div className="card text-center py-16">
          <Bell size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No alerts</h3>
          <p className="text-sm text-gray-500">
            {filter === 'all'
              ? 'Alerts will appear here when device thresholds are breached'
              : `No ${filter} alerts found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {myAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              showActions={isManager}
              onDispatch={handleDispatch}
              onRental={handleRental}
              onMonitor={handleMonitor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
