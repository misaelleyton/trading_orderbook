interface OrderBook {
    buy: Order[];
    sell: Order[];
}

interface Order {
    price: number;
    size: number;
}

export { OrderBook, Order };