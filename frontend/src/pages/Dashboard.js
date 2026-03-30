"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// Dashboard component showing live metrics
const react_1 = require("react");
const trading_1 = require("../store/trading");
const useAPI_1 = require("../hooks/useAPI");
const Dashboard = () => {
    const { setMetrics, setBalance, setDailyLoss } = (0, trading_1.useTradingStore)();
    const { data: statusData } = (0, useAPI_1.useAPI)('/api/status');
    const { data: metricsData } = (0, useAPI_1.useAPI)('/api/analyzer/metrics');
    const { data: positionsData } = (0, useAPI_1.useAPI)('/api/positions');
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
        if (positionsData) {
            setBalance(positionsData.balance || 0);
            setDailyLoss(positionsData.dailyLoss || 0);
        }
    }, [positionsData, setBalance, setDailyLoss]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-green-900 border border-green-700 rounded-lg p-4", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-green-200 text-sm", children: ["\u2713 Backend Connected ", statusData && `(v${statusData.version})`] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [(0, jsx_runtime_1.jsx)(MetricCard, { label: "Current Balance", value: `$${(positionsData?.balance || 0).toFixed(2)}`, color: "blue" }), (0, jsx_runtime_1.jsx)(MetricCard, { label: "Hit Rate", value: `${(metricsData?.hitRate || 0).toFixed(1)}%`, color: metricsData?.hitRate && metricsData.hitRate > 50 ? 'green' : 'red' }), (0, jsx_runtime_1.jsx)(MetricCard, { label: "Total P&L", value: `$${(metricsData?.totalPnL || 0).toFixed(2)}`, color: metricsData?.totalPnL && metricsData.totalPnL > 0 ? 'green' : 'red' }), (0, jsx_runtime_1.jsx)(MetricCard, { label: "Sharpe Ratio", value: (metricsData?.sharpeRatio || 0).toFixed(2), color: "purple" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-700 rounded-lg p-6 border border-slate-600", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Performance" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Total Trades:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-mono", children: metricsData?.totalTrades || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Avg Win:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-green-400 font-mono", children: ["$", (metricsData?.avgWin || 0).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Avg Loss:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-red-400 font-mono", children: ["$", (metricsData?.avgLoss || 0).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Win/Loss Ratio:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-mono", children: (metricsData?.winLossRatio || 0).toFixed(2) })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-700 rounded-lg p-6 border border-slate-600", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-semibold text-white mb-4", children: "Risk Metrics" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 text-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Max Drawdown:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-orange-400 font-mono", children: [(metricsData?.maxDrawdown || 0).toFixed(2), "%"] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Daily Loss:" }), (0, jsx_runtime_1.jsxs)("span", { className: `font-mono ${positionsData?.dailyLoss < 0 ? 'text-red-400' : 'text-green-400'}`, children: ["$", (positionsData?.dailyLoss || 0).toFixed(2)] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Active Positions:" }), (0, jsx_runtime_1.jsx)("span", { className: "text-white font-mono", children: positionsData?.positions?.filter((p) => p.status === 'OPEN').length || 0 })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-slate-400", children: "Avg Profit/Trade:" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-white font-mono", children: ["$", (metricsData?.avgPnL || 0).toFixed(2)] })] })] })] })] })] }));
};
exports.Dashboard = Dashboard;
const MetricCard = ({ label, value, color }) => {
    const colorClasses = {
        blue: 'text-blue-400',
        green: 'text-green-400',
        red: 'text-red-400',
        purple: 'text-purple-400',
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-slate-700 rounded-lg p-4 border border-slate-600", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-slate-400 text-sm", children: label }), (0, jsx_runtime_1.jsx)("p", { className: `text-2xl font-bold mt-2 ${colorClasses[color]}`, children: value })] }));
};
//# sourceMappingURL=Dashboard.js.map