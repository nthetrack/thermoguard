import React from 'react'
import { useApp } from '../context/AppContext'
import { Building2, Thermometer, Mail, Phone, MapPin } from 'lucide-react'

export default function CustomersPage() {
  const { state } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{state.customers.length} registered customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.customers.map(customer => {
          const customerDevices = state.devices.filter(d => d.customerId === customer.id)
          const criticalCount = customerDevices.filter(d => d.status === 'critical').length
          const activeAlerts = state.alerts.filter(a => a.customerId === customer.id && !a.acknowledged).length

          return (
            <div key={customer.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center">
                  <Building2 size={24} className="text-brand-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{customer.name}</h3>
                  <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                    {customer.plan} Plan
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={14} className="text-gray-400" />
                  {customer.address}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  {customer.contactEmail}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {customer.contactPhone}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{customerDevices.length}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Devices</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${criticalCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {criticalCount}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">Critical</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${activeAlerts > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {activeAlerts}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">Alerts</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
