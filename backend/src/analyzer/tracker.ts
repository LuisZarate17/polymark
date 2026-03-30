// Hit rate analyzer and performance metrics
// Tracks trade outcomes and generates analytics

export interface TradeRecord {
  positionId: string;
  tokenID: string;
  entryPrice: number;
  entrytime: number;
  exitPrice: number;
  exitTime: number;
  size: number;
  pnl: number;
  pnlPercent: number;
  duration: number; // ms
  side: 'LONG' | 'SHORT';
  isWin: boolean;
}

export interface AnalyticsMetrics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  hitRate: number; // %
  avgWin: number;
  avgLoss: number;
  winLossRatio: number;
  totalPnL: number;
  avgPnL: number;
  largestWin: number;
  largestLoss: number;
  sharpeRatio: number;
  maxDrawdown: number; // %
}

export class AnalyticsTracker {
  private trades: TradeRecord[] = [];

  recordTrade(
    positionId: string,
    tokenID: string,
    entryPrice: number,
    entryTime: number,
    exitPrice: number,
    exitTime: number,
    size: number,
    side: 'LONG' | 'SHORT'
  ): void {
    const pnl = side === 'LONG'
      ? (exitPrice - entryPrice) * size
      : (entryPrice - exitPrice) * size;

    const pnlPercent = ((pnl / (entryPrice * size)) * 100);
    const duration = exitTime - entryTime;
    const isWin = pnl > 0;

    this.trades.push({
      positionId,
      tokenID,
      entryPrice,
      entrytime: entryTime,
      exitPrice,
      exitTime,
      size,
      pnl,
      pnlPercent,
      duration,
      side,
      isWin,
    });
  }

  getTrades(): TradeRecord[] {
    return [...this.trades];
  }

  getMetrics(): AnalyticsMetrics {
    if (this.trades.length === 0) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        hitRate: 0,
        avgWin: 0,
        avgLoss: 0,
        winLossRatio: 0,
        totalPnL: 0,
        avgPnL: 0,
        largestWin: 0,
        largestLoss: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
      };
    }

    const totalTrades = this.trades.length;
    const winningTrades = this.trades.filter(t => t.isWin).length;
    const losingTrades = totalTrades - winningTrades;
    const hitRate = (winningTrades / totalTrades) * 100;

    const winningPnLs = this.trades.filter(t => t.isWin).map(t => t.pnl);
    const losingPnLs = this.trades.filter(t => !t.isWin).map(t => t.pnl);

    const avgWin = winningPnLs.length > 0 ? winningPnLs.reduce((a, b) => a + b, 0) / winningPnLs.length : 0;
    const avgLoss = losingPnLs.length > 0 ? losingPnLs.reduce((a, b) => a + b, 0) / losingPnLs.length : 0;
    const winLossRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;
    const totalPnL = this.trades.reduce((a, t) => a + t.pnl, 0);
    const avgPnL = totalPnL / totalTrades;

    const largestWin = winningPnLs.length > 0 ? Math.max(...winningPnLs) : 0;
    const largestLoss = losingPnLs.length > 0 ? Math.min(...losingPnLs) : 0;

    // Simple Sharpe Ratio (assuming daily returns, no risk-free rate)
    const pnls = this.trades.map(t => t.pnl);
    const stdDev = Math.sqrt(pnls.reduce((sum, p) => sum + Math.pow(p - avgPnL, 2), 0) / pnls.length);
    const sharpeRatio = stdDev > 0 ? avgPnL / stdDev : 0;

    // Simple max drawdown calculation
    let maxDrawdown = 0;
    let runningMax = 0;
    let cumulativePnL = 0;
    
    for (const trade of this.trades) {
      cumulativePnL += trade.pnl;
      runningMax = Math.max(runningMax, cumulativePnL);
      const drawdown = ((runningMax - cumulativePnL) / Math.abs(runningMax)) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return {
      totalTrades,
      winningTrades,
      losingTrades,
      hitRate,
      avgWin,
      avgLoss,
      winLossRatio,
      totalPnL,
      avgPnL,
      largestWin,
      largestLoss,
      sharpeRatio,
      maxDrawdown,
    };
  }

  getRecentTrades(limit: number = 10): TradeRecord[] {
    return this.trades.slice(-limit);
  }

  clear(): void {
    this.trades = [];
  }
}
