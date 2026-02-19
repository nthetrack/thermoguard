import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react'
import { defaultUsers, defaultCustomers, defaultVendors } from '../data/users'
import { defaultDevices } from '../data/devices'
import { defaultAlerts, defaultJobs, defaultNotificationLogs, defaultAutomationRules } from '../data/seeds'

const AppContext = createContext(null)

const initialState = {
  // Auth
  currentUser: null,
  isAuthenticated: false,

  // Data
  users: defaultUsers,
  customers: defaultCustomers,
  vendors: defaultVendors,
  devices: defaultDevices.map(d => ({ ...d, history: [] })),
  alerts: defaultAlerts,
  jobs: defaultJobs,
  notificationLogs: defaultNotificationLogs,
  automationRules: defaultAutomationRules,

  // UI
  sidebarOpen: false,
  tourActive: false,
  tourStep: 0,
  tourCompleted: false,
  simulationRunning: false,
  demoFailureTriggered: false,
  demoFailureInProgress: false,

  // Activity feed
  activityFeed: [
    { id: 'a1', type: 'system', message: 'Platform initialized', timestamp: Date.now() - 3600000 },
    { id: 'a2', type: 'device', message: 'All devices reporting normal', timestamp: Date.now() - 1800000 },
    { id: 'a3', type: 'system', message: 'Daily health check completed', timestamp: Date.now() - 900000 },
  ],
}

let idCounter = 100

function generateId(prefix) {
  idCounter++
  return `${prefix}${idCounter}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const user = state.users.find(
        u => u.email === action.payload.email && u.password === action.payload.password
      )
      if (!user) return { ...state }
      return {
        ...state,
        currentUser: user,
        isAuthenticated: true,
        simulationRunning: true,
      }
    }

    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
        isAuthenticated: false,
        simulationRunning: false,
        sidebarOpen: false,
        tourActive: false,
      }

    case 'SWITCH_USER': {
      const user = state.users.find(u => u.id === action.payload)
      if (!user) return state
      return { ...state, currentUser: user }
    }

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen }

    case 'CLOSE_SIDEBAR':
      return { ...state, sidebarOpen: false }

    case 'UPDATE_DEVICE_TEMP': {
      const { deviceId, temperature, status } = action.payload
      return {
        ...state,
        devices: state.devices.map(d => {
          if (d.id !== deviceId) return d
          const historyEntry = { temperature: d.temperature, timestamp: Date.now() }
          const history = [...d.history, historyEntry].slice(-60)
          return { ...d, temperature, status, lastUpdated: Date.now(), history }
        }),
      }
    }

    case 'UPDATE_DEVICE_FIELD': {
      const { deviceId, field, value } = action.payload
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === deviceId ? { ...d, [field]: value } : d
        ),
      }
    }

    case 'ADD_ALERT': {
      const alert = { ...action.payload, id: generateId('alert-') }
      return {
        ...state,
        alerts: [alert, ...state.alerts],
        activityFeed: [
          {
            id: generateId('act-'),
            type: 'alert',
            message: `Alert: ${alert.deviceName} - ${alert.severity} (${alert.temperature.toFixed(1)}°C)`,
            timestamp: Date.now(),
          },
          ...state.activityFeed,
        ].slice(0, 50),
      }
    }

    case 'ACKNOWLEDGE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(a =>
          a.id === action.payload ? { ...a, acknowledged: true } : a
        ),
      }

    case 'ADD_JOB': {
      const job = { ...action.payload, id: generateId('job-') }
      return {
        ...state,
        jobs: [job, ...state.jobs],
        activityFeed: [
          {
            id: generateId('act-'),
            type: 'job',
            message: `Job created: ${job.type === 'rental' ? 'Rental unit ordered' : 'Technician dispatched'} for ${job.customerName}`,
            timestamp: Date.now(),
          },
          ...state.activityFeed,
        ].slice(0, 50),
      }
    }

    case 'UPDATE_JOB_STATUS': {
      const { jobId, status } = action.payload
      const now = Date.now()
      return {
        ...state,
        jobs: state.jobs.map(j => {
          if (j.id !== jobId) return j
          const updates = { status }
          if (status === 'accepted') updates.acceptedAt = now
          if (status === 'in_progress') updates.startedAt = now
          if (status === 'resolved') updates.resolvedAt = now
          return { ...j, ...updates }
        }),
        activityFeed: [
          {
            id: generateId('act-'),
            type: 'job',
            message: `Job ${jobId} status updated to ${status}`,
            timestamp: now,
          },
          ...state.activityFeed,
        ].slice(0, 50),
      }
    }

    case 'ADD_NOTIFICATION': {
      const log = { ...action.payload, id: generateId('notif-'), timestamp: Date.now() }
      return {
        ...state,
        notificationLogs: [log, ...state.notificationLogs].slice(0, 100),
      }
    }

    case 'UPDATE_RULE': {
      return {
        ...state,
        automationRules: state.automationRules.map(r =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      }
    }

    case 'TOGGLE_RULE': {
      return {
        ...state,
        automationRules: state.automationRules.map(r =>
          r.id === action.payload ? { ...r, enabled: !r.enabled } : r
        ),
      }
    }

    case 'START_TOUR':
      return { ...state, tourActive: true, tourStep: 0 }

    case 'NEXT_TOUR_STEP':
      return { ...state, tourStep: state.tourStep + 1 }

    case 'PREV_TOUR_STEP':
      return { ...state, tourStep: Math.max(0, state.tourStep - 1) }

    case 'END_TOUR':
      return { ...state, tourActive: false, tourStep: 0, tourCompleted: true }

    case 'TRIGGER_DEMO_FAILURE':
      return { ...state, demoFailureTriggered: true, demoFailureInProgress: true }

    case 'DEMO_FAILURE_COMPLETE':
      return { ...state, demoFailureInProgress: false }

    case 'FORCE_TEMP_SPIKE': {
      const { deviceId, temperature } = action.payload
      const device = state.devices.find(d => d.id === deviceId)
      if (!device) return state
      const status = temperature > device.thresholdMax ? 'critical' : temperature < device.thresholdMin ? 'critical' : 'normal'
      return {
        ...state,
        devices: state.devices.map(d =>
          d.id === deviceId
            ? { ...d, temperature, status, lastUpdated: Date.now() }
            : d
        ),
      }
    }

    case 'RESET_DEMO': {
      return {
        ...initialState,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        simulationRunning: true,
        devices: defaultDevices.map(d => ({ ...d, history: [] })),
      }
    }

    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const simulationRef = useRef(null)
  const failureStepRef = useRef(0)

  // Simulation engine
  useEffect(() => {
    if (!state.simulationRunning || !state.isAuthenticated) {
      if (simulationRef.current) {
        clearInterval(simulationRef.current)
        simulationRef.current = null
      }
      return
    }

    simulationRef.current = setInterval(() => {
      state.devices.forEach(device => {
        // Demo failure device
        if (device.demoFailure && state.demoFailureTriggered && state.demoFailureInProgress) {
          failureStepRef.current++
          const step = failureStepRef.current
          let newTemp
          if (step <= 8) {
            newTemp = device.temperature + 1.2 + Math.random() * 0.5
          } else {
            newTemp = 31 + Math.random() * 0.5
            dispatch({ type: 'DEMO_FAILURE_COMPLETE' })
          }

          let status = 'normal'
          if (newTemp > device.thresholdMax) status = 'critical'
          else if (newTemp > device.thresholdMax - 2) status = 'warning'

          dispatch({
            type: 'UPDATE_DEVICE_TEMP',
            payload: { deviceId: device.id, temperature: newTemp, status },
          })

          // Trigger alerts at warning and critical
          if (status === 'warning' && device.status === 'normal') {
            triggerAlert(device, newTemp, 'warning', state, dispatch)
          } else if (status === 'critical' && device.status !== 'critical') {
            triggerAlert(device, newTemp, 'critical', state, dispatch)
          }
          return
        }

        // Normal fluctuation for other devices
        const fluctuation = (Math.random() - 0.5) * 0.4
        let newTemp = device.temperature + fluctuation
        // Keep within reasonable bounds
        const midpoint = (device.thresholdMin + device.thresholdMax) / 2
        if (Math.abs(newTemp - midpoint) > (device.thresholdMax - device.thresholdMin) * 0.6) {
          newTemp = midpoint + (Math.random() - 0.5) * 2
        }

        let status = 'normal'
        if (newTemp > device.thresholdMax || newTemp < device.thresholdMin) {
          status = 'critical'
        } else if (newTemp > device.thresholdMax - 2 || newTemp < device.thresholdMin + 1) {
          status = 'warning'
        }

        dispatch({
          type: 'UPDATE_DEVICE_TEMP',
          payload: { deviceId: device.id, temperature: newTemp, status },
        })
      })
    }, 3000)

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current)
        simulationRef.current = null
      }
    }
  }, [state.simulationRunning, state.isAuthenticated, state.demoFailureTriggered, state.demoFailureInProgress])

  const login = useCallback((email, password) => {
    const user = state.users.find(u => u.email === email && u.password === password)
    if (user) {
      dispatch({ type: 'LOGIN', payload: { email, password } })
      return { success: true, user }
    }
    return { success: false }
  }, [state.users])

  const value = {
    state,
    dispatch,
    login,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

function triggerAlert(device, temperature, severity, state, dispatch) {
  const customer = state.customers.find(c => c.id === device.customerId)
  const customerName = customer ? customer.name : 'Unknown'

  dispatch({
    type: 'ADD_ALERT',
    payload: {
      deviceId: device.id,
      deviceName: device.name,
      location: device.location,
      customerId: device.customerId,
      customerName,
      severity,
      temperature,
      timestamp: Date.now(),
      acknowledged: false,
      notifiedUsers: [],
    },
  })

  // SMS notification log
  dispatch({
    type: 'ADD_NOTIFICATION',
    payload: {
      type: 'sms',
      to: customer?.contactPhone || '+61 4 0000 0000',
      recipientName: customer?.contactName || 'Unknown',
      message: `[ThermoGuard] ALERT: ${device.name} at ${device.location} reading ${temperature.toFixed(1)}°C (threshold: ${device.thresholdMin}-${device.thresholdMax}°C). Severity: ${severity.toUpperCase()}`,
    },
  })

  // Email notification log
  dispatch({
    type: 'ADD_NOTIFICATION',
    payload: {
      type: 'email',
      to: customer?.contactEmail || 'unknown@demo.com',
      recipientName: customer?.contactName || 'Unknown',
      subject: `${severity === 'critical' ? 'CRITICAL' : 'WARNING'}: Temperature Alert - ${device.name}`,
      message: `Device: ${device.name}\nLocation: ${device.location}\nTemperature: ${temperature.toFixed(1)}°C\nThreshold: ${device.thresholdMin}°C - ${device.thresholdMax}°C\nSeverity: ${severity.toUpperCase()}\n\nPlease take immediate action.`,
    },
  })

  // Check automation rules
  const rules = state.automationRules.filter(
    r => r.deviceId === device.id && r.enabled
  )

  rules.forEach(rule => {
    const shouldTrigger =
      (rule.condition === 'temp_above' && temperature > rule.conditionValue) ||
      (rule.condition === 'temp_below' && temperature < rule.conditionValue)

    if (!shouldTrigger) return

    rule.actions.forEach(action => {
      if (!action.enabled) return

      if (action.type === 'notify_manager') {
        const manager = state.users.find(u => u.role === 'manager' && u.customerId === device.customerId)
        if (manager) {
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              type: 'email',
              to: manager.email,
              recipientName: manager.name,
              subject: `Action Required: ${device.name} - ${severity} alert`,
              message: `Automation triggered. Device ${device.name} at ${temperature.toFixed(1)}°C. Please review and take action.`,
            },
          })
        }
      }

      if (action.type === 'dispatch_technician') {
        dispatch({
          type: 'ADD_JOB',
          payload: {
            alertId: null,
            vendorId: 'v1',
            vendorName: 'ProCool HVAC Services',
            customerId: device.customerId,
            customerName,
            type: 'repair',
            status: 'new',
            location: device.location,
            deviceName: device.name,
            issue: `Temperature ${severity}: ${temperature.toFixed(1)}°C (threshold: ${device.thresholdMin}-${device.thresholdMax}°C)`,
            temperature,
            createdAt: Date.now(),
          },
        })
      }

      if (action.type === 'order_rental') {
        dispatch({
          type: 'ADD_JOB',
          payload: {
            alertId: null,
            vendorId: 'v2',
            vendorName: 'CoolAir Rentals',
            customerId: device.customerId,
            customerName,
            type: 'rental',
            status: 'new',
            location: device.location,
            deviceName: device.name,
            issue: `Temporary AC required. Temperature ${severity}: ${temperature.toFixed(1)}°C`,
            temperature,
            createdAt: Date.now(),
          },
        })
      }
    })
  })
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export default AppContext
