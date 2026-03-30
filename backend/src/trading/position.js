"use strict";
// Position management and risk control
// Handles entry, exit, sizing, and stop-loss logic
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionManager = void 0;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
class PositionManager {
    constructor(initialBalance, riskConfig) {
        this.positions = new Map();
        this.dailyLoss = 0;
        this.balance = initialBalance;
        this.riskConfig = riskConfig;
    }
    /**
     * Calculate position size based on risk parameters
     */
    calculateSize(entryPrice) {
        const riskAmount = (this.balance * this.riskConfig.positionSizePercent) / 100;
        const maxLoss = (entryPrice * this.riskConfig.stopLossPercent) / 100;
        return maxLoss > 0 ? riskAmount / maxLoss : 0;
    }
    /**
     * Open a new position
     */
    openPosition(tokenID, entryPrice, side) {
        const size = this.calculateSize(entryPrice);
        if (size <= 0) {
            throw new Error('Invalid position size');
        }
        const position = {
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
    closePosition(positionId, exitPrice) {
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
    checkStopLoss(positionId, currentPrice) {
        const position = this.positions.get(positionId);
        if (!position || position.status === 'CLOSED')
            return false;
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
    checkTakeProfit(positionId, currentPrice) {
        const position = this.positions.get(positionId);
        if (!position || position.status === 'CLOSED')
            return false;
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
    isMaxDailyLossExceeded() {
        const maxDailyLoss = -(this.balance * this.riskConfig.maxDailyLossPercent) / 100;
        return this.dailyLoss <= maxDailyLoss;
    }
    getPosition(positionId) {
        return this.positions.get(positionId);
    }
    getOpenPositions() {
        return Array.from(this.positions.values()).filter(p => p.status === 'OPEN');
    }
    getAllPositions() {
        return Array.from(this.positions.values());
    }
    getBalance() {
        return this.balance;
    }
    getDailyLoss() {
        return this.dailyLoss;
    }
    resetDailyLoss() {
        this.dailyLoss = 0;
    }
}
exports.PositionManager = PositionManager;
//# sourceMappingURL=position.js.map