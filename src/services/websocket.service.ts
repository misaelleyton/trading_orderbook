import WS from "ws";
import _ from 'lodash';
export default class WebsocketService {
    pair: string;
    cli: any;
    channel: number;
    BOOK: { [index: string]: any };
    constructor(pair: string, cli: any) {
        this.BOOK = { bids: {}, asks: {}, psnap: {}, mcnt: {} };
        this.pair = pair;
        this.cli = cli;
        this.channel = 0;
        this.connect();
    }
    getBook() {
        return this.BOOK
    }

    connect() {
        this.cli.on('open', (() => {
            console.log('WS open')
            this.cli.send(JSON.stringify({ event: 'subscribe', channel: 'book', pair: this.pair, prec: 'P0', len: 25 }))
        }).bind(this));
        this.cli.on('message', ((msg: any) => {
            msg = JSON.parse(msg)

            if (msg.event) {
                if (msg.pair === this.pair.toUpperCase()) {
                    this.channel = msg.chanId;
                }
                return
            }
            if (msg[1] === 'hb' || msg[1] === 'cs') return

            if (this.channel !== msg[0]) return

            if (this.BOOK.mcnt === 0) {
                _.each(msg[1], ((pp: { [index: string]: any }) => {
                    pp = { price: pp[0], cnt: pp[1], amount: pp[2] }
                    const side = pp.amount >= 0 ? 'bids' : 'asks'
                    pp.amount = Math.abs(pp.amount)
                    this.BOOK[side][pp.price] = pp
                }).bind(this));
            } else {
                msg = msg[1]
                let pp = { price: msg[0], cnt: msg[1], amount: msg[2] }

                if (!pp.cnt) {
                    let found = true

                    if (pp.amount > 0) {
                        if (this.BOOK['bids'][pp.price]) {
                            delete this.BOOK['bids'][pp.price]
                        } else {
                            found = false
                        }
                    } else if (pp.amount < 0) {
                        if (this.BOOK['asks'][pp.price]) {
                            delete this.BOOK['asks'][pp.price]
                        } else {
                            found = false
                        }
                    }
                } else {
                    let side = pp.amount >= 0 ? 'bids' : 'asks'
                    pp.amount = Math.abs(pp.amount)
                    this.BOOK[side][pp.price] = pp
                }
            }

            _.each(['bids', 'asks'], ((side: string) => {
                let sbook = this.BOOK[side]
                let bprices = Object.keys(sbook)
                let prices = bprices.sort(function (a, b) {
                    if (side === 'bids') {
                        return +a >= +b ? -1 : 1
                    } else {
                        return +a <= +b ? -1 : 1
                    }
                })

                this.BOOK.psnap[side] = prices
            }).bind(this));

            this.BOOK.mcnt++

        }).bind(this));
    }
}