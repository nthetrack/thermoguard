import React from 'react'
import { useApp } from '../context/AppContext'
import RuleBuilder from '../components/RuleBuilder'
import { Cpu } from 'lucide-react'

export default function RulesPage() {
  const { state } = useApp()
  const { currentUser, automationRules, devices } = state

  const myRules = currentUser.role === 'admin'
    ? automationRules
    : automationRules.filter(r => r.customerId === currentUser.customerId)

  const myDevices = currentUser.role === 'admin'
    ? devices
    : devices.filter(d => d.customerId === currentUser.customerId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure automated responses when device thresholds are breached
        </p>
      </div>

      {/* Info */}
      <div className="card bg-brand-50 border-brand-200">
        <div className="flex items-start gap-3">
          <Cpu size={20} className="text-brand-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-brand-900 text-sm">How Automation Works</h3>
            <p className="text-xs text-brand-700 mt-1 leading-relaxed">
              When a device reading meets your configured condition, the system automatically
              executes the enabled actions. Toggle individual actions ON or OFF for each rule.
              Disable the entire rule with the main toggle switch.
            </p>
          </div>
        </div>
      </div>

      {myRules.length === 0 ? (
        <div className="card text-center py-16">
          <Cpu size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No automation rules configured</p>
        </div>
      ) : (
        <RuleBuilder rules={myRules} devices={myDevices} />
      )}
    </div>
  )
}
