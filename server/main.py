"""
FastAPI backend for AI Agent Advisory Board
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Dict, Any, Literal
from pydantic import BaseModel, Field, ValidationError
import asyncio

from models import QuestionRequest, BoardDiscussion, HealthResponse
from agents.sales_agent import sales_agent
from agents.customer_service_agent import customer_service_agent
from agents.research_agent import research_agent
from orchestrator import orchestrator
from services.openai_service import openai_service

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


class ReportInput(BaseModel):
    summary: str
    key_points: List[str]
    agent_metrics: Dict[str, Any]
    recommendations: List[str]


class PrioritizedTask(BaseModel):
    title: str = Field(description="The clear, actionable task title.")
    priority: Literal["Now", "Next", "Later"] = Field(
        description="Either 'Now', 'Next', or 'Later'."
    )
    reasoning: str = Field(description="Brief justification for the priority.")


class AnalysisOutput(BaseModel):
    consensus: str = Field(description="A 2-3 sentence synthesis of the agents' core agreement.")
    action_plan: List[PrioritizedTask]

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


@app.post("/api/analyze-report", response_model=AnalysisOutput, tags=["Analysis"])
async def analyze_report(report: ReportInput):
    """Convert the final report JSON into a prioritized action plan."""

    report_text = (
        "Executive Summary: "
        f"{report.summary}\n"
        f"Key Points: {', '.join(report.key_points)}\n"
        f"Raw Recommendations: {', '.join(report.recommendations)}\n"
        f"Agent Contributions: {report.agent_metrics}"
    )

    system_prompt = (
        "You are a Chief of Staff AI responsible for converting meeting summaries into a "
        "clear, prioritized action plan.\n"
        "Identify the core consensus across agents, then produce a prioritized task list.\n"
        "Use the priorities Now, Next, or Later (1-2 items max for Now)."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": report_text},
    ]

    try:
        raw_response = await openai_service.generate_structured_json(
            messages,
            response_format={"type": "json_object"},
            temperature=0.4,
            max_tokens=800,
        )

        if raw_response.startswith("Error generating response"):
            raise RuntimeError(raw_response)

        return AnalysisOutput.model_validate_json(raw_response)

    except ValidationError as ve:
        raise HTTPException(status_code=500, detail=f"Invalid analysis response: {ve}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
