// Unit tests for signal detection logic

import { SignalDetector, OrderBookData } from '../src/trading/signal';

describe('Signal Detection', () => {
  let detector: SignalDetector;

  beforeEach(() => {
    detector = new SignalDetector(0.15); // 15% volatility threshold
  });

  it('should return HOLD for empty orderbook', () => {
    const orderBook: OrderBookData = {
      bids: [],
      asks: [],
      timestamp: Date.now(),
    };

    const signal = detector.analyze(orderBook);
    expect(signal.type).toBe('HOLD');
    expect(signal.reason).toContain('Empty orderbook');
  });

  it('should detect high volatility as BUY signal', () => {
    const orderBook: OrderBookData = {
      bids: [{ price: 0.45, size: 100 }],
      asks: [{ price: 0.55, size: 100 }],
      timestamp: Date.now(),
    };

    const signal = detector.analyze(orderBook);
    expect(signal.type).toBe('BUY');
    expect(signal.confidence).toBeGreaterThan(0.5);
    expect(signal.spreadPercent).toBeGreaterThan(15);
  });

  it('should return HOLD for low volatility', () => {
    const orderBook: OrderBookData = {
      bids: [{ price: 0.49999, size: 100 }],
      asks: [{ price: 0.50001, size: 100 }],
      timestamp: Date.now(),
    };

    const signal = detector.analyze(orderBook);
    expect(signal.type).toBe('HOLD');
    expect(signal.spreadPercent).toBeLessThan(5);
  });

  it('should calculate correct spread and mid price', () => {
    const orderBook: OrderBookData = {
      bids: [{ price: 0.4, size: 100 }],
      asks: [{ price: 0.6, size: 100 }],
      timestamp: Date.now(),
    };

    const signal = detector.analyze(orderBook);
    expect(signal.spread).toBeCloseTo(0.2, 5);
    expect(signal.midPrice).toBeCloseTo(0.5, 5);
  });

  it('should scale confidence with volatility', () => {
    const lowVolOrderBook: OrderBookData = {
      bids: [{ price: 0.4995, size: 100 }],
      asks: [{ price: 0.5005, size: 100 }],
      timestamp: Date.now(),
    };

    const highVolOrderBook: OrderBookData = {
      bids: [{ price: 0.4, size: 100 }],
      asks: [{ price: 0.6, size: 100 }],
      timestamp: Date.now(),
    };

    const lowVolSignal = detector.analyze(lowVolOrderBook);
    const highVolSignal = detector.analyze(highVolOrderBook);

    expect(highVolSignal.confidence).toBeGreaterThanOrEqual(lowVolSignal.confidence);
  });
});
