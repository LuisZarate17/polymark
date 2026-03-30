# Polymarket Trading Dashboard - Copilot Instructions

This is a full-stack Node.js + React application for automated Polymarket trading with live analytics.

## Project Overview
- **Backend**: Express.js + Polymarket CLOB client, WebSocket data pipeline, trading rules engine, backtester
- **Frontend**: React 18 + Recharts, real-time dashboard and analyzer views
- **Database**: SQLite (dev), PostgreSQL (production)
- **Testing**: Jest unit tests, Supertest integration, custom backtest suite

## Key Development Areas

### Backend (`backend/src/`)
- **index.ts** — Express server, HTTP routes, WebSocket setup
- **api/** — REST endpoints for positions, trades, analyzer
- **trading/** — Volatility detection, position sizing, stop-loss logic
- **polymarket/** — CLOB client wrapper, authentication, market data
- **database/** — SQLite/PostgreSQL ORM layer
- **analyzer/** — Hit rate calculation, performance metrics
- **backtest/** — Historical data replay, strategy testing

### Frontend (`frontend/src/`)
- **App.tsx** — Main app layout
- **pages/** — Dashboard, analyzer, settings pages
- **components/** — Reusable UI components (charts, tables, forms)
- **hooks/** — WebSocket connection, API calls (useWebSocket, useAPI)
- **store/** — Zustand stores for global state (prices, positions, alerts)

### Configuration
- **.env.local** — Copy from .env.example and add Polymarket API key + wallet private key
- **backend/jest.config.js** — Unit test config (70% coverage threshold)
- **frontend/vite.config.ts** — Vite dev server with API proxy
- **docker-compose.yml** — Multi-container setup (PostgreSQL, Redis, containers)

## Common Tasks

**Start local dev:**
```bash
npm install
npm run dev
```

**Run tests:**
```bash
npm run test                 # All tests
npm run test:backend        # Backend unit tests
npm run test:integration    # Integration tests with mocks
npm run backtest            # Backtest strategy
```

**Build for production:**
```bash
npm run build               # Build both backend & frontend
docker-compose up           # Start containerized app
```

**Add new trading rule:**
1. Create logic in `backend/src/trading/[ruleName].ts`
2. Add unit tests in `backend/tests/[ruleName].test.ts`
3. Integrate into main trading loop in `backend/src/trading/engine.ts`
4. Update .env parameters if needed

**Add new dashboard view:**
1. Create component in `frontend/src/pages/[ViewName].tsx`
2. Add route in `frontend/src/App.tsx`
3. Connect to Zustand store for data
4. Call backend API via `useAPI` hook

## Polymarket Integration

- Uses [@polymarket/clob-client](https://docs.polymarket.com) for order placement & market data
- WebSocket connection for real-time orderbook updates
- Authentication via PRIVATE_KEY in .env
- Test mode available via testnet (set POLYMARKET_CHAIN_ID=80001)

## Testing Strategy

- **Unit Tests**: Signal detection, position sizing, risk logic
- **Integration Tests**: Mock Polymarket API, test order flow
- **Backtest Tests**: Historical data, measure hit rate and P&L
- **E2E**: Manual — connect dashboard to testnet, place test orders

## Deployment

**Local (manual):**
```bash
npm run build:backend && npm run build:frontend
npm run start:backend  # Terminal 1
cd frontend && npm run preview  # Terminal 2
```

**Docker (recommended):**
```bash
copy .env.example .env
docker-compose build
docker-compose up
```

**Cloud (AWS/DigitalOcean/Railway):**
- Push to repo
- CI/CD trigger builds Docker image
- Deploy via docker-compose or Kubernetes

## Debugging

- **Backend logs**: `backend/logs/combined.log` or terminal output
- **Frontend**: Browser DevTools (Console, Network, React Dev Tools)
- **WebSocket**: Monitor in Network tab (filter: ws)
- **Database**: SQLite — open `data/trading.db` with SQLite browser
- **API responses**: Postman or `curl` to `http://localhost:3001/api/*`

## Coverage Requirements

Backend must maintain >70% code coverage:
- Critical paths: Trading logic, signal detection, risk management
- Less critical: Logging, error handlers

Run with: `npm run test:coverage`
