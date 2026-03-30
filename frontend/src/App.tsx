// Main App with routing

import React, { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Analyzer } from './pages/Analyzer'
import './index.css'

type Page = 'dashboard' | 'analyzer'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Polymarket Trading</h1>
            <nav className="flex gap-2">
              <NavButton
                label="Dashboard"
                active={currentPage === 'dashboard'}
                onClick={() => setCurrentPage('dashboard')}
              />
              <NavButton
                label="Analyzer"
                active={currentPage === 'analyzer'}
                onClick={() => setCurrentPage('analyzer')}
              />
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'analyzer' && <Analyzer />}
      </main>
    </div>
  )
}

interface NavButtonProps {
  label: string
  active: boolean
  onClick: () => void
}

const NavButton: React.FC<NavButtonProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded font-medium transition ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`}
  >
    {label}
  </button>
)

export default App
