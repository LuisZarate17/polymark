"use strict";
// API routes for analytics (HIT RATE, TRADES, METRICS)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAnalyticsRoutes = void 0;
const express_1 = require("express");
const positions_1 = require("./positions");
const createAnalyticsRoutes = () => {
    const router = (0, express_1.Router)();
    // Get overall metrics (hit rate, win/loss ratio, etc.)
    router.get('/metrics', (req, res) => {
        const metrics = positions_1.analyticsTracker.getMetrics();
        res.json(metrics);
    });
    // Get all trades with analytics
    router.get('/trades', (req, res) => {
        const trades = positions_1.analyticsTracker.getTrades();
        const metrics = positions_1.analyticsTracker.getMetrics();
        res.json({
            totalTrades: trades.length,
            trades,
            summary: {
                hitRate: metrics.hitRate,
                totalPnL: metrics.totalPnL,
                avgPnL: metrics.avgPnL,
                sharpeRatio: metrics.sharpeRatio,
            },
        });
    });
    // Get recent trades
    router.get('/trades/recent', (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const recentTrades = positions_1.analyticsTracker.getRecentTrades(limit);
        res.json(recentTrades);
    });
    // Get equity curve data (for charting cumulative P&L)
    router.get('/equity-curve', (req, res) => {
        const trades = positions_1.analyticsTracker.getTrades();
        let cumulativePnL = 0;
        const equityCurve = trades.map((trade) => {
            cumulativePnL += trade.pnl;
            return {
                timestamp: trade.exitTime,
                cumulativePnL,
                tradeId: trade.positionId,
            };
        });
        res.json(equityCurve);
    });
    // Get performance summary
    router.get('/summary', (req, res) => {
        const metrics = positions_1.analyticsTracker.getMetrics();
        const trades = positions_1.analyticsTracker.getTrades();
        res.json({
            totalTrades: metrics.totalTrades,
            hitRate: metrics.hitRate.toFixed(2) + '%',
            totalPnL: metrics.totalPnL.toFixed(2),
            avgPnL: metrics.avgPnL.toFixed(2),
            avgWin: metrics.avgWin.toFixed(2),
            avgLoss: metrics.avgLoss.toFixed(2),
            winLossRatio: metrics.winLossRatio.toFixed(2),
            sharpeRatio: metrics.sharpeRatio.toFixed(2),
            maxDrawdown: metrics.maxDrawdown.toFixed(2) + '%',
            largestWin: metrics.largestWin.toFixed(2),
            largestLoss: metrics.largestLoss.toFixed(2),
            latestTrade: trades.length > 0 ? trades[trades.length - 1] : null,
        });
    });
    return router;
};
exports.createAnalyticsRoutes = createAnalyticsRoutes;
//# sourceMappingURL=analytics.js.map