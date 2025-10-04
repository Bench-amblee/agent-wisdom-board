"""
FastAPI backend for AI Agent Advisory Board
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Dict
import asyncio

from models import QuestionRequest, BoardDiscussion, HealthResponse
from agents.sales_agent import sales_agent
from agents.customer_service_agent import customer_service_agent
from agents.research_agent import research_agent
from orchestrator import orchestrator

app = FastAPI(
    title="AI Agent Advisory Board",
    description="Multi-agent advisory board using OpenAI, Airia, and Linkup",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agent registry
AGENTS = {
    "sales": sales_agent,
    "customer_service": customer_service_agent,
    "research": research_agent
}

@app.get("/", tags=["Health"])
async def root():
    return {"message": "AI Agent Advisory Board API", "version": "1.0.0"}

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "openai": "configured",
            "airia": "configured",
            "linkup": "configured"
        }
    }

@app.post("/api/advisory-board/discuss", response_model=BoardDiscussion, tags=["Advisory Board"])
async def discuss_question(request: QuestionRequest):
    """
    Submit a question to the advisory board for multi-round discussion

    Discussion Flow:
    1. Research Phase - Each agent gathers context from their data sources
    2. Initial Presentation - Each agent presents their case (sequential)
    3. Deliberation Rounds (3x) - Agents debate and refine positions
    4. Final Synthesis - OpenAI creates comprehensive report with metrics

    Returns detailed discussion with all rounds and final analysis.
    """
    try:
        discussion = await orchestrator.conduct_discussion(request.question)
        return discussion

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in board discussion: {str(e)}")

@app.post("/api/advisory-board/quick-discuss", tags=["Advisory Board"])
async def quick_discuss_question(request: QuestionRequest):
    """
    Quick discussion mode - single round without deliberation

    Agents provide quick takes without back-and-forth.
    Useful for faster responses when full deliberation isn't needed.
    """
    try:
        question = request.question

        # Run all agents in parallel
        tasks = [
            sales_agent.generate_response(question),
            customer_service_agent.generate_response(question),
            research_agent.generate_response(question)
        ]

        responses = await asyncio.gather(*tasks)

        # Build simple response
        agent_summaries = []
        for idx, agent in enumerate([sales_agent, customer_service_agent, research_agent]):
            agent_summaries.append({
                "agent": agent.name,
                "role": agent.role,
                "response": responses[idx]
            })

        return {
            "question": question,
            "mode": "quick",
            "agents": agent_summaries
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in quick discussion: {str(e)}")

@app.get("/api/agents", tags=["Agents"])
async def list_agents():
    """Get list of available agents"""
    return {
        "agents": [
            {
                "id": key,
                "name": agent.name,
                "role": agent.role
            }
            for key, agent in AGENTS.items()
        ]
    }

@app.post("/api/agent/{agent_id}/ask", tags=["Agents"])
async def ask_single_agent(agent_id: str, request: QuestionRequest):
    """Ask a question to a single agent"""
    if agent_id not in AGENTS:
        raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")

    agent = AGENTS[agent_id]
    response = await agent.generate_response(request.question)

    return {
        "agent": agent.name,
        "role": agent.role,
        "response": response,
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
