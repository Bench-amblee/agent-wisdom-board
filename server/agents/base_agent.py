"""
Base agent class for all advisory board agents
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List

class BaseAgent(ABC):
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role

    @abstractmethod
    async def get_context(self) -> str:
        """Get the context data for this agent"""
        pass

    @abstractmethod
    async def generate_response(self, question: str, previous_responses: List[Dict[str, str]] = None) -> str:
        """Generate a response to the question"""
        pass

    def to_dict(self) -> Dict[str, Any]:
        """Convert agent to dictionary representation"""
        return {
            "name": self.name,
            "role": self.role
        }
