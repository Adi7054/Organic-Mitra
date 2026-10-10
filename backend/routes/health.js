"use strict";
const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ ok: true, ai: Boolean(process.env.ANTHROPIC_API_KEY) });
});

module.exports = router;
