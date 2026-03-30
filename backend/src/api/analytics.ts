// API routes for analytics (HIT RATE, TRADES, METRICS)

import { Router, Request, Response } from 'express';
import { analyticsTracker } from './positions';

export const createAnalyticsRoutes = (): Router => {
  const router = Router();

  // Get overall metrics (hit rate, win/loss ratio, etc.)
  router.get('/metrics', (req: Request, res: Response) => {
    const metrics = analyticsTracker.getMetrics();
    res.json(metrics);
  });

  // Get all trades with analytics
  router.get('/trades', (req: Request, res: Response) => {
    const trades = analyticsTracker.getTrades();
    const metrics = analyticsTracker.getMetrics();

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
  router.get('/trades/recent', (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const recentTrades = analyticsTracker.getRecentTrades(limit);
    res.json(recentTrades);
  });

  // Get equity curve data (for charting cumulative P&L)
  router.get('/equity-curve', (req: Request, res: Response) => {
    const trades = analyticsTracker.getTrades();
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
  router.get('/summary', (req: Request, res: Response) => {
    const metrics = analyticsTracker.getMetrics();
    const trades = analyticsTracker.getTrades();

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
