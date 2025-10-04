# Airia Agent Setup Guide

## Overview

While the current implementation uses a custom orchestrator, Airia can be integrated for advanced agent coordination and workflow management. This guide shows how to set up agents in your Airia dashboard for future integration.

## Why Use Airia?

Airia provides:
- **Advanced orchestration**: Manage complex multi-agent workflows
- **Agent registry**: Centralized agent management
- **Workflow templates**: Reusable discussion patterns
- **Monitoring**: Track agent performance and interactions
- **Scaling**: Handle multiple concurrent discussions

## Setting Up Agents in Airia

### Prerequisites

1. Airia account and API key
2. Access to Airia dashboard
3. `AIRIA_API_KEY` in your `.env` file

### Agent 1: Sales Director

**Configuration:**
```yaml
Name: Sales Director
Role: Sales Strategy and Revenue Expert
Model: gpt-4 (or your preferred model)

System Instructions:
You are the Sales Director on an executive advisory board. You analyze sales performance, revenue metrics, pipeline health, and customer acquisition data.

Your responsibilities:
- Analyze sales data including revenue, deals, pipeline, and customer metrics
- Identify growth opportunities and revenue risks
- Provide data-driven sales strategy recommendations
- Evaluate pricing and market positioning
- Assess sales team performance

When participating in discussions:
- Reference specific sales metrics and trends
- Be assertive about revenue priorities
- Challenge assumptions with sales data
- Find alignment between sales goals and other departments
- Provide actionable sales recommendations

Data Access:
- Sales revenue and performance data
- Pipeline and deal flow information
- Customer acquisition metrics
- Pricing and discount analysis
```

**Tags**: `sales`, `revenue`, `advisory-board`

---

### Agent 2: Customer Success Director

**Configuration:**
```yaml
Name: Customer Success Director
Role: Customer Experience and Support Expert
Model: gpt-4 (or your preferred model)

System Instructions:
You are the Customer Success Director on an executive advisory board. You analyze customer satisfaction, support metrics, retention, and service quality.

Your responsibilities:
- Monitor customer satisfaction and NPS scores
- Analyze support ticket volume and resolution metrics
- Track customer retention and churn
- Evaluate service quality and SLA compliance
- Identify customer pain points and improvement opportunities

When participating in discussions:
- Reference specific customer metrics and feedback
- Advocate for customer experience improvements
- Challenge assumptions with support data
- Bridge the gap between customer needs and business goals
- Provide actionable customer success recommendations

Data Access:
- Support ticket data and metrics
- Customer satisfaction scores
- Retention and churn analytics
- SLA compliance reports
- Customer feedback and testimonials
```

**Tags**: `customer-success`, `support`, `advisory-board`

---

### Agent 3: Research Director

**Configuration:**
```yaml
Name: Research Director
Role: Market Research and External Insights Expert
Model: gpt-4 (or your preferred model)

System Instructions:
You are the Research Director on an executive advisory board. You provide external market insights, competitive intelligence, and industry trend analysis using web research.

Your responsibilities:
- Conduct real-time market research
- Analyze industry trends and benchmarks
- Monitor competitor strategies and positioning
- Identify emerging opportunities and threats
- Validate internal assumptions with external data

When participating in discussions:
- Reference external sources and industry data
- Challenge internal perspectives with market realities
- Provide competitive context for decisions
- Identify gaps between internal metrics and industry benchmarks
- Cite specific sources for your claims

Data Access:
- Web search via Linkup API
- Industry reports and benchmarks
- Competitor analysis
- Market trend data
- News and industry publications
```

**Tools Enabled**:
- Web Search (Linkup integration)
- URL Fetching
- Document Analysis

**Tags**: `research`, `market-intelligence`, `advisory-board`

---

## Airia Workflow Setup (Optional)

### Advisory Board Discussion Workflow

Create a workflow in Airia to orchestrate the multi-round discussion:

**Workflow Name**: `Advisory Board Multi-Round Discussion`

**Steps**:

1. **Research Phase**
   - Trigger: All 3 agents in parallel
   - Input: User question
   - Mode: Research
   - Timeout: 10s

2. **Initial Presentations**
   - Trigger: Sequential (Sales → CS → Research)
   - Input: Question + Research summaries
   - Mode: Initial position
   - Timeout: 20s

3. **Deliberation Round 1**
   - Trigger: Sequential (Sales → CS → Research)
   - Input: Question + Full discussion history
   - Mode: Deliberation
   - Timeout: 20s

4. **Deliberation Round 2**
   - Trigger: Sequential (Sales → CS → Research)
   - Input: Question + Full discussion history
   - Mode: Deliberation
   - Timeout: 20s

5. **Deliberation Round 3**
   - Trigger: Sequential (Sales → CS → Research)
   - Input: Question + Full discussion history
   - Mode: Deliberation
   - Timeout: 20s

6. **Final Synthesis**
   - Trigger: Single synthesis agent
   - Input: Complete discussion transcript
   - Mode: Executive report
   - Timeout: 15s

**Total Workflow Time**: ~90 seconds

---

## Integration Code

### Using Airia API Directly

Update `server/services/airia_service.py` to use your Airia agents:

```python
async def conduct_airia_discussion(self, question: str) -> Dict[str, Any]:
    """
    Use Airia's orchestration to run the full discussion
    """
    workflow_response = await self.run_workflow(
        workflow_id="advisory-board-discussion",
        inputs={
            "question": question,
            "agents": ["sales-director", "cs-director", "research-director"],
            "rounds": 3
        }
    )
    return workflow_response
```

### Enable Airia Orchestrator

Update `server/orchestrator.py` to use Airia:

```python
from services.airia_service import airia_service

class DiscussionOrchestrator:
    def __init__(self, use_airia: bool = False):
        self.use_airia = use_airia
        # ...

    async def conduct_discussion(self, question: str):
        if self.use_airia:
            return await self._airia_discussion(question)
        else:
            return await self._custom_discussion(question)
```

---

## Testing Airia Integration

### 1. Verify Agents Are Created

```bash
curl -X GET https://api.airia.com/v1/agents \
  -H "Authorization: Bearer YOUR_AIRIA_KEY"
```

Expected response:
```json
{
  "agents": [
    {
      "id": "agent_xxx1",
      "name": "Sales Director",
      "status": "active"
    },
    {
      "id": "agent_xxx2",
      "name": "Customer Success Director",
      "status": "active"
    },
    {
      "id": "agent_xxx3",
      "name": "Research Director",
      "status": "active"
    }
  ]
}
```

### 2. Test Single Agent

```bash
curl -X POST https://api.airia.com/v1/agents/agent_xxx1/chat \
  -H "Authorization: Bearer YOUR_AIRIA_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is our current revenue performance?",
    "context": "Q3 2025 revenue: $2.45M, Target: $3M"
  }'
```

### 3. Test Orchestration

```bash
curl -X POST https://api.airia.com/v1/orchestrate \
  -H "Authorization: Bearer YOUR_AIRIA_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How can we improve customer retention?",
    "agents": ["agent_xxx1", "agent_xxx2", "agent_xxx3"],
    "mode": "sequential"
  }'
```

---

## Configuration Variables

Add to your `.env`:

```env
# Airia Configuration
AIRIA_API_KEY=your-airia-key-here
AIRIA_BASE_URL=https://api.airia.com/v1
AIRIA_SALES_AGENT_ID=agent_xxx1
AIRIA_CS_AGENT_ID=agent_xxx2
AIRIA_RESEARCH_AGENT_ID=agent_xxx3
AIRIA_WORKFLOW_ID=workflow_yyy1

# Use Airia for orchestration (true/false)
USE_AIRIA_ORCHESTRATION=false
```

Update `server/config.py`:

```python
class Settings(BaseSettings):
    # ... existing settings ...

    # Airia settings
    use_airia_orchestration: bool = False
    airia_sales_agent_id: Optional[str] = None
    airia_cs_agent_id: Optional[str] = None
    airia_research_agent_id: Optional[str] = None
    airia_workflow_id: Optional[str] = None
```

---

## Benefits of Airia Integration

### Current (Custom Orchestrator)
✅ Full control over discussion flow
✅ No external dependencies
✅ Faster (no API overhead)
❌ Manual orchestration logic
❌ Limited to predefined patterns

### With Airia
✅ Professional agent management
✅ Advanced workflow capabilities
✅ Built-in monitoring and logging
✅ Scalable to many agents
✅ Reusable workflow templates
❌ Additional API calls
❌ Slight latency increase
❌ Requires Airia subscription

---

## Next Steps

1. **Create Airia Account**: Sign up at https://airia.com
2. **Get API Key**: Generate in dashboard settings
3. **Create Agents**: Use configurations above
4. **Test Integration**: Use curl commands to verify
5. **Enable in Backend**: Set `USE_AIRIA_ORCHESTRATION=true`
6. **Monitor**: Watch Airia dashboard for agent interactions

---

## Support

- **Airia Docs**: Check your Airia documentation portal
- **API Reference**: https://docs.airia.com/api-reference
- **Community**: Airia Discord/Slack (if available)

For questions specific to this integration, refer to `server/services/airia_service.py` and the implementation notes.
