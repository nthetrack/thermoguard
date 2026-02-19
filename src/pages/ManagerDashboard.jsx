import React from 'react'
import { useApp } from '../context/AppContext'
import DeviceCard from '../components/DeviceCard'
import AlertCard from '../components/AlertCard'
import JobCard from '../components/JobCard'
import { StatsGrid } from '../components/AnalyticsWidgets'

export default function ManagerDashboard() {
  const { state, dispatch } = useApp()
  const { currentUser, devices, alerts, jobs, customers } = state

  const myDevices = devices.filter(d => d.customerId === currentUser.customerId)
  const myAlerts = alerts.filter(a => a.customerId === currentUser.customerId)
  const myJobs = jobs.filter(j => j.customerId === currentUser.customerId)
  const unacknowledgedAlerts = myAlerts.filter(a => !a.acknowledged)

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
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        type: 'email',
        to: currentUser.email,
        recipientName: currentUser.name,
        subject: `Monitoring: ${alert.deviceName}`,
        message: `Alert acknowledged. Monitoring only — no dispatch required at this time.`,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentUser.company} — Alert Management & Dispatch
        </p>
      </div>

      <StatsGrid />

      {/* Pending Actions */}
      {unacknowledgedAlerts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            Alerts Requiring Action
            <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {unacknowledgedAlerts.length}
            </span>
          </h2>
          <div className="space-y-3">
            {unacknowledgedAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                showActions
                onDispatch={handleDispatch}
                onRental={handleRental}
                onMonitor={handleMonitor}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active Jobs */}
      {myJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myJobs.filter(j => j.status !== 'resolved').map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Device Overview */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Device Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  )
}
