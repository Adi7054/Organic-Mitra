"use strict";
require("dotenv").config();
const path = require("path");
const express = require("express");

const healthRoute = require("./routes/health");
const chatRoute = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" })); // photos arrive as base64

// API
app.use("/api/health", healthRoute);
app.use("/api/chat", chatRoute);
app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

// Frontend (static files)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`OrganicMitra running at http://localhost:${PORT}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("ANTHROPIC_API_KEY is not set. Chat and photo check will use offline answers.");
  }
});
