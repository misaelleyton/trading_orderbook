import http from "http";
import WebSocketService from "./services/websocket.service";
import app from "./app";

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

WebSocketService.connect();