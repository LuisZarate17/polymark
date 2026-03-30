"use strict";
// Hook for API calls
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAPI = void 0;
const react_1 = require("react");
const useAPI = (url, options) => {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetch_ = (0, react_1.useCallback)(async () => {
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
    (0, react_1.useEffect)(() => {
        fetch_();
    }, [fetch_]);
    return { data, loading, error, refetch: fetch_ };
};
exports.useAPI = useAPI;
//# sourceMappingURL=useAPI.js.map