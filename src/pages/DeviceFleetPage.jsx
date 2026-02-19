import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import DeviceCard from '../components/DeviceCard'
import TemperatureChart from '../components/TemperatureChart'
import StatusBadge from '../components/StatusBadge'
import { Search, Filter, Thermometer, MapPin, StickyNote, X, Save } from 'lucide-react'

export default function DeviceFleetPage() {
  const { state, dispatch } = useApp()
  const { currentUser, devices } = state
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')

  // Filter devices by customer if not admin
  let filteredDevices = currentUser.role === 'admin'
    ? devices
    : devices.filter(d => d.customerId === currentUser.customerId)

  // Apply status filter
  if (filter !== 'all') {
    filteredDevices = filteredDevices.filter(d => d.status === filter)
  }

  // Apply search
  if (search) {
    const s = search.toLowerCase()
    filteredDevices = filteredDevices.filter(d =>
      d.name.toLowerCase().includes(s) || d.location.toLowerCase().includes(s)
    )
  }

  const saveField = (deviceId, field) => {
    dispatch({
      type: 'UPDATE_DEVICE_FIELD',
      payload: { deviceId, field, value: editValue },
    })
    setEditingField(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Fleet</h1>
          <p className="text-sm text-gray-500 mt-1">{filteredDevices.length} devices monitored</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search devices..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'normal', 'warning', 'critical'].map(f => (
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
      </div>

      {/* Device grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onClick={() => setSelectedDevice(device)}
          />
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="card text-center py-16">
          <Thermometer size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No devices match your filter</p>
        </div>
      )}

      {/* Device Detail Modal */}
      {selectedDevice && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedDevice(null)} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[90vh]">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">{selectedDevice.name}</h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status + Temp */}
              <div className="flex items-center justify-between">
                <StatusBadge status={selectedDevice.status} size="lg" />
                <p className={`text-3xl font-bold ${
                  selectedDevice.status === 'critical' ? 'text-red-600' :
                  selectedDevice.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {selectedDevice.temperature.toFixed(1)}°C
                </p>
              </div>

              {/* Location (editable) */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <MapPin size={12} /> Location
                </label>
                {editingField === 'location' ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      autoFocus
                    />
                    <button onClick={() => saveField(selectedDevice.id, 'location')} className="btn-primary py-2 px-3">
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <p
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg -mx-3"
                    onClick={() => { setEditingField('location'); setEditValue(selectedDevice.location) }}
                  >
                    {selectedDevice.location}
                    <span className="text-xs text-gray-400 ml-2">(click to edit)</span>
                  </p>
                )}
              </div>

              {/* Notes (editable) */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <StickyNote size={12} /> Notes
                </label>
                {editingField === 'notes' ? (
                  <div className="flex gap-2">
                    <textarea
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      rows={3}
                      autoFocus
                    />
                    <button onClick={() => saveField(selectedDevice.id, 'notes')} className="btn-primary py-2 px-3 self-start">
                      <Save size={16} />
                    </button>
                  </div>
                ) : (
                  <p
                    className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg -mx-3"
                    onClick={() => { setEditingField('notes'); setEditValue(selectedDevice.notes || '') }}
                  >
                    {selectedDevice.notes || 'No notes'}
                    <span className="text-xs text-gray-400 ml-2">(click to edit)</span>
                  </p>
                )}
              </div>

              {/* Thresholds */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600 font-medium">Min Threshold</p>
                  <p className="text-xl font-bold text-blue-800">{selectedDevice.thresholdMin}°C</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-medium">Max Threshold</p>
                  <p className="text-xl font-bold text-red-800">{selectedDevice.thresholdMax}°C</p>
                </div>
              </div>

              {/* Chart */}
              {selectedDevice.history.length > 2 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Temperature History</p>
                  <TemperatureChart
                    history={selectedDevice.history}
                    thresholdMin={selectedDevice.thresholdMin}
                    thresholdMax={selectedDevice.thresholdMax}
                    height={180}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
