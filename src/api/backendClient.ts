// API client for the AI Agent Advisory Board backend

const API_BASE_URL = "http://localhost:8000";

export interface AgentMessage {
  agent: string;
  role: string;
  message: string;
  round_number: number;
  message_type: "research" | "initial" | "rebuttal" | "synthesis";
  timestamp: string;
}

export interface DiscussionRound {
  round_number: number;
  round_type: "research" | "initial" | "deliberation";
  messages: AgentMessage[];
}

export interface FinalReport {
  summary: string;
  key_points: string[];
  agent_metrics: Record<string, unknown>;
  recommendations: string[];
  agent_perspectives: Record<string, string>;
}

export interface BoardDiscussion {
  question: string;
  rounds: DiscussionRound[];
  final_report?: FinalReport;
  total_rounds: number;
  duration_seconds?: number;
}

export interface PrioritizedTask {
  title: string;
  priority: "Now" | "Next" | "Later";
  reasoning: string;
}

export interface AnalysisOutput {
  consensus: string;
  action_plan: PrioritizedTask[];
}

export interface QuestionRequest {
  question: string;
  include_research?: boolean;
}

/**
 * Submit a question to the advisory board for full multi-round discussion
 *
 * Discussion Flow:
 * 1. Research Phase - Each agent gathers context
 * 2. Initial Presentation - Agents present their cases
 * 3. Deliberation (3 rounds) - Agents debate and refine
 * 4. Final Report - OpenAI synthesizes with metrics
 */
export async function askAdvisoryBoard(
  question: string,
  includeResearch: boolean = true
): Promise<BoardDiscussion> {
  const res = await fetch(`${API_BASE_URL}/api/advisory-board/discuss`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      include_research: includeResearch,
    } as QuestionRequest),
  });

  if (!res.ok) {
    throw new Error(`Advisory board request failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Quick discussion mode - single round without deliberation
 * Faster but less thorough than full discussion
 */
export async function askAdvisoryBoardQuick(
  question: string,
  includeResearch: boolean = true
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/api/advisory-board/quick-discuss`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      question,
      include_research: includeResearch,
    } as QuestionRequest),
  });

  if (!res.ok) {
    throw new Error(`Quick discussion request failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Ask a question to a single agent
 */
export async function askSingleAgent(
  agentId: string,
  question: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/api/agent/${agentId}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question } as QuestionRequest),
  });

  if (!res.ok) {
    throw new Error(`Single agent request failed: ${res.statusText}`);
  }

  return res.json();
}

export async function analyzeFinalReport(report: FinalReport): Promise<AnalysisOutput> {
  const res = await fetch(`${API_BASE_URL}/api/analyze-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    throw new Error(detail.detail || `Analysis request failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Get list of available agents
 */
export async function listAgents(): Promise<{
  agents: Array<{ id: string; name: string; role: string }>;
}> {
  const res = await fetch(`${API_BASE_URL}/api/agents`);

  if (!res.ok) {
    throw new Error(`List agents request failed: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Health check for the backend
 */
export async function healthCheck(): Promise<{
  status: string;
  services: Record<string, string>;
}> {
  const res = await fetch(`${API_BASE_URL}/health`);

  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }

  return res.json();
}
