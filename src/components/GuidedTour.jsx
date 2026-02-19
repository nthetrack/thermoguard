import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ChevronRight, ChevronLeft, X, Sparkles } from 'lucide-react'

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to ThermoGuard',
    content: 'This guided tour will walk you through the platform\'s key features. You\'ll see how IoT thermostats are monitored, how alerts are triggered, and how service dispatch works end-to-end.',
    target: '[data-tour="brand"]',
    position: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'fleet-overview',
    title: 'Fleet Dashboard',
    content: 'This is your command center. See all connected devices at a glance with real-time temperature readings, status indicators, and key metrics. Cards update every few seconds with live telemetry.',
    target: '[data-tour="stats-grid"]',
    position: 'bottom',
    route: '/dashboard',
  },
  {
    id: 'device-list',
    title: 'Device Fleet',
    content: 'Each device shows its name, location, current temperature, and status (Normal, Warning, or Critical). The temperature bar shows where the reading falls within the configured threshold range.',
    target: '[data-tour="device-d2"]',
    position: 'bottom',
    route: '/devices',
  },
  {
    id: 'threshold-config',
    title: 'Automation Rules',
    content: 'Customers can configure automated response rules. When a device breaches its threshold, the system can automatically notify managers, dispatch technicians, or order rental AC units. Toggle individual actions on or off.',
    target: '[data-tour="rule-builder"]',
    position: 'top',
    route: '/rules',
    switchUser: 'u2', // Switch to customer
  },
  {
    id: 'trigger-failure',
    title: 'Simulating a Failure',
    content: 'Now let\'s trigger a demo failure. The Server Room thermostat will gradually rise to 31°C, simulating an AC breakdown. Watch the temperature climb in real-time on the dashboard.',
    target: '[data-tour="simulation-controls"]',
    position: 'top',
    route: '/simulation',
    switchUser: 'u1', // Switch back to admin
    action: 'trigger_failure',
  },
  {
    id: 'alert-triggered',
    title: 'Alerts Triggered!',
    content: 'The system has detected the temperature breach and automatically generated alerts. Notice the severity levels - Warning at the threshold edge, Critical when significantly exceeded. SMS and email notifications were sent.',
    target: '[data-tour="alert-card"]',
    position: 'bottom',
    route: '/alerts',
    waitForData: 'alerts',
  },
  {
    id: 'notification-log',
    title: 'SMS & Email Logs',
    content: 'Every notification is logged here. In production, these would be real SMS messages via Twilio and emails via SendGrid. The log shows recipient, message content, and timestamp for full audit trail.',
    target: '[data-tour="notification-log"]',
    position: 'top',
    route: '/notifications',
  },
  {
    id: 'manager-view',
    title: 'Maintenance Manager View',
    content: 'Now let\'s switch to the Maintenance Manager\'s perspective. They receive alerts with action buttons to dispatch technicians, order rental units, or simply monitor the situation.',
    target: '[data-tour="alert-actions"]',
    position: 'bottom',
    route: '/alerts',
    switchUser: 'u4', // Switch to manager
  },
  {
    id: 'dispatch-action',
    title: 'Decision Screen',
    content: 'The manager can choose to: Dispatch a Technician for repair, Order a Rental AC unit for immediate cooling, or Monitor Only if the situation isn\'t urgent. Each action creates a tracked job.',
    target: '[data-tour="alert-actions"]',
    position: 'bottom',
    route: '/alerts',
  },
  {
    id: 'vendor-dashboard',
    title: 'Vendor Job Board',
    content: 'Switching to the technician\'s view. Service providers see incoming jobs organized by status: New (green), Pending (orange), Urgent (red), and Completed (blue).',
    target: '[data-tour="job-card"]',
    position: 'bottom',
    route: '/dashboard',
    switchUser: 'u5', // Switch to technician
  },
  {
    id: 'job-received',
    title: 'Job Received',
    content: 'Each job card shows the customer name, location, issue details, temperature reading, and time elapsed. The technician can see exactly what\'s needed before accepting.',
    target: '[data-tour="job-card"]',
    position: 'top',
    route: '/dashboard',
  },
  {
    id: 'vendor-accept',
    title: 'Accept & Resolve',
    content: 'Vendors can Accept or Decline jobs, then mark them as In Progress and finally Resolved. Each status change is timestamped for SLA tracking and reporting.',
    target: '[data-tour="job-actions"]',
    position: 'top',
    route: '/dashboard',
  },
  {
    id: 'tour-complete',
    title: 'Tour Complete!',
    content: 'You\'ve seen the full workflow: monitoring, alerting, dispatching, and resolution. Use the sidebar Quick Switch to explore different user perspectives. You can restart this tour anytime from the sidebar menu.',
    target: '[data-tour="brand"]',
    position: 'bottom',
    switchUser: 'u1', // Switch back to admin
    route: '/dashboard',
  },
]

export default function GuidedTour() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [spotlight, setSpotlight] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const tooltipRef = useRef(null)
  const stepTimeoutRef = useRef(null)

  const currentStep = tourSteps[state.tourStep]
  const totalSteps = tourSteps.length
  const progress = ((state.tourStep + 1) / totalSteps) * 100

  const updateSpotlight = useCallback(() => {
    if (!currentStep) return

    // Navigate if needed
    if (currentStep.route) {
      navigate(currentStep.route)
    }

    // Switch user if needed
    if (currentStep.switchUser) {
      dispatch({ type: 'SWITCH_USER', payload: currentStep.switchUser })
    }

    // Execute actions
    if (currentStep.action === 'trigger_failure' && !state.demoFailureTriggered) {
      dispatch({ type: 'TRIGGER_DEMO_FAILURE' })
    }

    // Find target element after a brief delay for rendering
    stepTimeoutRef.current = setTimeout(() => {
      const target = currentStep.target ? document.querySelector(currentStep.target) : null

      if (target) {
        const rect = target.getBoundingClientRect()
        const padding = 8
        setSpotlight({
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        })

        // Calculate tooltip position
        const tooltipWidth = Math.min(380, window.innerWidth - 32)
        let top, left

        if (currentStep.position === 'bottom') {
          top = rect.bottom + 16
          left = Math.max(16, Math.min(rect.left, window.innerWidth - tooltipWidth - 16))
        } else {
          top = rect.top - 16
          left = Math.max(16, Math.min(rect.left, window.innerWidth - tooltipWidth - 16))
        }

        // Ensure tooltip is visible
        if (top + 200 > window.innerHeight) {
          top = rect.top - 220
        }
        if (top < 16) {
          top = rect.bottom + 16
        }

        setTooltipPos({ top, left, width: tooltipWidth })
      } else {
        // No target found, center the tooltip
        setSpotlight(null)
        setTooltipPos({
          top: '50%',
          left: '50%',
          width: Math.min(400, window.innerWidth - 32),
          transform: 'translate(-50%, -50%)',
        })
      }
    }, 500)
  }, [currentStep, navigate, dispatch, state.demoFailureTriggered])

  useEffect(() => {
    if (!state.tourActive) return
    updateSpotlight()

    const handleResize = () => updateSpotlight()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (stepTimeoutRef.current) clearTimeout(stepTimeoutRef.current)
    }
  }, [state.tourActive, state.tourStep, updateSpotlight])

  if (!state.tourActive || !currentStep) return null

  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay">
        {spotlight && (
          <div
            className="tour-spotlight"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
            }}
          />
        )}
        {!spotlight && (
          <div className="fixed inset-0 bg-black/60 z-[9998]" />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="tour-tooltip"
        style={tooltipPos}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" style={{ width: tooltipPos.width }}>
          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-5">
            {/* Step indicator */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brand-500" />
                <span className="text-xs font-medium text-brand-600">
                  Step {state.tourStep + 1} of {totalSteps}
                </span>
              </div>
              <button
                onClick={() => dispatch({ type: 'END_TOUR' })}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">{currentStep.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{currentStep.content}</p>

            {/* Wait indicator */}
            {currentStep.waitForData === 'alerts' && state.alerts.length === 0 && (
              <div className="mt-3 p-2 bg-amber-50 rounded-lg text-xs text-amber-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Waiting for alerts to be triggered...
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  if (state.tourStep > 0) dispatch({ type: 'PREV_TOUR_STEP' })
                }}
                disabled={state.tourStep === 0}
                className={`flex items-center gap-1 text-sm font-medium py-2 px-3 rounded-lg transition-colors ${
                  state.tourStep === 0
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <div className="flex gap-1">
                {tourSteps.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === state.tourStep
                        ? 'bg-brand-500'
                        : i < state.tourStep
                        ? 'bg-brand-200'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              {state.tourStep < totalSteps - 1 ? (
                <button
                  onClick={() => dispatch({ type: 'NEXT_TOUR_STEP' })}
                  className="flex items-center gap-1 text-sm font-medium py-2 px-4 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    dispatch({ type: 'END_TOUR' })
                    dispatch({ type: 'SWITCH_USER', payload: 'u1' })
                    navigate('/dashboard')
                  }}
                  className="flex items-center gap-1 text-sm font-medium py-2 px-4 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Finish Tour
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Welcome modal shown on first admin login
export function WelcomeModal({ onStartTour, onSkip }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Welcome to ThermoGuard</h2>
          <p className="text-sm text-brand-100">
            IoT HVAC Monitoring & Emergency Dispatch Platform
          </p>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Take a guided tour to see the complete workflow: from real-time monitoring
            to alert dispatch and vendor resolution. The tour simulates a live AC failure
            scenario across multiple user roles.
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
              <span className="text-gray-700">Watch live temperature monitoring</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
              <span className="text-gray-700">See alerts trigger from device failure</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
              <span className="text-gray-700">Dispatch technicians & resolve incidents</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onStartTour}
              className="flex-1 btn-primary py-3 text-center"
            >
              Start Tour
            </button>
            <button
              onClick={onSkip}
              className="btn-secondary py-3 px-4"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
