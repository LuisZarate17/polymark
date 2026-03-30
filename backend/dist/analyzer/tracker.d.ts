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
    duration: number;
    side: 'LONG' | 'SHORT';
    isWin: boolean;
}
export interface AnalyticsMetrics {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    hitRate: number;
    avgWin: number;
    avgLoss: number;
    winLossRatio: number;
    totalPnL: number;
    avgPnL: number;
    largestWin: number;
    largestLoss: number;
    sharpeRatio: number;
    maxDrawdown: number;
}
export declare class AnalyticsTracker {
    private trades;
    recordTrade(positionId: string, tokenID: string, entryPrice: number, entryTime: number, exitPrice: number, exitTime: number, size: number, side: 'LONG' | 'SHORT'): void;
    getTrades(): TradeRecord[];
    getMetrics(): AnalyticsMetrics;
    getRecentTrades(limit?: number): TradeRecord[];
    clear(): void;
}
//# sourceMappingURL=tracker.d.ts.map