import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import NotificationLog from '../components/NotificationLog'
import { Bell, Mail, MessageSquare } from 'lucide-react'

export default function NotificationsPage() {
  const { state } = useApp()
  const [filter, setFilter] = useState('all')

  let logs = state.notificationLogs
  if (filter === 'sms') logs = logs.filter(l => l.type === 'sms')
  if (filter === 'email') logs = logs.filter(l => l.type === 'email')

  const smsCount = state.notificationLogs.filter(l => l.type === 'sms').length
  const emailCount = state.notificationLogs.filter(l => l.type === 'email').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          Simulated SMS and email notifications
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-brand-500" />
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold">{state.notificationLogs.length}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-green-500" />
            <span className="text-xs text-gray-500">SMS</span>
          </div>
          <p className="text-2xl font-bold">{smsCount}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2">
            <Mail size={16} className="text-blue-500" />
            <span className="text-xs text-gray-500">Email</span>
          </div>
          <p className="text-2xl font-bold">{emailCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'sms', 'email'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors uppercase ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <NotificationLog logs={logs} />
    </div>
  )
}
