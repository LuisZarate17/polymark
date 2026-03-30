// Position management and risk control
// Handles entry, exit, sizing, and stop-loss logic

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export interface Position {
  id: string;
  tokenID: string;
  side: 'LONG' | 'SHORT';
  entryPrice: number;
  size: number;
  entryTime: number;
  status: 'OPEN' | 'CLOSED';
  exitPrice?: number;
  exitTime?: number;
  pnl?: number;
}

export interface RiskConfig {
  positionSizePercent: number; // % of balance to risk
  stopLossPercent: number; // Exit if down X%
  profitTargetPercent: number; // Exit if up X%
  maxDailyLossPercent: number; // Stop trading if daily loss exceeds X%
}

export class PositionManager {
  private positions: Map<string, Position> = new Map();
  private balance: number;
  private dailyLoss: number = 0;
  private riskConfig: RiskConfig;

  constructor(initialBalance: number, riskConfig: RiskConfig) {
    this.balance = initialBalance;
    this.riskConfig = riskConfig;
  }

  /**
   * Calculate position size based on risk parameters
   */
  calculateSize(entryPrice: number): number {
    const riskAmount = (this.balance * this.riskConfig.positionSizePercent) / 100;
    const maxLoss = (entryPrice * this.riskConfig.stopLossPercent) / 100;
    return maxLoss > 0 ? riskAmount / maxLoss : 0;
  }

  /**
   * Open a new position
   */
  openPosition(tokenID: string, entryPrice: number, side: 'LONG' | 'SHORT'): Position {
    const size = this.calculateSize(entryPrice);
    
    if (size <= 0) {
      throw new Error('Invalid position size');
    }

    const position: Position = {
      id: `pos_${Date.now()}`,
      tokenID,
      side,
      entryPrice,
      size,
      entryTime: Date.now(),
      status: 'OPEN',
    };

    this.positions.set(position.id, position);
    logger.info(`Position opened: ${position.id}`, { entryPrice, size, side });

    return position;
  }

  /**
   * Close a position and calculate P&L
   */
  closePosition(positionId: string, exitPrice: number): Position {
    const position = this.positions.get(positionId);
    
    if (!position || position.status === 'CLOSED') {
      throw new Error(`Position ${positionId} not found or already closed`);
    }

    const pnl = position.side === 'LONG'
      ? (exitPrice - position.entryPrice) * position.size
      : (position.entryPrice - exitPrice) * position.size;

    position.exitPrice = exitPrice;
    position.exitTime = Date.now();
    position.status = 'CLOSED';
    position.pnl = pnl;

    this.balance += pnl;
    this.dailyLoss += Math.min(pnl, 0); // Track negative P&L

    logger.info(`Position closed: ${positionId}`, { exitPrice, pnl, balance: this.balance });

    return position;
  }

  /**
   * Check if position should be stopped out
   */
  checkStopLoss(positionId: string, currentPrice: number): boolean {
    const position = this.positions.get(positionId);
    if (!position || position.status === 'CLOSED') return false;

    const pnlPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;
    
    if (position.side === 'LONG' && pnlPercent < -this.riskConfig.stopLossPercent) {
      return true;
    }
    
    if (position.side === 'SHORT' && pnlPercent > this.riskConfig.stopLossPercent) {
      return true;
    }

    return false;
  }

  /**
   * Check if position should take profit
   */
  checkTakeProfit(positionId: string, currentPrice: number): boolean {
    const position = this.positions.get(positionId);
    if (!position || position.status === 'CLOSED') return false;

    const pnlPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;
    
    if (position.side === 'LONG' && pnlPercent >= this.riskConfig.profitTargetPercent) {
      return true;
    }
    
    if (position.side === 'SHORT' && pnlPercent <= -this.riskConfig.profitTargetPercent) {
      return true;
    }

    return false;
  }

  /**
   * Check if we've hit daily loss limit
   */
  isMaxDailyLossExceeded(): boolean {
    const maxDailyLoss = -(this.balance * this.riskConfig.maxDailyLossPercent) / 100;
    return this.dailyLoss <= maxDailyLoss;
  }

  getPosition(positionId: string): Position | undefined {
    return this.positions.get(positionId);
  }

  getOpenPositions(): Position[] {
    return Array.from(this.positions.values()).filter(p => p.status === 'OPEN');
  }

  getAllPositions(): Position[] {
    return Array.from(this.positions.values());
  }

  getBalance(): number {
    return this.balance;
  }

  getDailyLoss(): number {
    return this.dailyLoss;
  }

  resetDailyLoss(): void {
    this.dailyLoss = 0;
  }
}
