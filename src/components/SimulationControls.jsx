import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Zap, RotateCcw, Thermometer, AlertTriangle } from 'lucide-react'

export default function SimulationControls() {
  const { state, dispatch } = useApp()
  const [selectedDevice, setSelectedDevice] = useState('d2')
  const [spikeTemp, setSpikeTemp] = useState(35)

  return (
    <div className="card" data-tour="simulation-controls">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Zap size={18} className="text-amber-500" />
        Simulation Controls
      </h3>

      <div className="space-y-4">
        {/* Demo Failure */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-sm font-medium text-red-800 mb-2">Demo Failure Sequence</h4>
          <p className="text-xs text-red-600 mb-3">
            Triggers a gradual temperature rise on the Server Room device, simulating an AC failure.
            The temperature will climb to 31°C, triggering warning and critical alerts.
          </p>
          <button
            onClick={() => dispatch({ type: 'TRIGGER_DEMO_FAILURE' })}
            disabled={state.demoFailureTriggered}
            className={`flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg transition-colors ${
              state.demoFailureTriggered
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <AlertTriangle size={16} />
            {state.demoFailureTriggered ? 'Failure Triggered' : 'Trigger AC Failure'}
          </button>
        </div>

        {/* Manual Temp Spike */}
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h4 className="text-sm font-medium text-amber-800 mb-2">Force Temperature Spike</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Device</label>
              <select
                value={selectedDevice}
                onChange={e => setSelectedDevice(e.target.value)}
                className="w-full text-sm border border-gray-300 rounded-lg py-1.5 px-2 bg-white"
              >
                {state.devices.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Temperature (°C)</label>
              <input
                type="number"
                value={spikeTemp}
                onChange={e => setSpikeTemp(Number(e.target.value))}
                className="w-full text-sm border border-gray-300 rounded-lg py-1.5 px-2"
                min={0}
                max={50}
              />
            </div>
          </div>
          <button
            onClick={() => dispatch({
              type: 'FORCE_TEMP_SPIKE',
              payload: { deviceId: selectedDevice, temperature: spikeTemp }
            })}
            className="flex items-center gap-2 text-sm font-medium py-2 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
          >
            <Thermometer size={16} />
            Apply Spike
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={() => dispatch({ type: 'RESET_DEMO' })}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          <RotateCcw size={16} />
          Reset Demo State
        </button>
      </div>
    </div>
  )
}
