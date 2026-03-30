// Dashboard component showing live metrics

import React, { useEffect } from 'react'
import { useTradingStore } from '../store/trading'
import { useAPI } from '../hooks/useAPI'

export const Dashboard: React.FC = () => {
  const { setMetrics, setBalance, setDailyLoss } = useTradingStore()
  const { data: statusData } = useAPI('/api/status')
  const { data: metricsData } = useAPI('/api/analyzer/metrics')
  const { data: positionsData } = useAPI('/api/positions')

  useEffect(() => {
    if (metricsData) {
      setMetrics({
        totalTrades: metricsData.totalTrades,
        hitRate: metricsData.hitRate,
        totalPnL: metricsData.totalPnL,
        avgPnL: metricsData.avgPnL,
        sharpeRatio: metricsData.sharpeRatio,
        maxDrawdown: metricsData.maxDrawdown,
      })
    }
  }, [metricsData, setMetrics])

  useEffect(() => {
    if (positionsData) {
      setBalance(positionsData.balance || 0)
      setDailyLoss(positionsData.dailyLoss || 0)
    }
  }, [positionsData, setBalance, setDailyLoss])

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className="bg-green-900 border border-green-700 rounded-lg p-4">
        <p className="text-green-200 text-sm">
          ✓ Backend Connected {statusData && `(v${statusData.version})`}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Current Balance"
          value={`$${(positionsData?.balance || 0).toFixed(2)}`}
          color="blue"
        />
        <MetricCard
          label="Hit Rate"
          value={`${(metricsData?.hitRate || 0).toFixed(1)}%`}
          color={metricsData?.hitRate && metricsData.hitRate > 50 ? 'green' : 'red'}
        />
        <MetricCard
          label="Total P&L"
          value={`$${(metricsData?.totalPnL || 0).toFixed(2)}`}
          color={metricsData?.totalPnL && metricsData.totalPnL > 0 ? 'green' : 'red'}
        />
        <MetricCard
          label="Sharpe Ratio"
          value={(metricsData?.sharpeRatio || 0).toFixed(2)}
          color="purple"
        />
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Trades:</span>
              <span className="text-white font-mono">{metricsData?.totalTrades || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Win:</span>
              <span className="text-green-400 font-mono">${(metricsData?.avgWin || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Loss:</span>
              <span className="text-red-400 font-mono">${(metricsData?.avgLoss || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Win/Loss Ratio:</span>
              <span className="text-white font-mono">{(metricsData?.winLossRatio || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Metrics</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Max Drawdown:</span>
              <span className="text-orange-400 font-mono">
                {(metricsData?.maxDrawdown || 0).toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Loss:</span>
              <span className={`font-mono ${positionsData?.dailyLoss < 0 ? 'text-red-400' : 'text-green-400'}`}>
                ${(positionsData?.dailyLoss || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active Positions:</span>
              <span className="text-white font-mono">{positionsData?.positions?.filter((p: any) => p.status === 'OPEN').length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Avg Profit/Trade:</span>
              <span className="text-white font-mono">${(metricsData?.avgPnL || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  color: 'blue' | 'green' | 'red' | 'purple'
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, color }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
  }

  return (
    <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
      <p className="text-slate-400 text-sm">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${colorClasses[color]}`}>{value}</p>
    </div>
  )
}
