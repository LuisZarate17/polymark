// API routes for positions (OPEN, CLOSE, GET)

import { Router, Request, Response } from 'express';
import { PositionManager, RiskConfig } from '../trading/position';
import { AnalyticsTracker } from '../analyzer/tracker';

const riskConfig: RiskConfig = {
  positionSizePercent: parseFloat(process.env.POSITION_SIZE_PERCENT || '2'),
  stopLossPercent: parseFloat(process.env.STOP_LOSS_PERCENT || '5'),
  profitTargetPercent: parseFloat(process.env.PROFIT_TARGET_PERCENT || '10'),
  maxDailyLossPercent: parseFloat(process.env.MAX_DAILY_LOSS_PERCENT || '5'),
};

const positionManager = new PositionManager(100000, riskConfig); // $100k starting balance
const analyticsTracker = new AnalyticsTracker();

export const createPositionRoutes = (): Router => {
  const router = Router();

  // Get all positions
  router.get('/', (req: Request, res: Response) => {
    const positions = positionManager.getAllPositions();
    res.json({
      total: positions.length,
      positions,
      balance: positionManager.getBalance(),
      dailyLoss: positionManager.getDailyLoss(),
    });
  });

  // Get active positions only
  router.get('/open', (req: Request, res: Response) => {
    const positions = positionManager.getOpenPositions();
    res.json({
      count: positions.length,
      positions,
    });
  });

  // Open a new position
  router.post('/open', (req: Request, res: Response) => {
    try {
      const { tokenID, entryPrice, side } = req.body;

      if (!tokenID || !entryPrice || !side) {
        return res.status(400).json({
          error: 'Missing required fields: tokenID, entryPrice, side',
        });
      }

      if (positionManager.isMaxDailyLossExceeded()) {
        return res.status(429).json({
          error: 'Max daily loss limit exceeded. Trading halted for today.',
          dailyLoss: positionManager.getDailyLoss(),
        });
      }

      const position = positionManager.openPosition(tokenID, entryPrice, side);
      res.status(201).json(position);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Close a position
  router.post('/:positionId/close', (req: Request, res: Response) => {
    try {
      const { exitPrice } = req.body;
      const { positionId } = req.params;

      if (!exitPrice) {
        return res.status(400).json({ error: 'Missing required field: exitPrice' });
      }

      const position = positionManager.closePosition(positionId, exitPrice);

      // Record in analytics
      const openPos = positionManager.getPosition(positionId);
      if (openPos && position.pnl !== undefined) {
        analyticsTracker.recordTrade(
          positionId,
          position.tokenID,
          position.entryPrice,
          position.entryTime,
          position.exitPrice!,
          position.exitTime!,
          position.size,
          position.side === 'LONG' ? 'LONG' : 'SHORT'
        );
      }

      res.json(position);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  // Get single position
  router.get('/:positionId', (req: Request, res: Response) => {
    try {
      const { positionId } = req.params;
      const position = positionManager.getPosition(positionId);

      if (!position) {
        return res.status(404).json({ error: 'Position not found' });
      }

      res.json(position);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  });

  return router;
};

export { positionManager, analyticsTracker };
