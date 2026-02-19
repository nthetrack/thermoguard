import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { useApp } from '../context/AppContext'

export default function Layout({ children }) {
  const { state, dispatch } = useApp()

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => dispatch({ type: 'CLOSE_SIDEBAR' })}
        />
      )}
    </div>
  )
}
