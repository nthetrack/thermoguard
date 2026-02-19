import React from 'react'
import { AlertTriangle, AlertCircle, Clock, MapPin, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AlertCard({ alert, showActions = false, onDispatch, onRental, onMonitor }) {
  const { dispatch } = useApp()

  const isCritical = alert.severity === 'critical'
  const timeAgo = getTimeAgo(alert.timestamp)

  return (
    <div
      className={`card ${
        isCritical
          ? 'border-red-200 bg-red-50/50'
          : 'border-amber-200 bg-amber-50/50'
      } ${!alert.acknowledged ? 'ring-1 ' + (isCritical ? 'ring-red-300' : 'ring-amber-300') : ''}`}
      data-tour="alert-card"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isCritical ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          {isCritical ? (
            <AlertCircle size={20} className="text-red-600" />
          ) : (
            <AlertTriangle size={20} className="text-amber-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{alert.deviceName}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                <MapPin size={12} />
                <span>{alert.location}</span>
              </div>
            </div>
            <span className={`
              text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider
              ${isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
            `}>
              {alert.severity}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className={`font-bold ${isCritical ? 'text-red-600' : 'text-amber-600'}`}>
              {alert.temperature.toFixed(1)}°C
            </span>
            <span className="flex items-center gap-1 text-gray-500 text-xs">
              <Clock size={12} />
              {timeAgo}
            </span>
            {alert.customerName && (
              <span className="text-xs text-gray-500">{alert.customerName}</span>
            )}
          </div>

          {/* Action buttons for managers */}
          {showActions && !alert.acknowledged && (
            <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200" data-tour="alert-actions">
              <button
                onClick={() => {
                  onDispatch?.(alert)
                  dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alert.id })
                }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Dispatch Technician
              </button>
              <button
                onClick={() => {
                  onRental?.(alert)
                  dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alert.id })
                }}
                className="btn-warning text-xs py-1.5 px-3"
              >
                Order Rental Unit
              </button>
              <button
                onClick={() => {
                  onMonitor?.(alert)
                  dispatch({ type: 'ACKNOWLEDGE_ALERT', payload: alert.id })
                }}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Monitor Only
              </button>
            </div>
          )}

          {alert.acknowledged && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-600">
              <Check size={14} />
              Acknowledged
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
