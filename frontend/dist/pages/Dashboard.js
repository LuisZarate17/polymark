import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
// Dashboard component showing live metrics
import { useEffect } from 'react';
import { useTradingStore } from '../store/trading';
import { useAPI } from '../hooks/useAPI';
export const Dashboard = () => {
    const { setMetrics, setBalance, setDailyLoss } = useTradingStore();
    const { data: statusData } = useAPI('/api/status');
    const { data: metricsData } = useAPI('/api/analyzer/metrics');
    const { data: positionsData } = useAPI('/api/positions');
    useEffect(() => {
        if (metricsData) {
            setMetrics({
                totalTrades: metricsData.totalTrades,
                hitRate: metricsData.hitRate,
                totalPnL: metricsData.totalPnL,
                avgPnL: metricsData.avgPnL,
                sharpeRatio: metricsData.sharpeRatio,
                maxDrawdown: metricsData.maxDrawdown,
            });
        }
    }, [metricsData, setMetrics]);
    useEffect(() => {
        if (positionsData) {
            setBalance(positionsData.balance || 0);
            setDailyLoss(positionsData.dailyLoss || 0);
        }
    }, [positionsData, setBalance, setDailyLoss]);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "bg-green-900 border border-green-700 rounded-lg p-4", children: _jsxs("p", { className: "text-green-200 text-sm", children: ["\u2713 Backend Connected ", statusData && `(v${statusData.version})`] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(MetricCard, { label: "Current Balance", value: `$${(positionsData?.balance || 0).toFixed(2)}`, color: "blue" }), _jsx(MetricCard, { label: "Hit Rate", value: `${(metricsData?.hitRate || 0).toFixed(1)}%`, color: metricsData?.hitRate && metricsData.hitRate > 50 ? 'green' : 'red' }), _jsx(MetricCard, { label: "Total P&L", value: `$${(metricsData?.totalPnL || 0).toFixed(2)}`, color: metricsData?.totalPnL && metricsData.totalPnL > 0 ? 'green' : 'red' }), _jsx(MetricCard, { label: "Sharpe Ratio", value: (metricsData?.sharpeRatio || 0).toFixed(2), color: "purple" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-slate-700 rounded-lg p-6 border border-slate-600", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Performance" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Total Trades:" }), _jsx("span", { className: "text-white font-mono", children: metricsData?.totalTrades || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Avg Win:" }), _jsxs("span", { className: "text-green-400 font-mono", children: ["$", (metricsData?.avgWin || 0).toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Avg Loss:" }), _jsxs("span", { className: "text-red-400 font-mono", children: ["$", (metricsData?.avgLoss || 0).toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Win/Loss Ratio:" }), _jsx("span", { className: "text-white font-mono", children: (metricsData?.winLossRatio || 0).toFixed(2) })] })] })] }), _jsxs("div", { className: "bg-slate-700 rounded-lg p-6 border border-slate-600", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Risk Metrics" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Max Drawdown:" }), _jsxs("span", { className: "text-orange-400 font-mono", children: [(metricsData?.maxDrawdown || 0).toFixed(2), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Daily Loss:" }), _jsxs("span", { className: `font-mono ${positionsData?.dailyLoss < 0 ? 'text-red-400' : 'text-green-400'}`, children: ["$", (positionsData?.dailyLoss || 0).toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Active Positions:" }), _jsx("span", { className: "text-white font-mono", children: positionsData?.positions?.filter((p) => p.status === 'OPEN').length || 0 })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-slate-400", children: "Avg Profit/Trade:" }), _jsxs("span", { className: "text-white font-mono", children: ["$", (metricsData?.avgPnL || 0).toFixed(2)] })] })] })] })] })] }));
};
const MetricCard = ({ label, value, color }) => {
    const colorClasses = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
    };
    return (_jsxs("div", { className: "bg-slate-700 rounded-lg p-4 border border-slate-600", children: [_jsx("p", { className: "text-slate-400 text-sm", children: label }), _jsx("p", { className: `text-2xl font-bold mt-2 ${colorClasses[color]}`, children: value })] }));
};
//# sourceMappingURL=Dashboard.js.map