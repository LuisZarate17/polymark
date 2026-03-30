// Hook for API calls
import { useEffect, useState, useCallback } from 'react';
export const useAPI = (url, options) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetch_ = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            setData(result);
            setError(null);
        }
        catch (err) {
            setError(err.message);
            setData(null);
        }
        finally {
            setLoading(false);
        }
    }, [url, options]);
    useEffect(() => {
        fetch_();
    }, [fetch_]);
    return { data, loading, error, refetch: fetch_ };
};
//# sourceMappingURL=useAPI.js.map