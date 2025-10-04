import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

// Basic health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Example route for OpenAI proxy
app.post("/api/openai", async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "OpenAI key not configured" });

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await openaiResp.json();
    res.status(openaiResp.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI proxy failed" });
  }
});

// Example route for LinkUp proxy
app.post("/api/linkup", async (req, res) => {
  const key = process.env.LINKUP_API_KEY;
  if (!key) return res.status(500).json({ error: "LinkUp key not configured" });

  try {
    const linkupResp = await fetch("https://api.linkup.example/v1/endpoint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await linkupResp.json();
    res.status(linkupResp.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "LinkUp proxy failed" });
  }
});

// Example route for Airia proxy
app.post("/api/airia", async (req, res) => {
  const key = process.env.AIRIA_API_KEY;
  if (!key) return res.status(500).json({ error: "Airia key not configured" });

  try {
    const airiaResp = await fetch("https://api.airia.example/v1/endpoint", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const data = await airiaResp.json();
    res.status(airiaResp.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Airia proxy failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
