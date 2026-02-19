import React from 'react'
import { MapPin, Clock, Thermometer, User, Wrench, Wind } from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS_STYLES = {
  new: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' },
  pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' },
  accepted: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  in_progress: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', badge: 'bg-indigo-100 text-indigo-800' },
  resolved: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-800' },
  declined: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', badge: 'bg-red-100 text-red-800' },
}

export default function JobCard({ job, isVendorView = false }) {
  const { dispatch } = useApp()
  const style = STATUS_STYLES[job.status] || STATUS_STYLES.new
  const timeOpen = getTimeAgo(job.createdAt)
  const isRental = job.type === 'rental'

  const handleStatusChange = (newStatus) => {
    dispatch({ type: 'UPDATE_JOB_STATUS', payload: { jobId: job.id, status: newStatus } })
  }

  return (
    <div className={`card ${style.border} ${style.bg}`} data-tour="job-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.badge}`}>
            {isRental ? <Wind size={16} /> : <Wrench size={16} />}
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase">
              {isRental ? 'Rental Request' : 'Service Call'}
            </span>
            <p className="text-xs text-gray-400">{job.id}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${style.badge}`}>
          {job.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">{job.customerName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-gray-600">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Thermometer size={14} className="text-gray-400" />
          <span className="text-gray-600">{job.issue}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={14} className="text-gray-400" />
          <span className="text-gray-500">Opened {timeOpen}</span>
        </div>
      </div>

      {/* Vendor actions */}
      {isVendorView && job.status !== 'resolved' && job.status !== 'declined' && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200" data-tour="job-actions">
          {job.status === 'new' && (
            <>
              <button
                onClick={() => handleStatusChange('accepted')}
                className="btn-success text-xs py-1.5 px-3"
              >
                Accept Job
              </button>
              <button
                onClick={() => handleStatusChange('declined')}
                className="btn-danger text-xs py-1.5 px-3"
              >
                Decline
              </button>
            </>
          )}
          {job.status === 'accepted' && (
            <button
              onClick={() => handleStatusChange('in_progress')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              Mark In Progress
            </button>
          )}
          {job.status === 'in_progress' && (
            <button
              onClick={() => handleStatusChange('resolved')}
              className="btn-success text-xs py-1.5 px-3"
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function getTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
