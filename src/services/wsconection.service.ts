import WS from "ws";
import _ from 'lodash';
const conf = {
    wshost: 'wss://api.bitfinex.com/ws/2'
}
let connected = false;
let connecting = false;
export default class WSConection {
    cli: any;
    intervalHandle = setInterval((): void => {
        if (connected) return;
        this.connect();
    }, 3500);
    constructor() {
        this.cli = new WS(conf.wshost, { /* rejectUnauthorized: false */ })
        this.connect()
        return this.cli
    }
    connect() {
        if (connecting || connected) return
        connecting = true
        this.cli.on('open', (() => {
            console.log('WS open')
            connecting = false
            connected = true
            this.cli.send(JSON.stringify({ event: 'conf', flags: 65536 + 131072 }))
        }).bind(this));

        this.cli.on('close', function open() {
            console.log('WS close')
            connecting = false
            connected = false
        })
    }
    getConection() {
        return this.cli
    }
}