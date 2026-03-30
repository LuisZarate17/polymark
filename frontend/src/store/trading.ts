// Zustand store for trading data

import { create } from 'zustand';

export interface Position {
  id: string;
  tokenID: string;
  entryPrice: number;
  side: 'LONG' | 'SHORT';
  size: number;
  status: 'OPEN' | 'CLOSED';
  exitPrice?: number;
  pnl?: number;
}

export interface TradeMetrics {
  totalTrades: number;
  hitRate: number;
  totalPnL: number;
  avgPnL: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface TradingStore {
  positions: Position[];
  metrics: TradeMetrics | null;
  balance: number;
  dailyLoss: number;
  
  setPositions: (positions: Position[]) => void;
  setMetrics: (metrics: TradeMetrics) => void;
  setBalance: (balance: number) => void;
  setDailyLoss: (loss: number) => void;
}

export const useTradingStore = create<TradingStore>((set) => ({
  positions: [],
  metrics: null,
  balance: 0,
  dailyLoss: 0,
  
  setPositions: (positions) => set({ positions }),
  setMetrics: (metrics) => set({ metrics }),
  setBalance: (balance) => set({ balance }),
  setDailyLoss: (dailyLoss) => set({ dailyLoss }),
}));
