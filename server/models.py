"""
Pydantic models for API requests and responses
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class QuestionRequest(BaseModel):
    question: str
    include_research: bool = True

class AgentMessage(BaseModel):
    agent: str
    role: str
    message: str
    round_number: int
    message_type: str  # "research", "initial", "rebuttal", "synthesis"
    timestamp: str

class DiscussionRound(BaseModel):
    round_number: int
    round_type: str  # "research", "initial", "deliberation"
    messages: List[AgentMessage]

class FinalReport(BaseModel):
    summary: str
    key_points: List[str]
    agent_metrics: Dict[str, Any]
    recommendations: List[str]

class BoardDiscussion(BaseModel):
    question: str
    rounds: List[DiscussionRound]
    final_report: Optional[FinalReport] = None
    total_rounds: int
    duration_seconds: Optional[float] = None

class HealthResponse(BaseModel):
    status: str
    services: Dict[str, str]
