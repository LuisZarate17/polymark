import { useEffect, useMemo, useState } from 'react';

type MarketUpdate = {
  type: 'market';
  tokenId: string;
  ts: string;
  bestBid: number | null;
  bestAsk: number | null;
  midPrice: number | null;
  spreadBps: number | null;
  bids: { price: number; size: number }[];
  asks: { price: number; size: number }[];
};

type MarketError = {
  type: 'error';
  message: string;
};

export const useMarketStream = (tokenIdOverride?: string) => {
  const [data, setData] = useState<MarketUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const wsUrl = useMemo(() => {
    const tokenId = tokenIdOverride || (import.meta.env.VITE_POLYMARKET_TOKEN_ID as string | undefined);
    if (!tokenId) return null;
    const base = 'ws://localhost:3001/ws/markets';
    return `${base}?tokenId=${encodeURIComponent(tokenId)}`;
  }, [tokenIdOverride]);

  useEffect(() => {
    if (!wsUrl) {
      setConnected(false);
      setError(null);
      return;
    }

    let ws: WebSocket | null = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnected(true);
      setError(null);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    ws.onerror = () => {
      setError('WebSocket connection error');
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as MarketUpdate | MarketError;
        if (payload.type === 'error') {
          setError(payload.message);
          return;
        }
        setData(payload as MarketUpdate);
      } catch (err) {
        setError('Invalid market data');
      }
    };

    return () => {
      ws?.close();
      ws = null;
    };
  }, [wsUrl]);

  return { data, error, connected };
};