// Zustand store for trading data
import { create } from 'zustand';
export const useTradingStore = create((set) => ({
    positions: [],
    metrics: null,
    balance: 0,
    dailyLoss: 0,
    setPositions: (positions) => set({ positions }),
    setMetrics: (metrics) => set({ metrics }),
    setBalance: (balance) => set({ balance }),
    setDailyLoss: (dailyLoss) => set({ dailyLoss }),
}));
//# sourceMappingURL=trading.js.map