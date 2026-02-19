import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'

export default function TemperatureChart({ history, thresholdMin, thresholdMax, height = 200 }) {
  const data = history.map((entry, i) => ({
    time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temperature: Number(entry.temperature.toFixed(1)),
    index: i,
  }))

  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200" style={{ height }}>
        <p className="text-sm text-gray-400">Collecting data...</p>
      </div>
    )
  }

  const minTemp = Math.min(thresholdMin - 2, ...data.map(d => d.temperature))
  const maxTemp = Math.max(thresholdMax + 2, ...data.map(d => d.temperature))

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            domain={[minTemp, maxTemp]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={v => `${v}°`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`${value}°C`, 'Temperature']}
          />
          <ReferenceLine
            y={thresholdMax}
            stroke="#ef4444"
            strokeDasharray="5 5"
            label={{ value: `Max ${thresholdMax}°C`, position: 'right', fontSize: 10, fill: '#ef4444' }}
          />
          <ReferenceLine
            y={thresholdMin}
            stroke="#3b82f6"
            strokeDasharray="5 5"
            label={{ value: `Min ${thresholdMin}°C`, position: 'right', fontSize: 10, fill: '#3b82f6' }}
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#tempGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function MultiDeviceChart({ data, height = 300 }) {
  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

  const deviceIds = [...new Set(data.map(d => d.deviceId))]

  // Reshape data for recharts: group by hour
  const grouped = {}
  data.forEach(entry => {
    const key = entry.hour
    if (!grouped[key]) grouped[key] = { time: key }
    grouped[key][entry.deviceId] = Number(entry.temperature.toFixed(1))
  })
  const chartData = Object.values(grouped)

  const deviceNames = {
    d1: 'Ward A',
    d2: 'Server Room',
    d3: 'Common Area',
    d4: 'Storefront',
    d5: 'Chocolate Storage',
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            tickFormatter={v => `${v}°`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value, name) => [`${value}°C`, deviceNames[name] || name]}
          />
          {deviceIds.map((deviceId, i) => (
            <Line
              key={deviceId}
              type="monotone"
              dataKey={deviceId}
              name={deviceId}
              stroke={colors[i % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
