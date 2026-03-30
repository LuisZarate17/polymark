// Unit tests for analytics tracking and hit rate calculation

import { AnalyticsTracker } from '../src/analyzer/tracker';

describe('Analytics Tracker', () => {
  let tracker: AnalyticsTracker;

  beforeEach(() => {
    tracker = new AnalyticsTracker();
  });

  it('should initialize with empty trades', () => {
    const metrics = tracker.getMetrics();
    expect(metrics.totalTrades).toBe(0);
    expect(metrics.hitRate).toBe(0);
  });

  it('should record a winning trade', () => {
    const now = Date.now();
    tracker.recordTrade('pos1', 'token1', 0.5, now, 0.6, now + 1000, 100, 'LONG');
    
    const metrics = tracker.getMetrics();
    expect(metrics.totalTrades).toBe(1);
    expect(metrics.winningTrades).toBe(1);
    expect(metrics.hitRate).toBe(100);
    expect(metrics.totalPnL).toBeGreaterThan(0);
  });

  it('should record a losing trade', () => {
    const now = Date.now();
    tracker.recordTrade('pos1', 'token1', 0.5, now, 0.4, now + 1000, 100, 'LONG');
    
    const metrics = tracker.getMetrics();
    expect(metrics.totalTrades).toBe(1);
    expect(metrics.losingTrades).toBe(1);
    expect(metrics.hitRate).toBe(0);
    expect(metrics.totalPnL).toBeLessThan(0);
  });

  it('should calculate hit rate correctly', () => {
    const now = Date.now();
    
    // Record 7 wins and 3 losses
    for (let i = 0; i < 7; i++) {
      tracker.recordTrade(`pos${i}`, 'token1', 0.5, now, 0.6, now + 1000, 100, 'LONG');
    }
    for (let i = 7; i < 10; i++) {
      tracker.recordTrade(`pos${i}`, 'token1', 0.5, now, 0.4, now + 1000, 100, 'LONG');
    }
    
    const metrics = tracker.getMetrics();
    expect(metrics.totalTrades).toBe(10);
    expect(metrics.winningTrades).toBe(7);
    expect(metrics.hitRate).toBe(70);
  });

  it('should calculate win/loss ratio', () => {
    const now = Date.now();
    
    // Record win: +$10
    tracker.recordTrade('pos1', 'token1', 1.0, now, 1.1, now + 1000, 100, 'LONG');
    // Record loss: -$5
    tracker.recordTrade('pos2', 'token1', 1.0, now, 0.95, now + 1000, 100, 'LONG');
    
    const metrics = tracker.getMetrics();
    expect(metrics.winLossRatio).toBeCloseTo(2.0, 0); // Win/$5 loss = 2:1 ratio
  });

  it('should track largest win and loss', () => {
    const now = Date.now();
    
    tracker.recordTrade('pos1', 'token1', 0.5, now, 0.6, now + 1000, 100, 'LONG'); // +$10
    tracker.recordTrade('pos2', 'token1', 0.5, now, 0.3, now + 1000, 100, 'LONG'); // -$20
    
    const metrics = tracker.getMetrics();
    expect(metrics.largestWin).toBeCloseTo(10, 1);
    expect(metrics.largestLoss).toBeCloseTo(-20, 1);
  });

  it('should retrieve recent trades', () => {
    const now = Date.now();
    
    for (let i = 0; i < 15; i++) {
      tracker.recordTrade(`pos${i}`, 'token1', 0.5, now, 0.6, now + 1000, 100, 'LONG');
    }
    
    const recent = tracker.getRecentTrades(5);
    expect(recent.length).toBe(5);
  });

  it('should calculate Sharpe ratio', () => {
    const now = Date.now();
    
    // Record consistent winning trades
    for (let i = 0; i < 10; i++) {
      tracker.recordTrade(`pos${i}`, 'token1', 0.5, now, 0.51, now + 1000, 100, 'LONG');
    }
    
    const metrics = tracker.getMetrics();
    expect(metrics.sharpeRatio).toBeGreaterThan(0);
  });

  it('should clear trades', () => {
    const now = Date.now();
    tracker.recordTrade('pos1', 'token1', 0.5, now, 0.6, now + 1000, 100, 'LONG');
    
    tracker.clear();
    
    const metrics = tracker.getMetrics();
    expect(metrics.totalTrades).toBe(0);
  });
});
