import request from "supertest";
import app from "../src/app";

describe("GET /api/orderbook/:pair", () => {
    it("should return the order book for BTC-USD", async () => {
        const response = await request(app).get("/api/orderbook/BTC-USD");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("bids");
        expect(response.body).toHaveProperty("asks");
    });

    it("should return the order book for ETH-USD", async () => {
        const response = await request(app).get("/api/orderbook/ETH-USD");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("bids");
        expect(response.body).toHaveProperty("asks");
    });

    it("should return a 404 error for an unknown trading pair", async () => {
        const response = await request(app).get("/api/orderbook/UNKNOWN-PAIR");
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("error");
    });
});

describe("GET /api/effective-price", () => {
    it("should calculate the effective price for a buy order of 0.1 BTC-USD", async () => {
        const response = await request(app).get("/api/effective-price").query({
            pair: "BTC-USD",
            type: "buy",
            amount: 0.1,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("effectivePrice");
    });

    it("should calculate the effective price for a sell order of 100 ETH-USD with a limit of 2000", async () => {
        const response = await request(app).get("/api/effective-price").query({
            pair: "ETH-USD",
            type: "sell",
            amount: 100,
            limit: 2000,
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("effectivePrice");
    });

    it("should return a 400 error for a missing required parameter", async () => {
        const response = await request(app).get("/api/effective-price").query({
            pair: "BTC-USD",
            type: "buy",
        });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });

    it("should return a 500 error for an invalid parameter value", async () => {
        const response = await request(app).get("/api/effective-price").query({
            pair: "BTC-USD",
            type: "invalid",
            amount: 0.1,
        });
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("error");
    });
});