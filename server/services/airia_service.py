"""
Airia service for agent orchestration and coordination
"""
import httpx
from typing import List, Dict, Any, Optional
from config import settings

class AiriaService:
    def __init__(self):
        self.base_url = settings.airia_base_url
        self.api_key = settings.airia_api_key
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    async def create_agent(self, name: str, role: str, instructions: str) -> Dict[str, Any]:
        """
        Create an agent in Airia

        Args:
            name: Agent name
            role: Agent role
            instructions: Agent instructions/system prompt

        Returns:
            Created agent details
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/agents",
                    headers=self.headers,
                    json={
                        "name": name,
                        "role": role,
                        "instructions": instructions
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Airia API error creating agent: {e}")
                return {"error": str(e)}

    async def orchestrate_discussion(
        self,
        question: str,
        agents: List[Dict[str, Any]],
        context: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Orchestrate a multi-agent discussion using Airia

        Args:
            question: The question to discuss
            agents: List of agent configurations
            context: Optional context for each agent

        Returns:
            Orchestrated discussion results
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/orchestrate",
                    headers=self.headers,
                    json={
                        "question": question,
                        "agents": agents,
                        "context": context or {},
                        "mode": "sequential"  # Can be "sequential" or "parallel"
                    },
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Airia API error orchestrating discussion: {e}")
                return {"error": str(e)}

    async def run_workflow(
        self,
        workflow_id: str,
        inputs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Run a predefined workflow in Airia

        Args:
            workflow_id: ID of the workflow to run
            inputs: Input parameters for the workflow

        Returns:
            Workflow execution results
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/workflows/{workflow_id}/run",
                    headers=self.headers,
                    json=inputs,
                    timeout=60.0
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPError as e:
                print(f"Airia API error running workflow: {e}")
                return {"error": str(e)}

    async def coordinate_agents(
        self,
        question: str,
        agent_responses: List[Dict[str, str]]
    ) -> str:
        """
        Use Airia to coordinate and synthesize agent responses

        Args:
            question: Original question
            agent_responses: List of responses from different agents

        Returns:
            Synthesized coordination response
        """
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/coordinate",
                    headers=self.headers,
                    json={
                        "question": question,
                        "responses": agent_responses,
                        "mode": "synthesize"
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                result = response.json()
                return result.get("synthesis", "")
            except httpx.HTTPError as e:
                print(f"Airia API error coordinating: {e}")
                # Fallback to simple synthesis if Airia fails
                return self._fallback_synthesis(agent_responses)

    def _fallback_synthesis(self, agent_responses: List[Dict[str, str]]) -> str:
        """Fallback synthesis when Airia is unavailable"""
        synthesis = "Advisory Board Summary:\n\n"
        for resp in agent_responses:
            synthesis += f"**{resp['agent']}**: {resp['response']}\n\n"
        return synthesis

airia_service = AiriaService()
