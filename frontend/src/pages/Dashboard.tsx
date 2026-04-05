import React from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const portfolioSeries = [
  { day: 'Mar 06', value: 98000 },
  { day: 'Mar 10', value: 99500 },
  { day: 'Mar 14', value: 100200 },
  { day: 'Mar 18', value: 101450 },
  { day: 'Mar 22', value: 101200 },
  { day: 'Mar 26', value: 102300 },
  { day: 'Mar 30', value: 102450 },
  { day: 'Apr 03', value: 103100 },
]

const positions = [
  {
    market: 'Will the Fed cut rates by June 2026?',
    side: 'YES',
    shares: 1400,
    entry: 0.48,
    current: 0.58,
    pnl: 140,
    trigger: 0.61,
  },
  {
    market: 'BTC above $100k by Dec 31, 2026?',
    side: 'NO',
    shares: 950,
    entry: 0.55,
    current: 0.52,
    pnl: -28.5,
    trigger: 0.49,
  },
  {
    market: 'Team A wins championship?',
    side: 'YES',
    shares: 600,
    entry: 0.62,
    current: 0.66,
    pnl: 24,
    trigger: 0.68,
  },
]

const activity = [
  { time: '4:22 PM', text: 'Auto-buy executed on Fed rates market', type: 'buy' },
  { time: '3:55 PM', text: 'Stop-loss triggered on BTC NO position', type: 'stop' },
  { time: '2:10 PM', text: 'Manual sell on AI regulation market', type: 'manual' },
  { time: '1:32 PM', text: 'Auto-sell executed on sports market', type: 'sell' },
]

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard label="Total P&L" value="+$2,450" trend="up" />
            <MetricCard label="Today's P&L" value="+$320" trend="up" />
            <MetricCard label="Open Positions" value="3" trend="neutral" />
            <MetricCard label="Auto-trades Today" value="7" trend="neutral" />
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Portfolio Value (30D)</h2>
              <span className="text-xs text-slate-500">Last updated 2m ago</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioSeries} margin={{ left: 8, right: 8 }}>
                  <defs>
                    <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0f172a" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8 }}
                    labelStyle={{ color: '#cbd5f5' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2} fill="url(#portfolioFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Open Positions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-300">
                <thead className="bg-slate-800 text-slate-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Market</th>
                    <th className="px-4 py-3 text-left">Side</th>
                    <th className="px-4 py-3 text-right">Shares</th>
                    <th className="px-4 py-3 text-right">Entry</th>
                    <th className="px-4 py-3 text-right">Current</th>
                    <th className="px-4 py-3 text-right">P&L</th>
                    <th className="px-4 py-3 text-right">Auto-trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {positions.map((pos) => (
                    <tr key={pos.market} className="hover:bg-slate-800/60">
                      <td className="px-4 py-3 text-slate-100">{pos.market}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pos.side === 'YES' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                          {pos.side}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono">{pos.shares}</td>
                      <td className="px-4 py-3 text-right font-mono">${pos.entry.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-mono">${pos.current.toFixed(2)}</td>
                      <td className={`px-4 py-3 text-right font-mono ${pos.pnl >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">${pos.trigger.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Auto-Trader Settings</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">Enabled</span>
            </div>

            <div className="space-y-3 text-sm">
              <SettingRow label="Buy trigger threshold" value="0.45" />
              <SettingRow label="Sell trigger threshold" value="0.62" />
              <SettingRow label="Max position size" value="$5,000" />
              <SettingRow label="Stop-loss %" value="5%" />
              <SettingRow label="Take-profit %" value="12%" />
              <SettingRow label="Daily trade limit" value="15" />
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold">Save</button>
              <button className="flex-1 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 text-sm">Reset</button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activity.map((item) => (
                <div key={`${item.time}-${item.text}`} className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full ${activityColor(item.type)}`} />
                  <div>
                    <p className="text-xs text-slate-500">{item.time}</p>
                    <p className="text-sm text-slate-200">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

type MetricTrend = 'up' | 'down' | 'neutral'

const MetricCard = ({ label, value, trend }: { label: string; value: string; trend: MetricTrend }) => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
    <div className="mt-3 flex items-center justify-between">
      <p className="text-2xl font-semibold text-white">{value}</p>
      <span className={`text-xs px-2 py-1 rounded-full ${trendClass(trend)}`}>
        {trend === 'up' ? 'Up' : trend === 'down' ? 'Down' : 'Stable'}
      </span>
    </div>
  </div>
)

const SettingRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-slate-400">{label}</span>
    <input
      className="w-24 rounded-md bg-slate-950 border border-slate-800 px-2 py-1 text-right text-slate-200"
      value={value}
      readOnly
    />
  </div>
)

const trendClass = (trend: MetricTrend) => {
  if (trend === 'up') return 'bg-emerald-500/20 text-emerald-300'
  if (trend === 'down') return 'bg-rose-500/20 text-rose-300'
  return 'bg-slate-800 text-slate-300'
}

const activityColor = (type: string) => {
  if (type === 'buy') return 'bg-emerald-400'
  if (type === 'sell') return 'bg-blue-400'
  if (type === 'stop') return 'bg-rose-400'
  return 'bg-amber-400'
}
