import React from 'react'
import SimulationControls from '../components/SimulationControls'
import { useApp } from '../context/AppContext'
import DeviceCard from '../components/DeviceCard'

export default function SimulationPage() {
  const { state } = useApp()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Simulation Controls</h1>
        <p className="text-sm text-gray-500 mt-1">
          Control the demo environment — trigger failures, force temperature spikes, and reset state
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimulationControls />

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Real-Time Device Status</h3>
          <div className="space-y-3">
            {state.devices.map(device => (
              <DeviceCard key={device.id} device={device} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
