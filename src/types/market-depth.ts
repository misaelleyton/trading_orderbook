interface MarketDepth {
    bid: OrderBook[];
    ask: OrderBook[];
}

interface OrderBook {
    rate: number;
    quantity: number;
}

export { MarketDepth, OrderBook };