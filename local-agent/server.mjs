import "dotenv/config";
import express from "express";

const app = express();

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const LM_STUDIO_URL = (process.env.LM_STUDIO_URL || "http://127.0.0.1:1234").replace(/\/$/, "");
const LM_MODEL = process.env.LM_MODEL;
const LOCAL_AGENT_TOKEN = process.env.LOCAL_AGENT_TOKEN;
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 100000);

if (!LOCAL_AGENT_TOKEN) {
  console.error("Missing LOCAL_AGENT_TOKEN");
  process.exit(1);
}

if (!LM_MODEL) {
  console.error("Missing LM_MODEL. Use the exact model id shown by LM Studio.");
  process.exit(1);
}

app.disable("x-powered-by");
app.use(express.json({ limit: MAX_BODY_BYTES }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "binary-01-local-agent" });
});

app.use((req, res, next) => {
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${LOCAL_AGENT_TOKEN}`) {
    return res.status(401).json({ error: "Unauthorized." });
  }
  next();
});

app.post("/chat", async (req, res) => {
  const messages = req.body?.messages;

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 30) {
    return res.status(400).json({ error: "Invalid messages." });
  }

  for (const message of messages) {
    if (
      !message ||
      typeof message !== "object" ||
      !["user", "assistant", "system"].includes(message.role) ||
      typeof message.content !== "string" ||
      message.content.length > 8000
    ) {
      return res.status(400).json({ error: "Invalid message." });
    }
  }

  try {
    const upstream = await fetch(`${LM_STUDIO_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: LM_MODEL,
        messages,
        temperature: 0.7,
        stream: false
      }),
      signal: AbortSignal.timeout(120_000),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return res.status(502).json({
        error: data?.error?.message || "LM Studio request failed."
      });
    }

    const content = data?.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      return res.status(502).json({ error: "LM Studio returned no assistant text." });
    }

    return res.json({ content });
  } catch (error) {
    console.error(error);
    return res.status(502).json({ error: "LM Studio is unavailable." });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Binary 01 Local Agent: http://${HOST}:${PORT}`);
  console.log(`LM Studio upstream: ${LM_STUDIO_URL}`);
});
