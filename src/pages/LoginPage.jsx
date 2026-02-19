import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Thermometer, Eye, EyeOff, ChevronDown } from 'lucide-react'

const quickLogins = [
  { email: 'admin@demo.com', label: 'Admin', role: 'Platform Administrator' },
  { email: 'nursinghome@demo.com', label: 'Customer (Nursing Home)', role: 'Customer' },
  { email: '7eleven@demo.com', label: 'Customer (7-Eleven)', role: 'Customer' },
  { email: 'manager.nh@demo.com', label: 'Maintenance Manager', role: 'Manager' },
  { email: 'tech1@hvacservices.com', label: 'HVAC Technician', role: 'Technician' },
  { email: 'rentals@coolair.com', label: 'Rental Provider', role: 'Rental Vendor' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showQuickLogin, setShowQuickLogin] = useState(false)
  const { login } = useApp()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError('Invalid email or password')
    }
  }

  const handleQuickLogin = (quickEmail) => {
    setEmail(quickEmail)
    setPassword('password123')
    setShowQuickLogin(false)
    const result = login(quickEmail, 'password123')
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-brand-950 to-gray-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand-500 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-brand-600 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 mb-4 shadow-lg shadow-brand-500/30">
            <Thermometer size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">ThermoGuard</h1>
          <p className="text-brand-200 text-sm">IoT HVAC Monitoring & Emergency Dispatch</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-sm text-gray-500 mb-6">Demo platform — use any test account below</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none text-sm pr-10"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-3 text-center font-semibold"
            >
              Sign In
            </button>
          </form>

          {/* Quick login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowQuickLogin(!showQuickLogin)}
              className="w-full flex items-center justify-between text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <span className="font-medium">Quick Login — Demo Accounts</span>
              <ChevronDown size={16} className={`transition-transform ${showQuickLogin ? 'rotate-180' : ''}`} />
            </button>

            {showQuickLogin && (
              <div className="mt-3 space-y-1.5">
                {quickLogins.map(q => (
                  <button
                    key={q.email}
                    onClick={() => handleQuickLogin(q.email)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{q.label}</p>
                      <p className="text-xs text-gray-400">{q.email}</p>
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{q.role}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Prototype Demo &bull; All data is simulated
        </p>
      </div>
    </div>
  )
}
