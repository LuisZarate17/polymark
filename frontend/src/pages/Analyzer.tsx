// Analyzer page showing detailed trade history and metrics

import React from 'react'
import { useAPI } from '../hooks/useAPI'

export const Analyzer: React.FC = () => {
  const { data: summaryData, loading: summaryLoading } = useAPI('/api/analyzer/summary')
  const { data: tradesData, loading: tradesLoading } = useAPI('/api/analyzer/trades')

  if (summaryLoading || tradesLoading) {
    return <div className="text-slate-400">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatBox
          label="Hit Rate"
          value={summaryData?.hitRate || '0%'}
          highlight={true}
        />
        <StatBox
          label="Total P&L"
          value={`$${summaryData?.totalPnL || '0'}`}
          highlight={summaryData?.totalPnL > 0}
        />
        <StatBox
          label="Sharpe Ratio"
          value={summaryData?.sharpeRatio || '0'}
        />
        <StatBox
          label="Win/Loss"
          value={summaryData?.winLossRatio || '0'}
        />
        <StatBox
          label="Max Drawdown"
          value={`${summaryData?.maxDrawdown || '0'}%`}
        />
      </div>

      {/* Trades History */}
      <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
        <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
        
        {tradesData?.trades && tradesData.trades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-300">
              <thead className="bg-slate-600 text-slate-100">
                <tr>
                  <th className="px-4 py-2 text-left">Token</th>
                  <th className="px-4 py-2 text-right">Entry</th>
                  <th className="px-4 py-2 text-right">Exit</th>
                  <th className="px-4 py-2 text-right">Size</th>
                  <th className="px-4 py-2 text-right">P&L</th>
                  <th className="px-4 py-2 text-right">Return %</th>
                  <th className="px-4 py-2 text-left">Side</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {tradesData.trades.slice(-10).reverse().map((trade: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-600 transition">
                    <td className="px-4 py-3">{trade.tokenID.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-right font-mono">${trade.entryPrice.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right font-mono">${trade.exitPrice.toFixed(4)}</td>
                    <td className="px-4 py-3 text-right font-mono">{trade.size.toFixed(0)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${trade.isWin ? 'text-green-400' : 'text-red-400'}`}>
                      ${trade.pnl.toFixed(2)}
                    </td>
                    <td className={`px-4 py-3 text-right font-mono ${trade.isWin ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnlPercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3">{trade.side}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${trade.isWin ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                        {trade.isWin ? 'WIN' : 'LOSS'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 py-8 text-center">No trades yet</p>
        )}
      </div>
    </div>
  )
}

interface StatBoxProps {
  label: string
  value: string
  highlight?: boolean
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, highlight }) => (
  <div className={`rounded-lg p-4 border ${highlight ? 'bg-slate-700 border-slate-500' : 'bg-slate-800 border-slate-700'}`}>
    <p className="text-slate-400 text-sm">{label}</p>
    <p className="text-lg font-bold text-white mt-1">{value}</p>
  </div>
)
