const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    // 🔥 SSE headers (streaming)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-oss:120b",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      res.write(`data: ERROR: ${response.statusText}\n\n`);
      return res.end();
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // forward chunk to frontend
      res.write(`data: ${chunk}\n\n`);
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    res.write(`data: ERROR: ${err.message}\n\n`);
    res.end();
  }
});

module.exports = router;
