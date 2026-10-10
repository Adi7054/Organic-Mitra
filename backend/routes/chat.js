"use strict";
const router = require("express").Router();

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5";
const MAX_TOKENS = 700;

// Very small in-memory rate limit: 20 requests per minute per IP
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
  list.push(now);
  hits.set(ip, list);
  return list.length > 20;
}

const ALLOWED_IMAGES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

router.post("/", async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(503).json({ error: "AI is not configured on the server" });
  if (rateLimited(req.ip)) return res.status(429).json({ error: "Too many requests" });

  const { messages, image } = req.body || {};
  if (!Array.isArray(messages) || !messages.length || messages.length > 20) {
    return res.status(400).json({ error: "Invalid messages" });
  }

  const clean = messages.map((m) => ({
    role: m && m.role === "assistant" ? "assistant" : "user",
    content: String((m && m.content) || "").slice(0, 8000),
  }));

  if (image) {
    if (!ALLOWED_IMAGES.includes(image.media_type) || typeof image.data !== "string") {
      return res.status(400).json({ error: "Invalid image" });
    }
    const last = clean[clean.length - 1];
    last.content = [
      { type: "image", source: { type: "base64", media_type: image.media_type, data: image.data } },
      { type: "text", text: last.content },
    ];
  }

  try {
    const r = await fetch(API_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: MAX_TOKENS, messages: clean }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error("Anthropic API error", r.status, detail.slice(0, 300));
      return res.status(r.status === 400 ? 400 : 502).json({ error: "AI request failed" });
    }
    const data = await r.json();
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    res.json({ text });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "AI request failed" });
  }
});

module.exports = router;
