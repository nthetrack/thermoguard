import React from 'react'
import StatusBadge from './StatusBadge'
import { Thermometer, MapPin, Clock } from 'lucide-react'

export default function DeviceCard({ device, onClick, compact = false }) {
  const tempPercent = Math.min(100, Math.max(0,
    ((device.temperature - device.thresholdMin) / (device.thresholdMax - device.thresholdMin)) * 100
  ))

  const tempColor = device.status === 'critical'
    ? 'text-red-600'
    : device.status === 'warning'
    ? 'text-amber-600'
    : 'text-emerald-600'

  const barColor = device.status === 'critical'
    ? 'bg-red-500'
    : device.status === 'warning'
    ? 'bg-amber-500'
    : 'bg-emerald-500'

  if (compact) {
    return (
      <div
        className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
        onClick={onClick}
        data-tour={`device-${device.id}`}
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          device.status === 'critical' ? 'bg-red-100' : device.status === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'
        }`}>
          <Thermometer size={20} className={tempColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{device.name}</p>
          <p className="text-xs text-gray-500 truncate">{device.location}</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${tempColor}`}>{device.temperature.toFixed(1)}°C</p>
          <StatusBadge status={device.status} size="sm" />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`card hover:shadow-md transition-all cursor-pointer ${
        device.status === 'critical' ? 'ring-2 ring-red-300 border-red-200' :
        device.status === 'warning' ? 'ring-1 ring-amber-200 border-amber-200' : ''
      }`}
      onClick={onClick}
      data-tour={`device-${device.id}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            device.status === 'critical' ? 'bg-red-100' : device.status === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'
          }`}>
            <Thermometer size={24} className={tempColor} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{device.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin size={12} />
              <span>{device.location}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={device.status} />
      </div>

      {/* Temperature display */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Current Temp</p>
          <p className={`text-3xl font-bold ${tempColor}`}>
            {device.temperature.toFixed(1)}
            <span className="text-lg">°C</span>
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Range: {device.thresholdMin}°C – {device.thresholdMax}°C</p>
          <div className="flex items-center gap-1 mt-1 justify-end">
            <Clock size={10} />
            <span>{new Date(device.lastUpdated).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Temperature bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(5, tempPercent))}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1">
        <span>{device.thresholdMin}°C</span>
        <span>{device.thresholdMax}°C</span>
      </div>

      {device.notes && (
        <p className="text-xs text-gray-500 mt-3 border-t border-gray-100 pt-3 line-clamp-2">
          {device.notes}
        </p>
      )}
    </div>
  )
}
