import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://ai-advisor-board.vercel.app',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Request size limits to prevent abuse
app.use(express.json({ limit: '100kb' }));

// Simple in-memory usage tracker (resets on server restart)
let dailyUsage = {
  date: new Date().toDateString(),
  cost: 0,
  requests: 0,
};

// Reset daily usage if it's a new day
const checkDailyReset = () => {
  const today = new Date().toDateString();
  if (dailyUsage.date !== today) {
    dailyUsage = { date: today, cost: 0, requests: 0 };
  }
};

// Middleware to check daily budget
const budgetCheck = (req, res, next) => {
  checkDailyReset();
  const limit = parseFloat(process.env.DAILY_BUDGET_LIMIT || 0);

  if (limit > 0 && dailyUsage.cost >= limit) {
    return res.status(429).json({
      error: "Daily budget limit reached. Please try again tomorrow.",
      used: dailyUsage.cost,
      limit: limit
    });
  }
  next();
};

// Global rate limiter - configurable from env
const globalLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Aggressive rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15) * 60 * 1000,
  max: parseInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 10,
  message: { error: "AI request limit exceeded. Please wait before making more requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

const PORT = process.env.PORT || 3001;

// Basic health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Usage stats endpoint
app.get("/api/usage", (req, res) => {
  checkDailyReset();
  res.json({
    date: dailyUsage.date,
    requests: dailyUsage.requests,
    estimatedCost: dailyUsage.cost,
    limit: parseFloat(process.env.DAILY_BUDGET_LIMIT || 0),
  });
});

// Example route for OpenAI proxy (with AI rate limiting + budget check)
app.post("/api/openai", aiLimiter, budgetCheck, async (req, res) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(500).json({ error: "OpenAI key not configured" });

  // Validate request body
  if (!req.body.messages || !Array.isArray(req.body.messages)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  // Limit max tokens to prevent expensive requests
  const maxTokensLimit = parseInt(process.env.MAX_TOKENS_PER_REQUEST) || 2000;
  const maxTokens = req.body.max_tokens || 1000;
  if (maxTokens > maxTokensLimit) {
    return res.status(400).json({ error: `max_tokens cannot exceed ${maxTokensLimit}` });
  }

  try {
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...req.body,
        max_tokens: maxTokens,
      }),
    });

    const data = await openaiResp.json();

    // Track usage (rough estimate: $0.002 per request for gpt-3.5-turbo)
    dailyUsage.requests++;
    const estimatedCost = 0.002; // Adjust based on your model
    dailyUsage.cost += estimatedCost;

    res.status(openaiResp.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI proxy failed" });
  }
});

// Example route for LinkUp proxy (with AI rate limiting)
app.post("/api/linkup", aiLimiter, async (req, res) => {
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

// Example route for Airia proxy (with AI rate limiting)
app.post("/api/airia", aiLimiter, async (req, res) => {
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
