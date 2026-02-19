import React from 'react'
import { Mail, MessageSquare, Clock } from 'lucide-react'

export default function NotificationLog({ logs }) {
  if (logs.length === 0) {
    return (
      <div className="card text-center py-12">
        <Mail size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500">No notifications yet</p>
        <p className="text-sm text-gray-400 mt-1">Alerts will appear here when devices breach thresholds</p>
      </div>
    )
  }

  return (
    <div className="space-y-2" data-tour="notification-log">
      {logs.map(log => (
        <div
          key={log.id}
          className={`card py-3 px-4 flex items-start gap-3 ${
            log.type === 'sms' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            log.type === 'sms' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {log.type === 'sms' ? (
              <MessageSquare size={16} className="text-green-600" />
            ) : (
              <Mail size={16} className="text-blue-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
                log.type === 'sms' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {log.type}
              </span>
              <span className="text-xs text-gray-500">To: {log.recipientName}</span>
              <span className="text-xs text-gray-400">({log.to})</span>
            </div>
            {log.subject && (
              <p className="text-sm font-medium text-gray-900 mb-0.5">{log.subject}</p>
            )}
            <p className="text-xs text-gray-600 whitespace-pre-wrap">{log.message}</p>
            <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1.5">
              <Clock size={10} />
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
