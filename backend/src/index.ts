import express, { Express, Request, Response } from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import 'express-async-errors';
import dotenv from 'dotenv';
import winston from 'winston';
import { createPositionRoutes } from './api/positions';
import { createAnalyticsRoutes } from './api/analytics';
import { createMarketRoutes } from './api/markets';
import { LiveMarketFeed } from './polymarket/liveFeed';

dotenv.config();

const app: Express = express();
const port = process.env.BACKEND_PORT || 3001;
const wsPath = '/ws/markets';
const marketTokenId = process.env.POLYMARKET_TOKEN_ID || '';
const marketBaseUrl = process.env.POLYMARKET_CLOB_URL || 'https://clob.polymarket.com';
const marketIntervalMs = parseInt(process.env.POLYMARKET_POLL_MS || '2000', 10);

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for frontend
app.use((req: Request, res: Response, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
  });
});

// Position routes
app.use('/api/positions', createPositionRoutes());

// Analytics routes
app.use('/api/analyzer', createAnalyticsRoutes());

// Market discovery routes
app.use('/api/markets', createMarketRoutes());

// Error handling
app.use((err: any, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: wsPath });
const marketFeeds = new Map<string, LiveMarketFeed>();

const getFeed = (tokenId: string): LiveMarketFeed => {
  const existing = marketFeeds.get(tokenId);
  if (existing) return existing;

  const feed = new LiveMarketFeed({
    baseUrl: marketBaseUrl,
    tokenId,
    intervalMs: marketIntervalMs,
  });
  marketFeeds.set(tokenId, feed);
  return feed;
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const tokenId = url.searchParams.get('tokenId') || marketTokenId;

  if (!tokenId) {
    ws.send(
      JSON.stringify({
        type: 'error',
        message: 'Missing POLYMARKET_TOKEN_ID in backend environment',
      })
    );
    ws.close();
    return;
  }

  const feed = getFeed(tokenId);
  feed.addClient(ws);
  ws.on('close', () => feed.removeClient(ws));
});

server.listen(port, () => {
  logger.info(`Backend server running on port ${port}`);
  logger.info(`WebSocket market feed on ${wsPath}`);
});

export default app;
