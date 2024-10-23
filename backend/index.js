// backend/index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const apiRoutes = require("./routes/apiRoutes");
const { handleWebSocketConnection } = require("./controllers/openaiController");
const { WebSocketServer } = require("ws");

// Initialize the Express app
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Use API routes
app.use("/api", apiRoutes);

// Create WebSocket server
const wss = new WebSocketServer({ noServer: true });

wss.on("connection", handleWebSocketConnection);

// Integrate WebSocket server with HTTP server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});
