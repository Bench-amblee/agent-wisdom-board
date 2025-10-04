"""
Customer Service Agent - Provides insights based on customer service data
"""
from typing import List, Dict
from agents.base_agent import BaseAgent
from data.customer_service_data import get_customer_service_context
from services.openai_service import openai_service

class CustomerServiceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Customer Success Director",
            role="Customer Experience and Support Expert"
        )

    async def get_context(self) -> str:
        """Get customer service data context"""
        return get_customer_service_context()

    async def generate_response(self, question: str, previous_responses: List[Dict[str, str]] = None) -> str:
        """Generate customer service-focused response"""
        context = await self.get_context()

        response = await openai_service.generate_agent_response(
            agent_name=self.name,
            agent_role=self.role,
            context=context,
            user_question=question,
            previous_responses=previous_responses
        )

        return response

customer_service_agent = CustomerServiceAgent()
