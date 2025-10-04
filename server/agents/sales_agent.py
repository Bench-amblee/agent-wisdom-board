"""
Sales Agent - Provides insights based on sales data
"""
from typing import List, Dict
from agents.base_agent import BaseAgent
from data.sales_data import get_sales_context
from services.openai_service import openai_service

class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sales Director",
            role="Sales Strategy and Revenue Expert"
        )

    async def get_context(self) -> str:
        """Get sales data context"""
        return get_sales_context()

    async def generate_response(self, question: str, previous_responses: List[Dict[str, str]] = None) -> str:
        """Generate sales-focused response"""
        context = await self.get_context()

        response = await openai_service.generate_agent_response(
            agent_name=self.name,
            agent_role=self.role,
            context=context,
            user_question=question,
            previous_responses=previous_responses
        )

        return response

sales_agent = SalesAgent()
