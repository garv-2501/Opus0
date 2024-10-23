// backend/controllers/openaiController.js

const { generateResponse } = require("../services/openaiService");

const handleWebSocketConnection = (ws) => {
  ws.on("message", async (message) => {
    const { messages } = JSON.parse(message);
    try {
      await generateResponse(messages, ws);
    } catch (error) {
      console.error(error.message);
      ws.send(`[ERROR] ${error.message}`);
    }
  });
};

module.exports = {
  handleWebSocketConnection,
};
