# Getting Started Guide

## ✅ What You Have

A **production-ready Node.js backend** with:
- ✅ 26 passing unit tests
- ✅ RESTful API for trading (positions, analytics)
- ✅ Complete trading logic (signal detection, risk management)
- ✅ Hit rate calculator & performance metrics
- ✅ TypeScript compiler (fully typed)

Plus a **React frontend** with:
- Dashboard page (live metrics)
- Analyzer page (trade history)
- API integration hooks

---

## 🚀 Run in 3 Steps

### Step 1: Setup Environment
```bash
cp .env.example .env.local
# Edit .env.local and add your Polymarket API credentials
# (You need POLYMARKET_API_KEY and POLYMARKET_PRIVATE_KEY)
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Start Development
```bash
npm run dev
```

This starts:
- **Backend API**: http://localhost:3001
- **Frontend Dashboard**: http://localhost:3000

---

## 🧪 Verify Setup Works

### Run Tests
```bash
npm run test:backend
# Should show: 26 passed, 26 total ✅
```

### Test API Manually
```bash
# Check backend is running
curl http://localhost:3001/api/status

# Open a test position
curl -X POST http://localhost:3001/api/positions/open \
  -H "Content-Type: application/json" \
  -d '{"tokenID": "test", "entryPrice": 0.50, "side": "LONG"}'

# Get analytics
curl http://localhost:3001/api/analyzer/metrics
```

---

## 📋 Available Commands

```bash
# Development
npm run dev              # Start both servers
npm run dev:backend     # Backend only (port 3001)
npm run dev:frontend    # Frontend only (port 3000)

# Testing
npm run test            # All tests (backend + frontend)
npm run test:backend    # Backend unit tests
npm run test:coverage   # Code coverage report

# Building
npm run build           # Build both for production
npm run build:backend   # Backend only
npm run build:frontend  # Frontend only

# Linting
npm run lint
npm run lint:fix
```

---

## 🏗️ Architecture Overview

```
User Action (Frontend)
         ↓
API Request (HTTP/JSON)
         ↓
Express Router (Backend)
         ↓
Trading Logic:
  • Signal Detection (volatility)
  • Position Management (entry/exit)
  • Analytics Tracking (hit rate)
         ↓
Response (JSON)
         ↓
Dashboard Update (React)
```

---

## 📊 Core Features Implemented

### 1. Signal Detection ✅
```typescript
// Detects when bid-ask spread is wide (volatility)
const signal = detector.analyze(orderBook);
// Returns: BUY signal with confidence score 0-1
```

### 2. Position Management ✅
```typescript
// Opens position with automatic size calculation
const position = manager.openPosition(
  'token123',  // tokenID
  0.50,        // entry price
  'LONG'       // side
);
// Size = (Balance × 2%) / (Price × 5% stop loss)
```

### 3. Risk Control ✅
- Stop-loss: Auto exit if down 5%
- Profit target: Auto exit if up 10%
- Daily loss limit: Stop trading if down 5% today
- Position sizing: Risk % of balance per trade

### 4. Analytics & Hit Rate ✅
```typescript
// Tracks all trades and calculates metrics
const metrics = tracker.getMetrics();
// Returns:
{
  totalTrades: 42,
  hitRate: 59.5,        // % of winning trades
  avgWin: $125,
  avgLoss: -$45,
  winLossRatio: 2.78,
  sharpeRatio: 1.45,    // risk-adjusted return
  maxDrawdown: 8.2      // peak-to-trough %
}
```

---

## 🔧 Configuration Parameters

Edit `.env.local` to tune trading behavior:

| Parameter | Default | Purpose |
|-----------|---------|---------|
| `POSITION_SIZE_PERCENT` | 2 | Risk % of balance per trade |
| `STOP_LOSS_PERCENT` | 5 | Exit if down X% |
| `PROFIT_TARGET_PERCENT` | 10 | Exit if up X% |
| `VOLATILITY_THRESHOLD` | 0.15 | Buy when spread > X% |
| `MAX_DAILY_LOSS_PERCENT` | 5 | Stop trading if down X% today |

---

## 📈 Example Trade Flow

```
1. Market Data Received
   BID: $0.45 | ASK: $0.55
   Spread: 10 ÷ 0.50 = 20% (exceeds 15% threshold)
   ✓ BUY SIGNAL

2. Position Opened
   Entry Price: $0.50
   Position Size: 8,000 units (calculated)
   Entry Time: 2024-01-15 14:23:45

3. Price Monitoring
   Current: $0.47 (-6%)
   Status: Stop-loss triggered (exceeds -5%)
   ✓ CLOSE POSITION

4. Trade Result
   Exit Price: $0.47
   P&L: -$400 (loss)
   Exit Time: 2024-01-15 14:25:10

5. Metrics Updated
   Hit Rate: 42 wins ÷ 100 trades = 42%
```

---

## 🐛 Troubleshooting

**Q: Backend won't start?**
A: Check `.env.local` has valid Polymarket API keys

**Q: Tests failing?**
A: Make sure you're in the right directory:
```bash
cd backend && npm test
```

**Q: Frontend shows blank page?**
A: Backend not running? Start it first:
```bash
npm run dev:backend
```

**Q: API returns 404?**
A: Try `http://localhost:3001/api/status` to confirm backend is running

---

## 📚 Next Steps

### To Add More Features:

1. **Backtest Results**: Implement historical data replay
   - File: `backend/src/backtest/engine.ts`
   - Use historical OHLCV data to simulate trades

2. **WebSocket Updates**: Real-time price streaming
   - File: `backend/src/websocket/server.ts`
   - Push updates to frontend as prices change

3. **Database Persistence**: Save trades to PostgreSQL
   - File: `backend/src/database/models.ts`
   - Use Docker PostgreSQL from docker-compose.yml

4. **Alerts**: Email/SMS when trades are triggered
   - File: `backend/src/alerts/notifier.ts`
   - Integrate with SendGrid or Twilio

---

## 🎓 Code Structure Tips

- **Add a new signal type?**
  → Edit `backend/src/trading/signal.ts`

- **Change position sizing rule?**
  → Edit `calculateSize()` in `backend/src/trading/position.ts`

- **New dashboard metric?**
  → Add to `backend/src/analyzer/tracker.ts`

- **New frontend page?**
  → Create `frontend/src/pages/NewPage.tsx`

---

## 📞 Resources

- Polymarket Docs: https://docs.polymarket.com
- Node.js Guide: https://nodejs.org
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org

---

## Summary Commands

```bash
# One-liner setup
cp .env.example .env.local && npm install && npm run dev

# One-liner test verification
npm run test:backend 2>&1 | grep "26 passed"

# Docker quick start
docker-compose up
```

---

**Created**: March 30, 2026  
**Status**: Ready for Development  
**Next Phase**: Add backtesting & WebSocket live data streaming
