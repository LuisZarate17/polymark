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
    positionSizePercent: number;
    stopLossPercent: number;
    profitTargetPercent: number;
    maxDailyLossPercent: number;
}
export declare class PositionManager {
    private positions;
    private balance;
    private dailyLoss;
    private riskConfig;
    constructor(initialBalance: number, riskConfig: RiskConfig);
    /**
     * Calculate position size based on risk parameters
     */
    calculateSize(entryPrice: number): number;
    /**
     * Open a new position
     */
    openPosition(tokenID: string, entryPrice: number, side: 'LONG' | 'SHORT'): Position;
    /**
     * Close a position and calculate P&L
     */
    closePosition(positionId: string, exitPrice: number): Position;
    /**
     * Check if position should be stopped out
     */
    checkStopLoss(positionId: string, currentPrice: number): boolean;
    /**
     * Check if position should take profit
     */
    checkTakeProfit(positionId: string, currentPrice: number): boolean;
    /**
     * Check if we've hit daily loss limit
     */
    isMaxDailyLossExceeded(): boolean;
    getPosition(positionId: string): Position | undefined;
    getOpenPositions(): Position[];
    getAllPositions(): Position[];
    getBalance(): number;
    getDailyLoss(): number;
    resetDailyLoss(): void;
}
//# sourceMappingURL=position.d.ts.map