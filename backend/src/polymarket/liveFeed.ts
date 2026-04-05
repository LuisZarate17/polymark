import axios from 'axios';
import type { WebSocket } from 'ws';

type BookLevel = {
  price: number;
  size: number;
};

type MarketUpdate = {
  type: 'market';
  tokenId: string;
  ts: string;
  bestBid: number | null;
  bestAsk: number | null;
  midPrice: number | null;
  spreadBps: number | null;
  bids: BookLevel[];
  asks: BookLevel[];
};

type MarketFeedConfig = {
  baseUrl: string;
  tokenId: string;
  intervalMs: number;
};

const parseLevel = (level: any): BookLevel | null => {
  if (!level) return null;
  if (Array.isArray(level)) {
    const price = parseFloat(level[0]);
    const size = parseFloat(level[1]);
    if (Number.isNaN(price) || Number.isNaN(size)) return null;
    return { price, size };
  }

  const price = parseFloat(level.price ?? level.p ?? level["0"]);
  const size = parseFloat(level.size ?? level.s ?? level["1"]);
  if (Number.isNaN(price) || Number.isNaN(size)) return null;
  return { price, size };
};

const normalizeLevels = (levels: any[], limit = 5): BookLevel[] => {
  if (!Array.isArray(levels)) return [];
  return levels
    .map(parseLevel)
    .filter((lvl): lvl is BookLevel => Boolean(lvl))
    .slice(0, limit);
};

export class LiveMarketFeed {
  private readonly baseUrl: string;
  private readonly tokenId: string;
  private readonly intervalMs: number;
  private timer: NodeJS.Timeout | null = null;
  private clients = new Set<WebSocket>();

  constructor(config: MarketFeedConfig) {
    this.baseUrl = config.baseUrl;
    this.tokenId = config.tokenId;
    this.intervalMs = config.intervalMs;
  }

  addClient(ws: WebSocket): void {
    this.clients.add(ws);
    if (!this.timer) {
      this.start();
    }
  }

  removeClient(ws: WebSocket): void {
    this.clients.delete(ws);
    if (this.clients.size === 0) {
      this.stop();
    }
  }

  private start(): void {
    this.timer = setInterval(() => {
      this.tick().catch(() => undefined);
    }, this.intervalMs);
    this.tick().catch(() => undefined);
  }

  private stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  private async tick(): Promise<void> {
    const url = `${this.baseUrl}/orderbook?token_id=${this.tokenId}`;
    const response = await axios.get(url, { timeout: 5000 });
    const bids = normalizeLevels(response.data?.bids ?? []);
    const asks = normalizeLevels(response.data?.asks ?? []);

    const bestBid = bids[0]?.price ?? null;
    const bestAsk = asks[0]?.price ?? null;
    const midPrice = bestBid !== null && bestAsk !== null ? (bestBid + bestAsk) / 2 : null;
    const spreadBps =
      bestBid !== null && bestAsk !== null && midPrice !== null
        ? ((bestAsk - bestBid) / midPrice) * 10000
        : null;

    const payload: MarketUpdate = {
      type: 'market',
      tokenId: this.tokenId,
      ts: new Date().toISOString(),
      bestBid,
      bestAsk,
      midPrice,
      spreadBps,
      bids,
      asks,
    };

    const message = JSON.stringify(payload);
    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }
}