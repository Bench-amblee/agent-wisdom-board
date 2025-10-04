# AI Agent Advisory Board - Setup Guide

## Quick Start

This guide will help you set up and run the AI Agent Advisory Board with all three services: OpenAI, Airia, and Linkup.

## Prerequisites

- **Node.js** (v18 or higher)
- **Python** (3.9 or higher)
- **pip** (Python package manager)
- API Keys for:
  - OpenAI
  - Airia
  - Linkup

## Step 1: Install Dependencies

### Frontend Dependencies (Node.js)
```bash
npm install
```

### Backend Dependencies (Python)
```bash
cd server
pip install -r requirements.txt
```

## Step 2: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Edit `.env` and add your real API keys:
```env
OPENAI_API_KEY=sk-your-openai-key-here
LINKUP_API_KEY=your-linkup-key-here
AIRIA_API_KEY=your-airia-key-here
```

### Getting API Keys

#### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key to your `.env` file

#### Linkup
1. Go to https://linkup.so (or your Linkup provider)
2. Sign up/login and navigate to API settings
3. Generate an API key
4. Copy the key to your `.env` file

#### Airia
1. Go to https://airia.com (or your Airia provider)
2. Sign up/login and navigate to API settings
3. Generate an API key
4. Copy the key to your `.env` file

## Step 3: Configure Airia Agents (Optional but Recommended)

While the system will work without this step, for optimal orchestration, you should create agents in your Airia dashboard:

### Agent 1: Sales Director
- **Name**: Sales Director
- **Role**: Sales Strategy and Revenue Expert
- **Instructions**:
  ```
  You are a sales strategy expert on an advisory board. Provide insights based on sales data including revenue, pipeline, customer metrics, and deal performance. Be data-driven and reference specific numbers when available.
  ```

### Agent 2: Customer Success Director
- **Name**: Customer Success Director
- **Role**: Customer Experience and Support Expert
- **Instructions**:
  ```
  You are a customer experience expert on an advisory board. Provide insights based on support metrics, customer satisfaction scores, service issues, and feedback. Focus on improving customer retention and satisfaction.
  ```

### Agent 3: Research Director
- **Name**: Research Director
- **Role**: Market Research and External Insights Expert
- **Instructions**:
  ```
  You are a market research expert on an advisory board. Provide external insights based on web research, industry trends, and competitive analysis. Challenge internal assumptions with external data when appropriate.
  ```

## Step 4: Run the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run start:dev
```

This will start:
- Frontend (Vite) on http://localhost:5173
- Backend (FastAPI) on http://localhost:8000

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run fastapi
```

Or directly with uvicorn:
```bash
cd server
uvicorn main:app --reload --port 8000
```

## Step 5: Verify Setup

### Check Backend Health
Open http://localhost:8000/health in your browser. You should see:
```json
{
  "status": "healthy",
  "services": {
    "openai": "configured",
    "airia": "configured",
    "linkup": "configured"
  }
}
```

### Check API Documentation
Visit http://localhost:8000/docs for interactive Swagger UI documentation.

### Check Frontend
Open http://localhost:5173 in your browser to access the frontend.

## Step 6: Test the Advisory Board

### Using the API directly

**Test Sequential Discussion:**
```bash
curl -X POST http://localhost:8000/api/advisory-board/discuss \
  -H "Content-Type: application/json" \
  -d '{"question": "How can we improve customer retention?", "include_research": true}'
```

**Test Parallel Discussion:**
```bash
curl -X POST http://localhost:8000/api/advisory-board/parallel-discuss \
  -H "Content-Type: application/json" \
  -d '{"question": "What are our biggest sales opportunities?", "include_research": true}'
```

**Test Single Agent:**
```bash
curl -X POST http://localhost:8000/api/agent/sales/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is our current revenue performance?"}'
```

### Using the Frontend

The frontend already has the API client set up in `src/api/backendClient.ts`. You can use these functions in your React components:

```typescript
import { askAdvisoryBoard, askAdvisoryBoardParallel, listAgents } from '@/api/backendClient';

// Sequential discussion
const discussion = await askAdvisoryBoard("How can we grow revenue?", true);

// Parallel discussion
const parallelDiscussion = await askAdvisoryBoardParallel("What are market trends?", true);

// List agents
const { agents } = await listAgents();
```

## Architecture Overview

### How It Works

1. **User submits a question** via the frontend or API
2. **Agent coordination** happens in one of two modes:
   - **Sequential**: Agents respond in order (Sales → Customer Service → Research), each seeing previous responses
   - **Parallel**: All agents respond simultaneously without seeing each other
3. **Each agent processes the question**:
   - **Sales Agent**: Analyzes sales data (revenue, pipeline, deals)
   - **Customer Service Agent**: Analyzes support data (tickets, satisfaction, issues)
   - **Research Agent**: Searches the web via Linkup for external insights
4. **Airia orchestrates and synthesizes** all responses into a coherent advisory board discussion
5. **Results are returned** to the frontend with all agent responses and synthesis

### Data Flow

```
User Question
    ↓
Frontend (React)
    ↓
FastAPI Backend (/api/advisory-board/discuss)
    ↓
┌─────────────┬──────────────────┬────────────────┐
│             │                  │                │
Sales Agent   Customer Service   Research Agent
(Internal)    (Internal)         (Linkup Search)
    ↓              ↓                   ↓
OpenAI        OpenAI             Linkup → OpenAI
    ↓              ↓                   ↓
└─────────────┴──────────────────┴────────────────┘
                      ↓
            Airia Orchestration
            (Synthesis & Coordination)
                      ↓
                 Final Response
                      ↓
                  Frontend
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.9+ is installed: `python --version`
- Ensure all dependencies are installed: `pip install -r server/requirements.txt`
- Check that port 8000 is not in use

### API Key Errors
- Verify all keys are in `.env` file
- Ensure no extra spaces or quotes around keys
- Check that `.env` is in the project root directory

### CORS Errors
- The backend is configured to allow `localhost:5173` and `localhost:3000`
- If using a different port, update CORS settings in `server/main.py`

### Linkup Search Fails
- Verify Linkup API key is correct
- Check Linkup API endpoint in `server/config.py`
- The system will still work without Linkup, but Research agent will have limited data

### Airia Coordination Fails
- The system has a fallback synthesis mechanism
- It will still combine agent responses even if Airia is unavailable
- Check Airia API key and endpoint configuration

## Next Steps

1. **Customize the data**: Edit `server/data/sales_data.py` and `server/data/customer_service_data.py` to match your business
2. **Add more agents**: Create new agent classes in `server/agents/`
3. **Build the UI**: Connect the frontend components to the API
4. **Deploy**: Deploy the FastAPI backend and React frontend to your hosting platform

## API Endpoints Reference

- `GET /health` - Health check
- `GET /api/agents` - List all agents
- `POST /api/advisory-board/discuss` - Sequential discussion
- `POST /api/advisory-board/parallel-discuss` - Parallel discussion
- `POST /api/agent/{agent_id}/ask` - Ask single agent

Full API documentation: http://localhost:8000/docs

## Support

If you encounter issues:
1. Check the backend logs for errors
2. Verify all API keys are valid
3. Ensure all dependencies are installed
4. Review the troubleshooting section above

For questions about specific services:
- **OpenAI**: https://platform.openai.com/docs
- **Airia**: Check your Airia documentation
- **Linkup**: Check your Linkup documentation
