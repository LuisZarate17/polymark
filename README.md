# Polymarket Auto-Trading Dashboard

A Node.js + React application that monitors Polymarket market data, executes volatility-driven trades with automatic loss prevention, and provides performance analytics, market discovery, and a paper-trading Test Lab.

## Features

- **Live Market Snapshot**: WebSocket-driven orderbook summary (best bid/ask, spread)
- **Market Discovery**: Top Polymarket probabilities (by volume) in Analyzer
- **Volatility-Based Trading**: Automatic buy/sell logic based on bid-ask spreads
- **Risk Management**: Stop-loss, take-profit, position sizing (% of balance)
- **Dashboard**: P&L cards, portfolio chart, positions table, settings panel, activity feed
- **Analyzer**: Filters, KPI cards, charts, top trades, full trade history table
- **Test Lab (Paper Trading)**: Mock funds, test metrics, positions, and event feed

## Project Structure

```
polymark/
├── backend/              # Node.js/TypeScript API server
│   ├── src/
│   │   ├── index.ts      # Express server entry point
│   │   ├── api/          # API routes
│   │   ├── trading/      # Trading logic & signal detection
│   │   ├── database/     # Database layer (SQLite/PostgreSQL)
│   │   ├── polymarket/   # Polymarket API client
│   │   ├── analyzer/     # Hit rate & performance tracking
│   │   └── backtest/     # Backtesting engine
│   ├── tests/            # Unit tests
│   └── package.json
├── frontend/             # React/TypeScript dashboard
│   ├── src/
│   │   ├── App.tsx       # Main app component
│   │   ├── pages/        # Dashboard, analyzer views
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # WebSocket & API hooks
│   │   └── store/        # Zustand state management
│   ├── public/           # Static assets
│   └── package.json
├── tests/                # Integration & backtest tests
│   ├── integration/
│   └── backtest/
├── docker-compose.yml    # Multi-container setup (backend, frontend, DB, cache)
├── .env.example          # Configuration template
├── docs/                 # Reflection + proof of participation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- Docker & Docker Compose (optional, for containerized deployment)

### Local Development

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Polymarket API credentials.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   This runs both backend (port 3001) and frontend (port 3000) concurrently.

4. **Access the dashboard:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

### Docker Deployment

```bash
docker-compose up
```

This starts:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 3001
- Frontend dashboard on port 3000

## Configuration

All settings are in `.env.local`. Key parameters:

```env
# Polymarket API
POLYMARKET_API_KEY=your_key
POLYMARKET_PRIVATE_KEY=your_wallet_private_key
POLYMARKET_CHAIN_ID=137
POLYMARKET_TOKEN_ID=your_market_token_id_here   # optional, for live WS feed
POLYMARKET_CLOB_URL=https://clob.polymarket.com
POLYMARKET_POLL_MS=2000

# Trading Rules
POSITION_SIZE_PERCENT=2          # Risk 2% of balance per trade
STOP_LOSS_PERCENT=5              # Exit if down 5%
PROFIT_TARGET_PERCENT=10         # Exit if up 10%
VOLATILITY_THRESHOLD=0.15        # Buy when spread > 15%
MAX_DAILY_LOSS_PERCENT=5         # Stop trading if down 5% today
```

## Testing

```bash
# Run all tests
npm run test

# Unit tests only
npm run test:backend

# Integration tests
npm run test:integration

# Backtest against historical data
npm run backtest

# With coverage report
npm run test:coverage
```

## Performance Analyzer

Access the analyzer dashboard at `http://localhost:3000` and select **Analyzer** to view:
- **Win rate & trade KPIs**
- **Daily P&L, win/loss, and volume charts**
- **Performance by category**
- **Top performing trades**
- **Full trade history table**
- **Top Polymarket probabilities** (by volume)

## API Endpoints

### Core Endpoints
- `GET /health` — Server health check
- `GET /api/status` — API status
- `GET /api/markets/top` — Top markets by volume (Polymarket)
- `POST /api/positions/open` — Create new position
- `GET /api/positions` — View positions and balance
- `POST /api/positions/:id/close` — Close position
- `GET /api/analyzer/metrics` — Metrics summary

### Analyzer Endpoints
- `GET /api/analyzer/metrics` — Overall performance metrics (hit rate, win ratio)
- `GET /api/analyzer/trades` — Detailed trade list with outcomes
- `GET /api/analyzer/equity` — Equity curve data for charting
- `GET /api/analyzer/backtest/:id` — Backtest results

## WebSocket

Real-time market snapshot via WebSocket:
- `ws://localhost:3001/ws/markets?tokenId=...`

## Development Workflow

### Adding a New Feature
1. Create feature branch from `main`
2. Implement in `backend/src` (or `frontend/src`)
3. Write tests in `backend/tests`
4. Update dashboard components as needed
5. Merge with passing tests

### Running Backtest
```bash
npm run backtest -- --strategy volatility --start-date 2024-01-01 --end-date 2024-12-31
```

Outputs detailed report with hit rate, max drawdown, Sharpe ratio, and trade-by-trade breakdown.

## Architecture

### Backend Flow
1. **Market Data Ingestion** → WebSocket subscriptions to Polymarket
2. **Signal Detection** → Volatility algorithm detects buy opportunities
3. **Position Management** → Execute trades, track entry/exit
4. **Risk Control** → Auto stop-loss, daily loss limits
5. **Analytics** → Log all trades, compute hit rate metrics
6. **Real-Time Broadcast** → Send updates to frontend via WebSocket

### Frontend Stack
- **React 18** — UI components
- **Zustand** — State management (live prices, positions, alerts)
- **Recharts** — Data visualization (price charts, equity curves, heatmaps)
- **TailwindCSS** — Styling
- **Vite** — Fast build & dev server

## Troubleshooting

**Backend won't start:**
- Check `.env.local` is copied and has valid values
- Verify Node 20+ is installed: `node --version`
- Run `npm install` in root and `backend/` directories

**Frontend doesn't load:**
- Check backend is running on port 3001
- Clear browser cache (`Ctrl+Shift+Delete`)
- Check browser console for errors

**WebSocket connection fails:**
- Ensure backend is running
- Pick a market token ID or use the Analyzer selector
- Verify frontend proxy in `frontend/vite.config.ts`

**Tests fail:**
- Update Polymarket API mocks if endpoints change
- Check database fixtures are created: `backend/tests/fixtures`
- Run `npm run test -- --verbose` for detailed output

## Security Considerations

🔒 **Never commit** `.env.local` or private keys. Use `.env.example` as template.

For production deployment:
- Use hardware wallet (MetaMask, Ledger) instead of private keys
- Enable rate limiting on API routes
- Use HTTPS/WSS (not WS)
- Run behind reverse proxy (nginx)
- Monitor logs for suspicious activity

## Contributing

1. Write tests for all new trading logic
2. Maintain >70% code coverage (Jest threshold)
3. Run `npm run lint` before committing
4. Update README if adding new features

## Performance Targets

Based on realistic Polymarket conditions:
- **Hit Rate Goal**: >55% (better than 50/50 random)
- **Sharpe Ratio**: >1.0 (good risk-adjusted returns)
- **Max Drawdown**: <10% (acceptable losses during downturns)
- **API Latency**: <100ms (market data to decision)

## License

MIT

## Support

- 📖 [Polymarket Docs](https://docs.polymarket.com)
- 💬 [Discord Community](https://discord.gg/polymarket)
- 🐛 [Issue Tracker](https://github.com/yourusername/polymark/issues)

---

## Today’s Accomplishments (Summary)

- Rebuilt the Dashboard and Analyzer layouts to match the current UI spec (cards, charts, tables, sidebar)
- Added a Markets page placeholder and a new Test Lab page with paper-trading metrics and tables
- Implemented market discovery (`/api/markets/top`) for top Polymarket probabilities
- Added a WebSocket market snapshot feed and a selector-based market picker in Analyzer
- Fixed Tailwind/PostCSS configuration and prevented emitted JS artifacts from breaking Vite
- Created docs folder with reflection template and proof placeholder
