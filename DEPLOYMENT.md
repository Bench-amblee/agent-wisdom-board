# Deployment Guide

## Free Backend Hosting on Render.com

### 1. Prepare Your Repository

Make sure your code is pushed to GitHub/GitLab.

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### 3. Deploy Backend

1. Click **"New +"** → **"Web Service"**
2. Connect your repository
3. Configure:
   - **Name**: `agent-wisdom-board-api` (or your choice)
   - **Root Directory**: `server` (if needed)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Plan**: `Free`

### 4. Environment Variables

Add these in Render dashboard under "Environment":

```
OPENAI_API_KEY=your_key_here
LINKUP_API_KEY=your_key_here
AIRIA_API_KEY=your_key_here
AIRIA_BASE_URL=https://api.airia.ai/v2
AIRIA_SALES_AGENT_ID=your_id_here
AIRIA_CS_AGENT_ID=your_id_here
AIRIA_RESEARCH_AGENT_ID=your_id_here
USE_AIRIA_ORCHESTRATION=false

# Rate Limiting (adjust as needed)
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
AI_RATE_LIMIT_MAX_REQUESTS=10
MAX_TOKENS_PER_REQUEST=2000

# Budget Protection ($5 per day)
DAILY_BUDGET_LIMIT=5
```

### 5. Update Frontend

Update your Vercel frontend to point to the Render backend URL:
```
VITE_API_URL=https://your-app.onrender.com
```

### 6. Test

Visit: `https://your-app.onrender.com/health`

---

## Alternative: Railway.com

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your repo
4. Add same environment variables
5. Railway will auto-detect Node.js

**Note**: Railway gives $5 free credit/month, then charges.

---

## Budget Protection Features

Your server now includes:

### ✅ Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **AI Endpoints**: 10 requests per 15 minutes per IP
- Configurable via environment variables

### ✅ Request Size Limits
- Max request body: 100KB
- Max tokens per request: 2000 (configurable)

### ✅ Daily Budget Cap
- Default: $5/day
- Automatically blocks requests when limit reached
- Resets daily at midnight
- Check usage: `GET /api/usage`

### ✅ Usage Tracking
```bash
curl https://your-app.onrender.com/api/usage
```

Response:
```json
{
  "date": "Sat Oct 04 2025",
  "requests": 42,
  "estimatedCost": 0.084,
  "limit": 5
}
```

---

## Recommendations

1. **Monitor Usage**: Check `/api/usage` regularly
2. **Set OpenAI Limits**: Use OpenAI dashboard to set hard limits
3. **Adjust Rate Limits**: Lower `AI_RATE_LIMIT_MAX_REQUESTS` if needed
4. **Consider Redis**: For production, use Redis for rate limiting (survives server restarts)
5. **Add Authentication**: Consider API keys for public deployments

---

## Render Free Tier Limitations

- **Sleep after 15 min inactivity** (wakes on request, ~30s delay)
- **750 hours/month** (enough for one always-on service)
- **Limited bandwidth** (100GB/month)

For always-on service, consider upgrading to paid tier (~$7/month).
