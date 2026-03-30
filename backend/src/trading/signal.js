"use strict";
// Signal detection for volatility-based trading
// Analyzes spread and orderbook depth to identify trading opportunities
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignalDetector = void 0;
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
class SignalDetector {
    constructor(volatilityThreshold = 0.15) {
        this.volatilityThreshold = volatilityThreshold;
    }
    analyze(orderBook) {
        if (!orderBook.bids.length || !orderBook.asks.length) {
            return {
                type: 'HOLD',
                confidence: 0,
                spread: 0,
                spreadPercent: 0,
                midPrice: 0,
                reason: 'Empty orderbook',
            };
        }
        const bestBid = orderBook.bids[0];
        const bestAsk = orderBook.asks[0];
        if (!bestBid || !bestAsk) {
            return {
                type: 'HOLD',
                confidence: 0,
                spread: 0,
                spreadPercent: 0,
                midPrice: 0,
                reason: 'Invalid orderbook data',
            };
        }
        const spread = bestAsk.price - bestBid.price;
        const midPrice = (bestBid.price + bestAsk.price) / 2;
        const spreadPercent = (spread / midPrice) * 100;
        // Wide spread = volatility = potential trading opportunity
        const volatilityPercent = spreadPercent;
        const confidence = Math.min(volatilityPercent / this.volatilityThreshold, 1);
        if (volatilityPercent > this.volatilityThreshold) {
            return {
                type: 'BUY',
                confidence,
                spread,
                spreadPercent: volatilityPercent,
                midPrice,
                reason: `High volatility detected: ${volatilityPercent.toFixed(2)}% spread`,
            };
        }
        return {
            type: 'HOLD',
            confidence,
            spread,
            spreadPercent: volatilityPercent,
            midPrice,
            reason: `Volatility below threshold: ${volatilityPercent.toFixed(2)}%`,
        };
    }
    setVolatilityThreshold(threshold) {
        this.volatilityThreshold = threshold;
    }
}
exports.SignalDetector = SignalDetector;
//# sourceMappingURL=signal.js.map