import express from "express";
import { MarketController } from "./controllers/market.controller";

const app = express();
const port = process.env.PORT || 3000;

// Initialize market controller
const marketController = new MarketController();

// Routes
app.get("/", (req, res) => {
    res.send("Market API is up and running");
});

app.get("/orderbook/:pair", marketController.getOrderbook);
app.get("/price/:pair/:operation/:amount/:limit?", marketController.getPrice);

// Start server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

export default app;