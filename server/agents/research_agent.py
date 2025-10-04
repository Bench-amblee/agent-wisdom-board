"""
Research Agent - Provides insights based on web research using Linkup
"""
from typing import List, Dict
from agents.base_agent import BaseAgent
from services.linkup_service import linkup_service
from services.openai_service import openai_service

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Research Director",
            role="Market Research and External Insights Expert"
        )

    async def get_context(self, question: str = None) -> str:
        """Get research context by searching the web"""
        if not question:
            return "No research conducted yet. Awaiting specific question."

        # Use Linkup to search for relevant information
        search_results = await linkup_service.search_results(question, max_results=5)

        if not search_results:
            return "No external research data available."

        context = "Recent Web Research Findings:\n\n"
        for idx, result in enumerate(search_results, 1):
            title = result.get('title', 'Untitled')
            snippet = result.get('snippet', result.get('description', 'No description'))
            url = result.get('url', '')
            context += f"{idx}. {title}\n   {snippet}\n   Source: {url}\n\n"

        return context

    async def generate_response(self, question: str, previous_responses: List[Dict[str, str]] = None) -> str:
        """Generate research-focused response using web data"""
        # First, get external research context
        context = await self.get_context(question)

        # Enhance the system prompt for research agent
        system_prompt = f"""You are {self.name}, a {self.role} on an advisory board.
Your role is to provide external market insights and research-based recommendations.

You have access to current web research data:
{context}

Guidelines:
- Use the web research data to provide outside perspectives
- Compare external trends with internal perspectives from other advisors
- Cite specific sources when making claims
- Provide data-driven insights
- Challenge internal assumptions with external data when appropriate
"""

        messages = [{"role": "system", "content": system_prompt}]

        # Add previous responses for context
        if previous_responses:
            conversation_context = "Internal advisor responses:\n\n"
            for resp in previous_responses:
                conversation_context += f"{resp['agent']}: {resp['response']}\n\n"
            messages.append({"role": "assistant", "content": conversation_context})

        messages.append({"role": "user", "content": question})

        return await openai_service.generate_response(messages, temperature=0.8)

research_agent = ResearchAgent()
