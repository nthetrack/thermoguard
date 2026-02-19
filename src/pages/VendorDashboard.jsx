import React from 'react'
import { useApp } from '../context/AppContext'
import JobCard from '../components/JobCard'
import { Wrench, Wind, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default function VendorDashboard() {
  const { state } = useApp()
  const { currentUser, jobs } = state

  const myJobs = jobs.filter(j => j.vendorId === currentUser.vendorId)

  const newJobs = myJobs.filter(j => j.status === 'new')
  const acceptedJobs = myJobs.filter(j => j.status === 'accepted')
  const inProgressJobs = myJobs.filter(j => j.status === 'in_progress')
  const resolvedJobs = myJobs.filter(j => j.status === 'resolved')
  const isRental = currentUser.role === 'rental'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isRental ? 'Rental Provider' : 'Technician'} Job Board
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {currentUser.company} — Incoming service requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-emerald-500" />
            <span className="text-xs text-gray-500">New</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{newJobs.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-amber-500" />
            <span className="text-xs text-gray-500">Accepted</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{acceptedJobs.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-2">
            {isRental ? <Wind size={16} className="text-blue-500" /> : <Wrench size={16} className="text-blue-500" />}
            <span className="text-xs text-gray-500">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{inProgressJobs.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-gray-400">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-gray-500" />
            <span className="text-xs text-gray-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{resolvedJobs.length}</p>
        </div>
      </div>

      {/* No jobs message */}
      {myJobs.length === 0 && (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            {isRental ? <Wind size={32} className="text-gray-300" /> : <Wrench size={32} className="text-gray-300" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs yet</h3>
          <p className="text-sm text-gray-500">
            New service requests will appear here when alerts are triggered and dispatched.
          </p>
        </div>
      )}

      {/* New Jobs */}
      {newJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            New Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newJobs.map(job => (
              <JobCard key={job.id} job={job} isVendorView />
            ))}
          </div>
        </div>
      )}

      {/* Accepted / In Progress */}
      {(acceptedJobs.length > 0 || inProgressJobs.length > 0) && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            Active Jobs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...acceptedJobs, ...inProgressJobs].map(job => (
              <JobCard key={job.id} job={job} isVendorView />
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolvedJobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400" />
            Completed
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resolvedJobs.map(job => (
              <JobCard key={job.id} job={job} isVendorView />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
