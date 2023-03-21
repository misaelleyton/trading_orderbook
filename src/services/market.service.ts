import { OrderBook, Order } from "../types/orderbook";
import { MarketDepth, OrderBook as DepthOrderBook } from "../types/market-depth";
import WebSocketService from './websocket.service';
import WSConection from './wsconection.service';

export class MarketService {
    static cli = new WSConection();
    static ETH = new WebSocketService('ETHUSD', MarketService.cli);
    static BTC = new WebSocketService('BTCUSD', MarketService.cli);

    static getOrderBook(pair: string): { [index: string]: any } {
        if (pair === 'ETH-USD') return this.ETH.getBook();
        return this.BTC.getBook();

    }

    static getEffectivePrice(
        pair: string,
        type: string,
        amount: number,
        limit?: number,
    ): number {
        const orderBook = this.getOrderBook(pair);
        const orders = type === "buy" ? orderBook.asks : orderBook.bids;

        let total = 0;
        let remainingAmount = amount;
        for (const index of Object.keys(orders)) {
            if (remainingAmount <= 0) break;
            const order = orders[index]
            if (limit && (type === "buy" ? order.price > limit : order.price < limit)) {
                break;
            }
            const orderSize = order.amount * order.cnt;
            const size = Math.min(orderSize, remainingAmount);
            remainingAmount -= size;
            total += size * order.price;
        }

        if (remainingAmount > 0) {
            throw new Error("Not enough liquidity");
        }

        return total / amount;
    }

}
