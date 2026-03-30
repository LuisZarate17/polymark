export interface PolymarketCredentials {
    apiKey: string;
    privateKey: string;
}
export interface MarketOrder {
    tokenID: string;
    price: number;
    size: number;
    side: 'BUY' | 'SELL';
}
export declare class PolymarketClient {
    private client;
    private credentials;
    constructor(credentials: PolymarketCredentials);
    initialize(): Promise<void>;
    getMarkets(): Promise<any[]>;
    getOrderBook(tokenID: string): Promise<{
        bids: any[];
        asks: any[];
    }>;
    placeOrder(order: MarketOrder): Promise<string>;
    cancelOrder(orderId: string): Promise<boolean>;
    getPositions(): Promise<any[]>;
}
export declare const createPolymarketClient: () => PolymarketClient;
//# sourceMappingURL=client.d.ts.map