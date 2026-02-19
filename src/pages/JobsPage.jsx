import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import JobCard from '../components/JobCard'
import { Wrench, Filter } from 'lucide-react'

export default function JobsPage() {
  const { state } = useApp()
  const { currentUser, jobs } = state
  const [filter, setFilter] = useState('all')

  let myJobs = jobs
  if (currentUser.role === 'technician' || currentUser.role === 'rental') {
    myJobs = jobs.filter(j => j.vendorId === currentUser.vendorId)
  } else if (currentUser.role === 'manager' || currentUser.role === 'customer') {
    myJobs = jobs.filter(j => j.customerId === currentUser.customerId)
  }

  const isVendor = currentUser.role === 'technician' || currentUser.role === 'rental'

  if (filter !== 'all') {
    myJobs = myJobs.filter(j => j.status === filter)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isVendor ? 'My Jobs' : 'Job Tracker'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">{myJobs.length} jobs</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', 'new', 'accepted', 'in_progress', 'resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {myJobs.length === 0 ? (
        <div className="card text-center py-16">
          <Wrench size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs</h3>
          <p className="text-sm text-gray-500">Jobs will appear when technicians are dispatched</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myJobs.map(job => (
            <JobCard key={job.id} job={job} isVendorView={isVendor} />
          ))}
        </div>
      )}
    </div>
  )
}
