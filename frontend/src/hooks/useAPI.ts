// Hook for API calls

import { useEffect, useState, useCallback } from 'react';

type UseApiOptions = RequestInit & {
  pollIntervalMs?: number;
};

export const useAPI = (url: string, options?: UseApiOptions) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const shouldShowLoading = data === null;
      if (shouldShowLoading) {
        setLoading(true);
      }
      const { pollIntervalMs, ...requestOptions } = options ?? {};
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          ...options?.headers,
        },
        cache: 'no-store',
        ...requestOptions,
      });

      if (response.status === 304) {
        setError(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url, options, data]);

  useEffect(() => {
    let timer: number | undefined;
    fetch_();

    if (options?.pollIntervalMs && options.pollIntervalMs > 0) {
      timer = window.setInterval(fetch_, options.pollIntervalMs);
    }

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [fetch_, options?.pollIntervalMs]);

  return { data, loading, error, refetch: fetch_ };
};
