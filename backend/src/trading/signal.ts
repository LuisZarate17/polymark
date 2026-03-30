// Signal detection for volatility-based trading
// Analyzes spread and orderbook depth to identify trading opportunities

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export interface OrderBookData {
  bids: Array<{ price: number; size: number }>;
  asks: Array<{ price: number; size: number }>;
  timestamp: number;
}

export interface VolatilitySignal {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-1
  spread: number;
  spreadPercent: number;
  midPrice: number;
  reason: string;
}

export class SignalDetector {
  private volatilityThreshold: number;

  constructor(volatilityThreshold: number = 0.15) {
    this.volatilityThreshold = volatilityThreshold;
  }

  analyze(orderBook: OrderBookData): VolatilitySignal {
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

  setVolatilityThreshold(threshold: number): void {
    this.volatilityThreshold = threshold;
  }
}
