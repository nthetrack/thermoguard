import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import { ROLES } from './data/users'

import Layout from './components/Layout'
import GuidedTour from './components/GuidedTour'
import { WelcomeModal } from './components/GuidedTour'

import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import VendorDashboard from './pages/VendorDashboard'
import DeviceFleetPage from './pages/DeviceFleetPage'
import AlertsPage from './pages/AlertsPage'
import JobsPage from './pages/JobsPage'
import NotificationsPage from './pages/NotificationsPage'
import RulesPage from './pages/RulesPage'
import ReportsPage from './pages/ReportsPage'
import CustomersPage from './pages/CustomersPage'
import VendorsPage from './pages/VendorsPage'
import SimulationPage from './pages/SimulationPage'

function DashboardRouter() {
  const { state } = useApp()
  const { currentUser } = state

  if (!currentUser) return <Navigate to="/login" replace />

  switch (currentUser.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />
    case ROLES.CUSTOMER:
      return <CustomerDashboard />
    case ROLES.MANAGER:
      return <ManagerDashboard />
    case ROLES.TECHNICIAN:
    case ROLES.RENTAL:
      return <VendorDashboard />
    default:
      return <AdminDashboard />
  }
}

function ProtectedRoute({ children }) {
  const { state } = useApp()
  if (!state.isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [showWelcome, setShowWelcome] = useState(false)

  // Show welcome modal on first admin login
  useEffect(() => {
    if (
      state.isAuthenticated &&
      state.currentUser?.role === ROLES.ADMIN &&
      !state.tourCompleted &&
      !state.tourActive
    ) {
      const timer = setTimeout(() => setShowWelcome(true), 500)
      return () => clearTimeout(timer)
    }
  }, [state.isAuthenticated, state.currentUser?.role])

  return (
    <>
      <Routes>
        <Route path="/login" element={
          state.isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />

        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<DashboardRouter />} />
                <Route path="/devices" element={<DeviceFleetPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/vendors" element={<VendorsPage />} />
                <Route path="/simulation" element={<SimulationPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>

      {/* Guided Tour */}
      {state.tourActive && <GuidedTour />}

      {/* Welcome Modal */}
      {showWelcome && !state.tourActive && !state.tourCompleted && (
        <WelcomeModal
          onStartTour={() => {
            setShowWelcome(false)
            dispatch({ type: 'START_TOUR' })
          }}
          onSkip={() => {
            setShowWelcome(false)
            dispatch({ type: 'END_TOUR' })
          }}
        />
      )}
    </>
  )
}
