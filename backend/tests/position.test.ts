// Unit tests for position management and risk control

import { PositionManager, RiskConfig, Position } from '../src/trading/position';

describe('Position Management', () => {
  let positionManager: PositionManager;
  const riskConfig: RiskConfig = {
    positionSizePercent: 2, // Risk 2% per trade
    stopLossPercent: 5,
    profitTargetPercent: 10,
    maxDailyLossPercent: 5,
  };

  beforeEach(() => {
    positionManager = new PositionManager(10000, riskConfig); // $10k starting balance
  });

  it('should calculate position size correctly', () => {
    const entryPrice = 0.5;
    const size = positionManager.calculateSize(entryPrice);
    
    // Risk 2% of $10k = $200
    // Stop loss at 5% = $0.025
    // Size = $200 / $0.025 = 8000
    expect(size).toBe(8000);
  });

  it('should open a position', () => {
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    
    expect(position.id).toBeDefined();
    expect(position.tokenID).toBe('token123');
    expect(position.entryPrice).toBe(0.5);
    expect(position.side).toBe('LONG');
    expect(position.status).toBe('OPEN');
  });

  it('should close a position and calculate P&L', () => {
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    const closedPosition = positionManager.closePosition(position.id, 0.55);
    
    expect(closedPosition.status).toBe('CLOSED');
    expect(closedPosition.exitPrice).toBe(0.55);
    expect(closedPosition.pnl).toBeGreaterThan(0); // Profitable trade
  });

  it('should detect stop loss for LONG position', () => {
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    
    // Price drops 6% (exceeds 5% stop loss)
    const currentPrice = 0.47; // -6%
    const isStoppedOut = positionManager.checkStopLoss(position.id, currentPrice);
    
    expect(isStoppedOut).toBe(true);
  });

  it('should not trigger stop loss within threshold', () => {
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    
    // Price drops 3% (within 5% stop loss)
    const currentPrice = 0.485; // -3%
    const isStoppedOut = positionManager.checkStopLoss(position.id, currentPrice);
    
    expect(isStoppedOut).toBe(false);
  });

  it('should detect take profit for LONG position', () => {
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    
    // Price rises 11% (exceeds 10% profit target)
    const currentPrice = 0.555; // +11%
    const isTakeProfit = positionManager.checkTakeProfit(position.id, currentPrice);
    
    expect(isTakeProfit).toBe(true);
  });

  it('should track balance changes', () => {
    const initialBalance = positionManager.getBalance();
    expect(initialBalance).toBe(10000);
    
    const position = positionManager.openPosition('token123', 0.5, 'LONG');
    positionManager.closePosition(position.id, 0.6); // +20% profit
    
    const newBalance = positionManager.getBalance();
    expect(newBalance).toBeGreaterThan(initialBalance);
  });

  it('should track daily loss', () => {
    const position = positionManager.openPosition('token123', 1.0, 'LONG');
    positionManager.closePosition(position.id, 0.8); // Losing trade
    
    const dailyLoss = positionManager.getDailyLoss();
    expect(dailyLoss).toBeLessThan(0);
  });

  it('should identify max daily loss exceeded', () => {
    const position1 = positionManager.openPosition('token1', 1.0, 'LONG');
    const position2 = positionManager.openPosition('token2', 1.0, 'LONG');
    
    positionManager.closePosition(position1.id, 0.4); // Large loss
    
    const isMaxDailyLossExceeded = positionManager.isMaxDailyLossExceeded();
    expect(isMaxDailyLossExceeded).toBe(true);
  });
});
