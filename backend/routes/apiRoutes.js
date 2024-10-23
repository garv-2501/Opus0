// backend/routes/apiRoutes.js

const express = require("express");
const { getOpenAIResponse } = require("../controllers/openaiController");

const router = express.Router();

// Placeholder for POST route if needed
router.post("/generate-response", (req, res) => {
  res.status(200).send("POST route is not implemented.");
});

module.exports = router;
