import React from 'react'

export const Markets: React.FC = () => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-xl font-semibold text-white">Markets</h2>
      <p className="mt-2 text-sm text-slate-400">
        Market discovery UI is coming next. This tab will list live Polymarket markets with filters
        and one-click streaming into the Analyzer.
      </p>
    </div>
  )
}
