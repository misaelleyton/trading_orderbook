import { OrderBook, Order } from "../types/orderbook";
import { MarketDepth, OrderBook as DepthOrderBook } from "../types/market-depth";
import WebSocketService from './websocket.service';
import WSConection from './wsconection.service';
interface respType { error: boolean, msg: string | number }
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
    ): respType {
        const orderBook = this.getOrderBook(pair);
        const orders = type === "buy" ? orderBook.asks : orderBook.bids;
        const resp: respType = { error: false, msg: '' }
        let total = 0;
        let remainingAmount = amount;
        console.log(orders)
        for (const index of Object.keys(orders)) {
            if (remainingAmount <= 0) break;
            const order = orders[index]
            const orderSize = order.amount * order.cnt;
            const size = Math.min(orderSize, remainingAmount);
            remainingAmount -= size;
            total += size * order.price;
        }
        const avg = total / amount;
        if (limit && (type === "buy" ? avg > limit : avg < limit)) {
            resp.error = true;
            resp.msg = 'Price limit out of coverage'
            return resp;
        }
        if (remainingAmount > 0) {
            resp.error = true;
            resp.msg = 'Not enough liquidity'
            return resp;
        }
        resp.msg = avg;
        return resp;
    }

}
