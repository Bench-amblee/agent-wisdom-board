"""
OpenAI service for agent responses
"""
from openai import AsyncOpenAI
from typing import List, Dict, Any
from config import settings

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"

    async def generate_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> str:
        """
        Generate a response using OpenAI's chat completion

        Args:
            messages: List of message objects with 'role' and 'content'
            temperature: Sampling temperature (0-2)
            max_tokens: Maximum tokens in response

        Returns:
            Generated response text
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return f"Error generating response: {str(e)}"

    async def generate_agent_response(
        self,
        agent_name: str,
        agent_role: str,
        context: str,
        user_question: str,
        previous_responses: List[Dict[str, str]] = None
    ) -> str:
        """
        Generate a response from a specific agent

        Args:
            agent_name: Name of the agent
            agent_role: Role/specialty of the agent
            context: Context data for the agent
            user_question: The user's question
            previous_responses: Optional previous responses from other agents

        Returns:
            Agent's response
        """
        system_prompt = f"""You are {agent_name}, a {agent_role} expert on an advisory board.
Your role is to provide insights and recommendations based on your expertise and the data available to you.

Current Data Context:
{context}

Guidelines:
- Be concise but thorough
- Reference specific data points when relevant
- Provide actionable insights
- If other advisors have responded, build on or challenge their points constructively
"""

        messages = [{"role": "system", "content": system_prompt}]

        # Add previous responses for context
        if previous_responses:
            conversation_context = "Previous advisor responses:\n\n"
            for resp in previous_responses:
                conversation_context += f"{resp['agent']}: {resp['response']}\n\n"
            messages.append({"role": "assistant", "content": conversation_context})

        messages.append({"role": "user", "content": user_question})

        return await self.generate_response(messages, temperature=0.8)

openai_service = OpenAIService()
