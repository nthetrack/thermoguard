import React, { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { MultiDeviceChart } from '../components/TemperatureChart'
import { generateHistoricalData, generateIncidentHistory } from '../data/seeds'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { FileBarChart, Thermometer, Clock, AlertTriangle } from 'lucide-react'

export default function ReportsPage() {
  const { state } = useApp()
  const historicalData = useMemo(() => generateHistoricalData(), [])
  const incidentHistory = useMemo(() => generateIncidentHistory(), [])

  // Alert severity breakdown
  const severityData = [
    { name: 'Critical', value: state.alerts.filter(a => a.severity === 'critical').length + 2, color: '#ef4444' },
    { name: 'Warning', value: state.alerts.filter(a => a.severity === 'warning').length + 3, color: '#f59e0b' },
    { name: 'Normal', value: 12, color: '#10b981' },
  ]

  // Response time data
  const responseData = [
    { vendor: 'ProCool HVAC', avgTime: 45, jobs: 234 },
    { vendor: 'CoolAir Rentals', avgTime: 120, jobs: 156 },
  ]

  // Monthly alerts
  const monthlyAlerts = [
    { month: 'Sep', alerts: 3 },
    { month: 'Oct', alerts: 5 },
    { month: 'Nov', alerts: 2 },
    { month: 'Dec', alerts: 8 },
    { month: 'Jan', alerts: 4 },
    { month: 'Feb', alerts: state.alerts.length + 1 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Historical data and performance metrics</p>
      </div>

      {/* Temperature History */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Thermometer size={18} className="text-brand-600" />
          <h2 className="font-semibold text-gray-900">24-Hour Temperature History</h2>
        </div>
        <MultiDeviceChart data={historicalData} height={300} />
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          {[
            { name: 'Ward A', color: '#3b82f6' },
            { name: 'Server Room', color: '#ef4444' },
            { name: 'Common Area', color: '#10b981' },
            { name: 'Storefront', color: '#f59e0b' },
            { name: 'Chocolate Storage', color: '#8b5cf6' },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-2 text-xs text-gray-600">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Alerts */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-600" />
            <h2 className="font-semibold text-gray-900">Monthly Alert Trend</h2>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAlerts} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="alerts" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Severity */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <FileBarChart size={18} className="text-brand-600" />
            <h2 className="font-semibold text-gray-900">Alert Severity Breakdown</h2>
          </div>
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Vendor Response Times */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-emerald-600" />
          <h2 className="font-semibold text-gray-900">Vendor Response Times</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Vendor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Avg Response</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Jobs Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
              </tr>
            </thead>
            <tbody>
              {state.vendors.map(vendor => (
                <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{vendor.name}</td>
                  <td className="py-3 px-4 text-gray-600">{vendor.responseTime}</td>
                  <td className="py-3 px-4 text-gray-600">{vendor.jobsCompleted}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {vendor.rating}/5.0
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident History */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Incident History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-500">Device</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Severity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Peak Temp</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Response Time</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Resolved By</th>
              </tr>
            </thead>
            <tbody>
              {incidentHistory.map(incident => (
                <tr key={incident.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{incident.deviceName}</td>
                  <td className="py-3 px-4 text-gray-600">{incident.customer}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                      incident.severity === 'critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{incident.temperature}°C</td>
                  <td className="py-3 px-4 text-gray-600">{incident.responseTime}</td>
                  <td className="py-3 px-4 text-gray-600">{incident.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
