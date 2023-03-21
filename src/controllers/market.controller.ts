import { Request, Response } from "express";
import { MarketService } from "../services/market.service";
export class MarketController {
    BITTREX_PAIRS: { [index: string]: string } = {
        "BTC-USD": "BTC-USD",
        "ETH-USD": "ETH-USD",
    };
    OPERATIONS: { [index: string]: string } = {
        "buy": "Allowed",
        "sell": "Allowed",
    };

    getOrderbook = async (req: Request, res: Response) => {
        try {
            const pair = req.params.pair.toUpperCase()
            if (this.BITTREX_PAIRS[pair] === undefined) {
                res.status(404).json({ error: "Trading pair not allowed" });
                return
            }
            const orderbook = await MarketService.getOrderBook(pair)
            const tips = { 'asks': Object.values(orderbook?.bids)[0], 'bids': Object.values(orderbook?.asks)[0] }
            res.json(tips);
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    };

    getPrice = (req: Request, res: Response) => {
        try {
            const pair = req.params.pair.toUpperCase();
            const operation = req.params.operation.toLowerCase();
            const amount = parseFloat(req.params.amount);
            const limitPrice = parseFloat(req.query.limitPrice as string);
            if (this.BITTREX_PAIRS[pair] === undefined) {
                res.status(404).json({ error: "Trading pair not allowed" })
                return
            };
            if (this.OPERATIONS[operation] === undefined) {
                res.status(500).json({ error: "Operation not allowed" });
                return
            }

            const price = MarketService.getEffectivePrice(
                pair,
                operation,
                amount,
                limitPrice
            );
            console.log(price);
            if (price.error) {
                res.status(500).send(price.msg);
            } else {
                res.json({ effectivePrice: price.msg });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    };
}