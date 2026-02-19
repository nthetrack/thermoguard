import React from 'react'
import { useApp } from '../context/AppContext'
import { Truck, Wrench, Wind, Star, Clock, CheckCircle2, Mail, Phone } from 'lucide-react'

export default function VendorsPage() {
  const { state } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vendors & Providers</h1>
        <p className="text-sm text-gray-500 mt-1">{state.vendors.length} registered service providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.vendors.map(vendor => {
          const vendorJobs = state.jobs.filter(j => j.vendorId === vendor.id)
          const activeJobs = vendorJobs.filter(j => !['resolved', 'declined'].includes(j.status))
          const isTech = vendor.type === 'technician'

          return (
            <div key={vendor.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isTech ? 'bg-emerald-100' : 'bg-cyan-100'
                }`}>
                  {isTech ? (
                    <Wrench size={24} className="text-emerald-600" />
                  ) : (
                    <Wind size={24} className="text-cyan-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{vendor.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isTech ? 'bg-emerald-100 text-emerald-700' : 'bg-cyan-100 text-cyan-700'
                  }`}>
                    {isTech ? 'HVAC Technician' : 'Rental Provider'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={14} className="text-gray-400" />
                  {vendor.contactEmail}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={14} className="text-gray-400" />
                  {vendor.contactPhone}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={12} className="text-amber-500" />
                    <p className="text-lg font-bold text-gray-900">{vendor.rating}</p>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase">Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{vendor.jobsCompleted}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Completed</p>
                </div>
                <div className="text-center">
                  <p className={`text-lg font-bold ${activeJobs.length > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                    {activeJobs.length}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">Active</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
