export const defaultAlerts = []

export const defaultJobs = []

export const defaultNotificationLogs = []

export const defaultAutomationRules = [
  {
    id: 'r1',
    customerId: 'c1',
    name: 'Critical Heat Alert - Ward A',
    deviceId: 'd1',
    condition: 'temp_above',
    conditionValue: 25,
    actions: [
      { type: 'notify_manager', enabled: true },
      { type: 'dispatch_technician', enabled: true },
      { type: 'order_rental', enabled: false },
    ],
    enabled: true,
  },
  {
    id: 'r2',
    customerId: 'c1',
    name: 'Server Room Overheat',
    deviceId: 'd2',
    condition: 'temp_above',
    conditionValue: 24,
    actions: [
      { type: 'notify_manager', enabled: true },
      { type: 'dispatch_technician', enabled: true },
      { type: 'order_rental', enabled: true },
    ],
    enabled: true,
  },
  {
    id: 'r3',
    customerId: 'c2',
    name: 'Store Too Hot',
    deviceId: 'd4',
    condition: 'temp_above',
    conditionValue: 26,
    actions: [
      { type: 'notify_manager', enabled: false },
      { type: 'dispatch_technician', enabled: true },
      { type: 'order_rental', enabled: false },
    ],
    enabled: true,
  },
  {
    id: 'r4',
    customerId: 'c2',
    name: 'Chocolate Storage Alert',
    deviceId: 'd5',
    condition: 'temp_above',
    conditionValue: 20,
    actions: [
      { type: 'notify_manager', enabled: true },
      { type: 'dispatch_technician', enabled: true },
      { type: 'order_rental', enabled: false },
    ],
    enabled: true,
  },
]

// Generate dummy historical data for reports
export function generateHistoricalData() {
  const now = Date.now()
  const data = []
  const devices = ['d1', 'd2', 'd3', 'd4', 'd5']

  for (let i = 23; i >= 0; i--) {
    const timestamp = now - i * 3600000 // hourly intervals
    devices.forEach(deviceId => {
      let baseTemp
      switch (deviceId) {
        case 'd1': baseTemp = 22; break
        case 'd2': baseTemp = 20; break
        case 'd3': baseTemp = 23; break
        case 'd4': baseTemp = 22; break
        case 'd5': baseTemp = 17; break
        default: baseTemp = 22
      }
      data.push({
        deviceId,
        temperature: baseTemp + (Math.random() - 0.5) * 3,
        timestamp,
        hour: new Date(timestamp).getHours() + ':00',
      })
    })
  }
  return data
}

export function generateIncidentHistory() {
  const now = Date.now()
  return [
    {
      id: 'hist-1',
      deviceName: 'Ward A Thermostat',
      customer: 'Sunrise Nursing Home',
      severity: 'warning',
      temperature: 26.1,
      timestamp: now - 86400000 * 3,
      resolvedAt: now - 86400000 * 3 + 7200000,
      responseTime: '45 min',
      vendor: 'ProCool HVAC Services',
    },
    {
      id: 'hist-2',
      deviceName: 'Chocolate Storage',
      customer: '7-Eleven Franchise Group',
      severity: 'critical',
      temperature: 23.4,
      timestamp: now - 86400000 * 7,
      resolvedAt: now - 86400000 * 7 + 10800000,
      responseTime: '1 hr 15 min',
      vendor: 'ProCool HVAC Services',
    },
    {
      id: 'hist-3',
      deviceName: 'Storefront Climate',
      customer: '7-Eleven Franchise Group',
      severity: 'warning',
      temperature: 27.0,
      timestamp: now - 86400000 * 14,
      resolvedAt: now - 86400000 * 14 + 5400000,
      responseTime: '30 min',
      vendor: 'CoolAir Rentals',
    },
  ]
}
