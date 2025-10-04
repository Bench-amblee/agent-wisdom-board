"""
Discussion Orchestrator - Manages multi-round advisory board discussions

Discussion Flow:
1. Research Phase - Each agent researches using their data/internet
2. Initial Presentation - Each agent states their case
3. Deliberation (3 rounds) - Agents respond to each other
4. Final Synthesis - OpenAI creates comprehensive report

Supports both:
- Custom orchestration (direct OpenAI calls)
- Airia orchestration (using Airia pipelines)
"""
import asyncio
from datetime import datetime
from typing import List, Dict, Any
from models import AgentMessage, DiscussionRound, FinalReport, BoardDiscussion
from agents.sales_agent import sales_agent
from agents.customer_service_agent import customer_service_agent
from agents.research_agent import research_agent
from services.openai_service import openai_service
from services.airia_service import airia_service
from config import settings

class DiscussionOrchestrator:
    def __init__(self):
        self.agents = [sales_agent, customer_service_agent, research_agent]
        self.deliberation_rounds = 3
        self.use_airia = settings.use_airia_orchestration

    async def conduct_discussion(self, question: str) -> BoardDiscussion:
        """
        Conduct a full multi-round advisory board discussion

        Phases:
        1. Research Phase - Agents gather context
        2. Initial Presentation - Agents present initial positions
        3. Deliberation (3 rounds) - Back-and-forth discussion
        4. Final Synthesis - Comprehensive report
        """
        start_time = datetime.utcnow()
        all_rounds: List[DiscussionRound] = []
        discussion_history: List[Dict[str, str]] = []

        # PHASE 1: Research Phase
        print("[PHASE 1] Research Phase")
        research_round = await self._research_phase(question)
        all_rounds.append(research_round)
        self._add_to_history(discussion_history, research_round.messages)

        # PHASE 2: Initial Presentation
        print("[PHASE 2] Initial Presentations")
        initial_round = await self._initial_presentation_phase(question, discussion_history)
        all_rounds.append(initial_round)
        self._add_to_history(discussion_history, initial_round.messages)

        # PHASE 3: Deliberation (3 rounds)
        print("[PHASE 3] Deliberation Rounds")
        for i in range(self.deliberation_rounds):
            print(f"   Round {i+1}/{self.deliberation_rounds}")
            delib_round = await self._deliberation_round(
                question,
                discussion_history,
                round_num=i+1
            )
            all_rounds.append(delib_round)
            self._add_to_history(discussion_history, delib_round.messages)

        # PHASE 4: Final Synthesis
        print("[PHASE 4] Final Synthesis")
        final_report = await self._create_final_report(question, discussion_history)

        duration = (datetime.utcnow() - start_time).total_seconds()

        return BoardDiscussion(
            question=question,
            rounds=all_rounds,
            final_report=final_report,
            total_rounds=len(all_rounds),
            duration_seconds=duration
        )

    async def _research_phase(self, question: str) -> DiscussionRound:
        """Phase 1: Each agent conducts research"""
        messages: List[AgentMessage] = []

        # Research in parallel
        research_tasks = [
            self._agent_research(agent, question, 0)
            for agent in self.agents
        ]
        research_messages = await asyncio.gather(*research_tasks)
        messages.extend(research_messages)

        return DiscussionRound(
            round_number=0,
            round_type="research",
            messages=messages
        )

    async def _initial_presentation_phase(
        self,
        question: str,
        history: List[Dict[str, str]]
    ) -> DiscussionRound:
        """Phase 2: Each agent presents their initial case"""
        messages: List[AgentMessage] = []

        # Present in sequence - each agent sees previous presentations
        for agent in self.agents:
            message = await self._agent_initial_case(agent, question, history, 1)
            messages.append(message)
            # Add to history so next agent can see it
            history.append({
                "agent": message.agent,
                "message": message.message,
                "type": "initial"
            })

        return DiscussionRound(
            round_number=1,
            round_type="initial",
            messages=messages
        )

    async def _deliberation_round(
        self,
        question: str,
        history: List[Dict[str, str]],
        round_num: int
    ) -> DiscussionRound:
        """Phase 3: Deliberation round - agents respond to each other"""
        messages: List[AgentMessage] = []

        # Each agent responds based on full discussion history
        for agent in self.agents:
            message = await self._agent_deliberation(
                agent,
                question,
                history,
                round_num + 1  # +1 because round 0 is research, round 1 is initial
            )
            messages.append(message)
            # Add to history for next agent in this round
            history.append({
                "agent": message.agent,
                "message": message.message,
                "type": "deliberation"
            })

        return DiscussionRound(
            round_number=round_num + 1,
            round_type="deliberation",
            messages=messages
        )

    async def _agent_research(
        self,
        agent,
        question: str,
        round_num: int
    ) -> AgentMessage:
        """Agent conducts research (gathers context)"""
        # Check if get_context accepts a question parameter
        import inspect
        sig = inspect.signature(agent.get_context)
        if len(sig.parameters) > 0:
            # Research agent - takes question
            context = await agent.get_context(question)
        else:
            # Sales/CS agents - no parameters
            context = await agent.get_context()

        # Use Airia if enabled
        if self.use_airia:
            agent_type = self._get_agent_type(agent)
            research_summary = await airia_service.execute_agent(
                agent_type=agent_type,
                question=f"Conduct research: {question}",
                context=context,
                previous_messages=None
            )
        else:
            research_prompt = f"""You are {agent.name}, conducting preliminary research for an advisory board discussion.

Question: {question}

Your available data:
{context}

Provide a brief summary (2-3 sentences) of the key insights you've discovered from your research that are relevant to this question."""

            research_summary = await openai_service.generate_response(
                messages=[{"role": "user", "content": research_prompt}],
                temperature=0.7,
                max_tokens=150
            )

        return AgentMessage(
            agent=agent.name,
            role=agent.role,
            message=research_summary,
            round_number=round_num,
            message_type="research",
            timestamp=datetime.utcnow().isoformat()
        )

    async def _agent_initial_case(
        self,
        agent,
        question: str,
        history: List[Dict[str, str]],
        round_num: int
    ) -> AgentMessage:
        """Agent presents their initial case/position"""
        # Check if get_context accepts a question parameter
        import inspect
        sig = inspect.signature(agent.get_context)
        if len(sig.parameters) > 0:
            context = await agent.get_context(question)
        else:
            context = await agent.get_context()

        # Build context from previous messages
        previous_statements = self._format_history(history, ["research", "initial"])

        prompt = f"""You are {agent.name}, {agent.role}, presenting your initial position at an advisory board meeting.

Question: {question}

Your data and research:
{context}

{previous_statements}

Present your initial position on this question. Include:
- Your key findings and data points
- Your perspective based on your role
- Your initial recommendations
- Any concerns or opportunities you see

Be clear, data-driven, and assertive in your position."""

        initial_case = await openai_service.generate_response(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
            max_tokens=300
        )

        return AgentMessage(
            agent=agent.name,
            role=agent.role,
            message=initial_case,
            round_number=round_num,
            message_type="initial",
            timestamp=datetime.utcnow().isoformat()
        )

    async def _agent_deliberation(
        self,
        agent,
        question: str,
        history: List[Dict[str, str]],
        round_num: int
    ) -> AgentMessage:
        """Agent participates in deliberation round"""
        # Check if get_context accepts a question parameter
        import inspect
        sig = inspect.signature(agent.get_context)
        if len(sig.parameters) > 0:
            context = await agent.get_context(question)
        else:
            context = await agent.get_context()

        discussion = self._format_history(history, ["initial", "deliberation"])

        prompt = f"""You are {agent.name}, {agent.role}, participating in round {round_num - 1} of deliberations.

Question: {question}

Your data:
{context}

Discussion so far:
{discussion}

Respond to the other advisors. You should:
- Address specific points raised by others
- Challenge assumptions if needed
- Provide supporting data for your arguments
- Find common ground or highlight differences
- Refine or defend your position

Be direct, collegial, and focused on finding the best solution."""

        deliberation = await openai_service.generate_response(
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9,
            max_tokens=250
        )

        return AgentMessage(
            agent=agent.name,
            role=agent.role,
            message=deliberation,
            round_number=round_num,
            message_type="rebuttal",
            timestamp=datetime.utcnow().isoformat()
        )

    async def _create_final_report(
        self,
        question: str,
        history: List[Dict[str, str]]
    ) -> FinalReport:
        """Create comprehensive final synthesis report"""
        full_discussion = self._format_history(history, ["research", "initial", "deliberation"])

        synthesis_prompt = f"""You are an executive synthesizing an advisory board discussion.

Question: {question}

Complete Discussion:
{full_discussion}

Create a comprehensive final report with:

1. EXECUTIVE SUMMARY (2-3 paragraphs synthesizing the discussion)

2. KEY POINTS (5-7 critical insights from the discussion)

3. AGENT CONTRIBUTIONS (Evaluate each agent's contribution):
   - Sales Director: [summary and key metrics/insights provided]
   - Customer Success Director: [summary and key metrics/insights provided]
   - Research Director: [summary and key insights provided]

4. RECOMMENDATIONS (3-5 actionable recommendations based on the full discussion)

Format your response as JSON with keys: summary, key_points (array), agent_metrics (object), recommendations (array)"""

        synthesis_json = await openai_service.generate_response(
            messages=[{"role": "user", "content": synthesis_prompt}],
            temperature=0.7,
            max_tokens=2000
        )

        # Parse the JSON response
        import json
        try:
            report_data = json.loads(synthesis_json)
            return FinalReport(
                summary=report_data.get("summary", ""),
                key_points=report_data.get("key_points", []),
                agent_metrics=report_data.get("agent_metrics", {}),
                recommendations=report_data.get("recommendations", [])
            )
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return FinalReport(
                summary=synthesis_json,
                key_points=[],
                agent_metrics={},
                recommendations=[]
            )

    def _format_history(
        self,
        history: List[Dict[str, str]],
        include_types: List[str]
    ) -> str:
        """Format discussion history for context"""
        formatted = ""
        for entry in history:
            if entry.get("type") in include_types:
                formatted += f"\n{entry['agent']}: {entry['message']}\n"
        return formatted if formatted else "No previous discussion."

    def _add_to_history(
        self,
        history: List[Dict[str, str]],
        messages: List[AgentMessage]
    ):
        """Add messages to discussion history"""
        for msg in messages:
            history.append({
                "agent": msg.agent,
                "message": msg.message,
                "type": msg.message_type
            })

    def _get_agent_type(self, agent) -> str:
        """Get agent type identifier for Airia"""
        if agent.name == "Sales Director":
            return "sales"
        elif agent.name == "Customer Success Director":
            return "cs"
        elif agent.name == "Research Director":
            return "research"
        return "unknown"

# Global orchestrator instance
orchestrator = DiscussionOrchestrator()
