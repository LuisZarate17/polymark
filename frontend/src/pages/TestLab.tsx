import React from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const testMetrics = [
  { label: 'Paper Balance', value: '$25,000' },
  { label: 'Active Tests', value: '3' },
  { label: 'Win Rate', value: '58.6%' },
  { label: 'Auto Buys', value: '42' },
  { label: 'Auto Sells', value: '37' },
]

const testPnL = [
  { day: 'Mon', value: 120 },
  { day: 'Tue', value: -60 },
  { day: 'Wed', value: 90 },
  { day: 'Thu', value: 160 },
  { day: 'Fri', value: -40 },
  { day: 'Sat', value: 70 },
  { day: 'Sun', value: 110 },
]

const testPositions = [
  {
    market: 'Will the Fed cut rates by June 2026?',
    side: 'YES',
    shares: 500,
    entry: 0.46,
    current: 0.52,
    pnl: 30,
    autoTrigger: 0.54,
  },
  {
    market: 'BTC above $100k by Dec 31, 2026?',
    side: 'NO',
    shares: 320,
    entry: 0.58,
    current: 0.55,
    pnl: -9.6,
    autoTrigger: 0.51,
  },
]

const testEvents = [
  { time: '4:18 PM', action: 'Auto-buy', market: 'Fed rates market', result: '+$24.00' },
  { time: '3:44 PM', action: 'Auto-sell', market: 'BTC NO market', result: '-$9.60' },
  { time: '2:05 PM', action: 'Stop-loss', market: 'AI Act market', result: '-$18.00' },
]

const testSummary = [
  { label: 'Total Paper P&L', value: '+$1,240' },
  { label: 'Avg Profit / Trade', value: '$29.40' },
  { label: 'Largest Win', value: '$180.00' },
  { label: 'Largest Loss', value: '-$65.00' },
]

export const TestLab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Test Lab</h2>
          <p className="text-sm text-slate-400">Paper trading with live markets and simulated fills.</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">
          Start New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {testMetrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Tester P&L (7D)</h3>
            <span className="text-xs text-slate-500">Paper trades</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testPnL}>
                <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                  formatter={(value: number) => [`$${value}`, 'P&L']}
                />
                <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Test Summary</h3>
          <div className="space-y-3">
            {testSummary.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{item.label}</span>
                <span className="text-slate-100 font-mono">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Recent Test Events</h4>
            <div className="space-y-2">
              {testEvents.map((event) => (
                <div key={`${event.time}-${event.market}`} className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{event.time}</span>
                    <span className="text-slate-200">{event.result}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-200">
                    {event.action} · {event.market}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Paper Positions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2">Market</th>
                <th className="text-left py-2">Side</th>
                <th className="text-right py-2">Shares</th>
                <th className="text-right py-2">Entry</th>
                <th className="text-right py-2">Current</th>
                <th className="text-right py-2">P&L</th>
                <th className="text-right py-2">Auto-trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {testPositions.map((pos) => (
                <tr key={pos.market}>
                  <td className="py-3 text-slate-100">{pos.market}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pos.side === 'YES' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                      {pos.side}
                    </span>
                  </td>
                  <td className="py-3 text-right font-mono">{pos.shares}</td>
                  <td className="py-3 text-right font-mono">${pos.entry.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono">${pos.current.toFixed(2)}</td>
                  <td className={`py-3 text-right font-mono ${pos.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-mono">${pos.autoTrigger.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
