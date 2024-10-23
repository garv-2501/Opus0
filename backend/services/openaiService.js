const OpenAI = require("openai");
require("dotenv").config(); // Load environment variables from .env file

// Initialize the OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Load the API key from environment variable
});

// Generating the response from OpenAI
const generateResponse = async (messages, ws) => {
  try {
    // Simulate an error
    // throw new Error("Simulated API error");

    // Logic to generate response from OpenAI
    console.log("Processing messages:", messages); // Log the input messages being processed

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      stream: true,
    });

    let fullMessage = "";

    for await (const chunk of response) {
      const content = chunk.choices[0].delta?.content;
      if (content) {
        fullMessage += content;
        ws.send(content);
      }
    }

    console.log("AI Message:", fullMessage); // Log full message
    ws.send("[END]"); // End of streaming
  } catch (error) {
    console.error("Error generating response:", error.message);
    ws.send(`[ERROR] ${error.message}`); // Send error message to client
    // Additionally send a status code if connected via HTTP
    const statusCode = error.response ? error.response.status : 500;
    ws.send(JSON.stringify({ error: error.message, status: statusCode }));
  }
};

module.exports = {
  generateResponse,
};
