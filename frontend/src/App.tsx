// Main App with routing

import React, { useMemo, useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Analyzer } from './pages/Analyzer'
import { Markets } from './pages/Markets'
import { TestLab } from './pages/TestLab'
import './index.css'

type Page = 'dashboard' | 'analyzer' | 'markets' | 'test'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const walletBalance = useMemo(() => '$102,450.34', [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="bg-slate-950/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-200">PB</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">PolyBot</p>
              <h1 className="text-xl font-semibold text-white">Auto Trading Console</h1>
            </div>
          </div>

          <nav className="flex items-center gap-2">
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
            <NavButton
              label="Markets"
              active={currentPage === 'markets'}
              onClick={() => setCurrentPage('markets')}
            />
            <NavButton
              label="Test Lab"
              active={currentPage === 'test'}
              onClick={() => setCurrentPage('test')}
            />
          </nav>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2">
              <p className="text-xs text-slate-400">Wallet Balance</p>
              <p className="text-sm font-semibold text-slate-100">{walletBalance}</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500">
              Add Funds
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'analyzer' && <Analyzer />}
        {currentPage === 'markets' && <Markets />}
        {currentPage === 'test' && <TestLab />}
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
    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
    }`}
  >
    {label}
  </button>
)

export default App
