import React from 'react'
import { STATUS_CONFIG } from '../data/devices'

export default function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.offline

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.bgColor} ${config.textColor} border ${config.borderColor}
      ${sizeClasses[size]}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.color} ${status === 'critical' ? 'animate-pulse' : ''}`} />
      {config.label}
    </span>
  )
}
