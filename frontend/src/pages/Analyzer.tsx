import React, { useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const filters = ['7D', '30D', '90D', 'All Time']

const metrics = [
  { label: 'Win Rate', value: '62.4%' },
  { label: 'Total Trades', value: '148' },
  { label: 'Avg Profit / Trade', value: '$42.10' },
  { label: 'Largest Win', value: '$680.00' },
  { label: 'Largest Loss', value: '-$220.00' },
]

const dailyPnL = [
  { day: 'Mon', value: 120 },
  { day: 'Tue', value: -40 },
  { day: 'Wed', value: 220 },
  { day: 'Thu', value: -80 },
  { day: 'Fri', value: 140 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: -30 },
]

const winLoss = [
  { name: 'Wins', value: 92 },
  { name: 'Losses', value: 56 },
]

const volumeByDay = [
  { day: 'Mon', value: 28 },
  { day: 'Tue', value: 32 },
  { day: 'Wed', value: 45 },
  { day: 'Thu', value: 22 },
  { day: 'Fri', value: 38 },
  { day: 'Sat', value: 18 },
  { day: 'Sun', value: 12 },
]

const performanceByCategory = [
  { label: 'Politics', value: 420 },
  { label: 'Crypto', value: 310 },
  { label: 'Economics', value: 180 },
  { label: 'AI', value: 260 },
  { label: 'Sports', value: 120 },
]

const topTrades = [
  { market: 'Fed cuts rates by June', side: 'YES', entry: 0.42, exit: 0.63, returnPct: 50.0 },
  { market: 'BTC above $100k', side: 'NO', entry: 0.58, exit: 0.46, returnPct: 20.7 },
  { market: 'AI Act passes', side: 'YES', entry: 0.36, exit: 0.49, returnPct: 36.1 },
]

const tradeHistory = [
  { date: 'Apr 02', market: 'Fed cuts rates', side: 'YES', shares: 800, entry: 0.45, exit: 0.58, pnl: 104, type: 'Auto' },
  { date: 'Apr 01', market: 'BTC above $100k', side: 'NO', shares: 500, entry: 0.55, exit: 0.48, pnl: -35, type: 'Auto' },
  { date: 'Mar 30', market: 'AI Act passes', side: 'YES', shares: 640, entry: 0.33, exit: 0.47, pnl: 89, type: 'Manual' },
  { date: 'Mar 29', market: 'Team A wins', side: 'YES', shares: 300, entry: 0.52, exit: 0.59, pnl: 21, type: 'Auto' },
]

export const Analyzer: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState(filters[1])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">Analyzer</h2>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-300 border-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard title="Daily P&L">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyPnL}>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                formatter={(value: number) => [`$${value}`, 'P&L']}
              />
              <Bar dataKey="value">
                {dailyPnL.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value >= 0 ? '#34d399' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Win/Loss Split">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={winLoss} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                <Cell fill="#34d399" />
                <Cell fill="#f87171" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Trade Volume by Day">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={volumeByDay}>
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
              />
              <Bar dataKey="value" fill="#60a5fa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Category</h3>
          <div className="space-y-3">
            {performanceByCategory.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>{item.label}</span>
                  <span className="font-mono">${item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(item.value / 5, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Trades</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead className="text-slate-400">
                <tr>
                  <th className="text-left py-2">Market</th>
                  <th className="text-left py-2">Side</th>
                  <th className="text-right py-2">Entry</th>
                  <th className="text-right py-2">Exit</th>
                  <th className="text-right py-2">Return</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topTrades.map((trade) => (
                  <tr key={trade.market}>
                    <td className="py-3 text-slate-100">{trade.market}</td>
                    <td className="py-3">{trade.side}</td>
                    <td className="py-3 text-right font-mono">${trade.entry.toFixed(2)}</td>
                    <td className="py-3 text-right font-mono">${trade.exit.toFixed(2)}</td>
                    <td className="py-3 text-right">
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-300">
                        +{trade.returnPct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Trade History</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-800 text-sm text-slate-300">Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm">Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300">
            <thead className="text-slate-400">
              <tr>
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Market</th>
                <th className="text-left py-2">Side</th>
                <th className="text-right py-2">Shares</th>
                <th className="text-right py-2">Entry</th>
                <th className="text-right py-2">Exit</th>
                <th className="text-right py-2">P&L</th>
                <th className="text-left py-2">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tradeHistory.map((trade) => (
                <tr key={`${trade.date}-${trade.market}`}>
                  <td className="py-3 text-slate-400">{trade.date}</td>
                  <td className="py-3 text-slate-100">{trade.market}</td>
                  <td className="py-3">{trade.side}</td>
                  <td className="py-3 text-right font-mono">{trade.shares}</td>
                  <td className="py-3 text-right font-mono">${trade.entry.toFixed(2)}</td>
                  <td className="py-3 text-right font-mono">${trade.exit.toFixed(2)}</td>
                  <td className={`py-3 text-right font-mono ${trade.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </td>
                  <td className="py-3 text-slate-300">{trade.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
)
