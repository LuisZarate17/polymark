"use strict";
// Zustand store for trading data
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTradingStore = void 0;
const zustand_1 = require("zustand");
exports.useTradingStore = (0, zustand_1.create)((set) => ({
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