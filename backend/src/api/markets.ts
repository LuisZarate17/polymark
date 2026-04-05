import { Router, Request, Response } from 'express';
import axios from 'axios';

type MarketOutcome = {
  label: string;
  price: number | null;
};

type MarketSnapshot = {
  id: string;
  question: string;
  volume: number | null;
  outcomes: MarketOutcome[];
  topOutcome: MarketOutcome | null;
  topProbability: number | null;
};

const normalizeOutcomes = (market: any): MarketOutcome[] => {
  if (Array.isArray(market.outcomes) && Array.isArray(market.outcomePrices)) {
    return market.outcomes.map((label: string, idx: number) => {
      const price = parseFloat(market.outcomePrices[idx]);
      return { label, price: Number.isNaN(price) ? null : price };
    });
  }

  if (Array.isArray(market.outcomes)) {
    return market.outcomes.map((outcome: any) => {
      const label = outcome.label ?? outcome.name ?? outcome.title ?? 'Outcome';
      const price = parseFloat(outcome.price ?? outcome.probability ?? outcome.odds);
      return { label, price: Number.isNaN(price) ? null : price };
    });
  }

  return [];
};

const pickTopOutcome = (outcomes: MarketOutcome[]): MarketOutcome | null => {
  const withPrice = outcomes.filter((o) => o.price !== null);
  if (withPrice.length === 0) return null;

  return withPrice.reduce((best, current) => {
    if (!best || (current.price ?? 0) > (best.price ?? 0)) return current;
    return best;
  }, null as MarketOutcome | null);
};

export const createMarketRoutes = (): Router => {
  const router = Router();

  router.get('/top', async (req: Request, res: Response) => {
    try {
      const baseUrl = process.env.POLYMARKET_MARKETS_URL || 'https://gamma-api.polymarket.com';
      const limit = parseInt(process.env.POLYMARKET_MARKETS_LIMIT || '10', 10);

      const response = await axios.get(`${baseUrl}/markets`, {
        params: {
          limit,
          active: true,
          closed: false,
          sort: 'volume',
          order: 'desc',
        },
        timeout: 8000,
      });

      const markets = Array.isArray(response.data) ? response.data : response.data?.markets;
      const normalized: MarketSnapshot[] = (markets || []).slice(0, limit).map((market: any) => {
        const outcomes = normalizeOutcomes(market);
        const topOutcome = pickTopOutcome(outcomes);
        const topProbability = topOutcome?.price !== null ? topOutcome.price * 100 : null;

        return {
          id: market.id ?? market.market_id ?? market.slug ?? 'unknown',
          question: market.question ?? market.title ?? 'Untitled market',
          volume: typeof market.volume === 'number' ? market.volume : null,
          outcomes,
          topOutcome,
          topProbability,
        };
      });

      res.json({ count: normalized.length, markets: normalized });
    } catch (error) {
      res.status(502).json({
        error: 'Failed to fetch markets',
        message: (error as Error).message,
      });
    }
  });

  return router;
};