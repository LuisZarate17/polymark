export interface OrderBookData {
    bids: Array<{
        price: number;
        size: number;
    }>;
    asks: Array<{
        price: number;
        size: number;
    }>;
    timestamp: number;
}
export interface VolatilitySignal {
    type: 'BUY' | 'SELL' | 'HOLD';
    confidence: number;
    spread: number;
    spreadPercent: number;
    midPrice: number;
    reason: string;
}
export declare class SignalDetector {
    private volatilityThreshold;
    constructor(volatilityThreshold?: number);
    analyze(orderBook: OrderBookData): VolatilitySignal;
    setVolatilityThreshold(threshold: number): void;
}
//# sourceMappingURL=signal.d.ts.map