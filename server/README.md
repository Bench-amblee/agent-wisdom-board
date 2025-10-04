# AI Agent Advisory Board - FastAPI Backend

## Overview

A sophisticated multi-agent advisory board system that combines:
- **OpenAI** for intelligent agent responses
- **Airia** for agent orchestration and coordination
- **Linkup** for web research capabilities

## Architecture

### Agents

1. **Sales Director** (`sales_agent`)
   - Role: Sales Strategy and Revenue Expert
   - Data Source: Internal sales data (fake data in `data/sales_data.py`)
   - Provides insights on revenue, pipeline, customer metrics

2. **Customer Success Director** (`customer_service_agent`)
   - Role: Customer Experience and Support Expert
   - Data Source: Internal customer service data (fake data in `data/customer_service_data.py`)
   - Provides insights on support metrics, customer satisfaction, issues

3. **Research Director** (`research_agent`)
   - Role: Market Research and External Insights Expert
   - Data Source: Web research via Linkup API
   - Provides external market insights, trends, competitive analysis

### Services

- **OpenAI Service** (`services/openai_service.py`): Generates agent responses using GPT-4
- **Airia Service** (`services/airia_service.py`): Orchestrates multi-agent discussions
- **Linkup Service** (`services/linkup_service.py`): Performs web searches for research

## Setup

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and add your API keys:

```env
OPENAI_API_KEY=your-openai-key-here
LINKUP_API_KEY=your-linkup-key-here
AIRIA_API_KEY=your-airia-key-here
```

### 3. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --port 8000

# Or using Python directly
python main.py
```

The server will start at `http://localhost:8000`

## API Endpoints

### Health Check
- `GET /health` - Check API health and service status

### Advisory Board Discussion
- `POST /api/advisory-board/discuss` - Sequential discussion (agents see previous responses)
- `POST /api/advisory-board/parallel-discuss` - Parallel discussion (independent responses)

Request body:
```json
{
  "question": "How can we improve our customer retention?",
  "include_research": true
}
```

Response:
```json
{
  "question": "How can we improve our customer retention?",
  "agents": [
    {
      "agent": "Sales Director",
      "role": "Sales Strategy and Revenue Expert",
      "response": "Based on our sales data...",
      "timestamp": "2025-10-04T10:30:00"
    },
    ...
  ],
  "synthesis": "Combined insights from all advisors...",
  "research_data": {
    "context": "External research findings..."
  }
}
```

### Individual Agents
- `GET /api/agents` - List all available agents
- `POST /api/agent/{agent_id}/ask` - Ask a single agent

## Discussion Modes

### Sequential Discussion (Recommended)
Endpoint: `/api/advisory-board/discuss`

Agents respond in order, each seeing previous responses:
1. Sales Director provides internal sales perspective
2. Customer Success Director adds customer experience insights
3. Research Director brings external market data and validates/challenges internal views

### Parallel Discussion
Endpoint: `/api/advisory-board/parallel-discuss`

All agents respond simultaneously without seeing each other's responses, then Airia synthesizes the independent perspectives.

## Airia Integration

Airia is used for:
1. **Orchestration**: Managing the flow of multi-agent discussions
2. **Coordination**: Synthesizing responses from multiple agents
3. **Workflow Management**: Running predefined agent workflows

### Setting up Airia Agents

You may need to create agents in your Airia dashboard:

1. **Sales Agent**
   - Name: "Sales Director"
   - Instructions: "You are a sales strategy expert. Provide insights based on sales data including revenue, pipeline, and customer metrics."

2. **Customer Service Agent**
   - Name: "Customer Success Director"
   - Instructions: "You are a customer experience expert. Provide insights based on support metrics, customer satisfaction, and service issues."

3. **Research Agent**
   - Name: "Research Director"
   - Instructions: "You are a market research expert. Provide external insights based on web research and industry trends."

## Linkup Integration

The Research Agent uses Linkup for web search:
- **Search Mode**: Get raw search results
- **Sourced Answer Mode**: Get synthesized answers with sources

Linkup API configuration in `services/linkup_service.py`

## Development

### Project Structure

```
server/
├── main.py                 # FastAPI app entry point
├── config.py              # Configuration and settings
├── models.py              # Pydantic models
├── requirements.txt       # Python dependencies
├── agents/
│   ├── base_agent.py     # Base agent class
│   ├── sales_agent.py    # Sales agent implementation
│   ├── customer_service_agent.py
│   └── research_agent.py
├── services/
│   ├── openai_service.py # OpenAI integration
│   ├── airia_service.py  # Airia orchestration
│   └── linkup_service.py # Linkup search
└── data/
    ├── sales_data.py     # Fake sales data
    └── customer_service_data.py
```

### Adding New Agents

1. Create agent class inheriting from `BaseAgent`
2. Implement `get_context()` and `generate_response()` methods
3. Register agent in `main.py` AGENTS dictionary
4. Add to agent order in discussion endpoints

## API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation.

Visit `http://localhost:8000/redoc` for ReDoc documentation.

## Troubleshooting

### Missing API Keys
Ensure all required keys are in `.env`:
- OPENAI_API_KEY
- LINKUP_API_KEY
- AIRIA_API_KEY

### Airia API Errors
If Airia coordination fails, the system falls back to simple synthesis.

### Linkup Search Fails
If Linkup is unavailable, the Research Agent will return limited insights.

## Next Steps

1. **Create Airia Agents**: Set up agents in your Airia dashboard matching the configuration above
2. **Test Integration**: Use the `/api/advisory-board/discuss` endpoint to test the full flow
3. **Customize Data**: Update fake data in `data/` directory to match your business needs
4. **Add More Agents**: Extend the advisory board with additional specialists
