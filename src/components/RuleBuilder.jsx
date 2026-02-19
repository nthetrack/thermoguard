import React from 'react'
import { useApp } from '../context/AppContext'
import { Cpu, Bell, Wrench, Wind, ToggleLeft, ToggleRight } from 'lucide-react'

const ACTION_LABELS = {
  notify_manager: { label: 'Notify Maintenance Manager', icon: Bell, color: 'text-amber-600' },
  dispatch_technician: { label: 'Dispatch HVAC Technician', icon: Wrench, color: 'text-blue-600' },
  order_rental: { label: 'Order Temporary AC Unit', icon: Wind, color: 'text-cyan-600' },
}

const CONDITION_LABELS = {
  temp_above: 'Temperature exceeds',
  temp_below: 'Temperature drops below',
}

export default function RuleBuilder({ rules, devices }) {
  const { dispatch } = useApp()

  return (
    <div className="space-y-4" data-tour="rule-builder">
      {rules.map(rule => {
        const device = devices.find(d => d.id === rule.deviceId)
        return (
          <div key={rule.id} className={`card ${rule.enabled ? 'border-brand-200' : 'border-gray-200 opacity-75'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  rule.enabled ? 'bg-brand-100' : 'bg-gray-100'
                }`}>
                  <Cpu size={20} className={rule.enabled ? 'text-brand-600' : 'text-gray-400'} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <p className="text-xs text-gray-500">
                    Device: {device?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_RULE', payload: rule.id })}
                className="flex items-center gap-1.5"
              >
                {rule.enabled ? (
                  <ToggleRight size={28} className="text-brand-600" />
                ) : (
                  <ToggleLeft size={28} className="text-gray-400" />
                )}
              </button>
            </div>

            {/* Condition */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Condition</p>
              <p className="text-sm font-medium text-gray-900">
                IF {CONDITION_LABELS[rule.condition] || rule.condition}{' '}
                <span className="text-red-600 font-bold">{rule.conditionValue}°C</span>
              </p>
            </div>

            {/* Actions */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Then Execute</p>
              <div className="space-y-2">
                {rule.actions.map((action, i) => {
                  const config = ACTION_LABELS[action.type]
                  if (!config) return null
                  const Icon = config.icon
                  return (
                    <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={config.color} />
                        <span className="text-sm text-gray-700">{config.label}</span>
                      </div>
                      <button
                        onClick={() => {
                          const updatedActions = rule.actions.map((a, idx) =>
                            idx === i ? { ...a, enabled: !a.enabled } : a
                          )
                          dispatch({
                            type: 'UPDATE_RULE',
                            payload: { id: rule.id, actions: updatedActions },
                          })
                        }}
                        className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                          action.enabled
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {action.enabled ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
