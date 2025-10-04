# Advisory Board Discussion Flow

## Overview

The AI Agent Advisory Board conducts **multi-round deliberative discussions** that mirror real executive board meetings, with research, debate, and synthesis.

## Discussion Phases

### Phase 1: Research Phase (Round 0)
**All agents conduct research in parallel**

- **Sales Director**: Analyzes sales data (revenue, pipeline, deals, customers)
- **Customer Success Director**: Analyzes support metrics (tickets, satisfaction, SLAs)
- **Research Director**: Searches the web via Linkup for external insights

Each agent produces a 2-3 sentence research summary of key insights relevant to the question.

**Output**: Research summaries from all 3 agents

---

### Phase 2: Initial Presentation (Round 1)
**Agents present their initial positions sequentially**

Each agent sees the research summaries and any previous presentations in this round.

Agents present:
- Key findings and data points
- Initial position/perspective
- Recommendations
- Concerns or opportunities identified

**Order**: Sales Director → Customer Success Director → Research Director

**Output**: 3 initial position statements

---

### Phase 3: Deliberation (Rounds 2-4)
**Three rounds of back-and-forth discussion**

Each agent responds to the full discussion history, including:
- Addressing specific points from other agents
- Challenging assumptions with data
- Finding common ground
- Refining or defending positions

**Format**: Sequential (each agent sees all previous messages in the round)

**Rounds**:
1. **Round 2**: First deliberation
2. **Round 3**: Second deliberation
3. **Round 4**: Third deliberation

**Output**: 9 total messages (3 agents × 3 rounds)

---

### Phase 4: Final Synthesis
**OpenAI creates comprehensive executive report**

The synthesis analyzes the entire discussion and produces:

1. **Executive Summary**: 2-3 paragraphs synthesizing the full discussion

2. **Key Points**: 5-7 critical insights from the deliberation

3. **Agent Metrics**: Evaluation of each agent's contribution
   - Sales Director: Key metrics and insights provided
   - Customer Success Director: Key metrics and insights provided
   - Research Director: Key insights and external data provided

4. **Recommendations**: 3-5 actionable recommendations based on consensus

**Output**: Structured final report

---

## Complete Discussion Structure

```
BoardDiscussion {
  question: string
  rounds: [
    {
      round_number: 0,
      round_type: "research",
      messages: [
        { agent: "Sales Director", message: "...", message_type: "research" },
        { agent: "Customer Success Director", message: "...", message_type: "research" },
        { agent: "Research Director", message: "...", message_type: "research" }
      ]
    },
    {
      round_number: 1,
      round_type: "initial",
      messages: [
        { agent: "Sales Director", message: "...", message_type: "initial" },
        { agent: "Customer Success Director", message: "...", message_type: "initial" },
        { agent: "Research Director", message: "...", message_type: "initial" }
      ]
    },
    {
      round_number: 2,
      round_type: "deliberation",
      messages: [
        { agent: "Sales Director", message: "...", message_type: "rebuttal" },
        { agent: "Customer Success Director", message: "...", message_type: "rebuttal" },
        { agent: "Research Director", message: "...", message_type: "rebuttal" }
      ]
    },
    {
      round_number: 3,
      round_type: "deliberation",
      messages: [...]
    },
    {
      round_number: 4,
      round_type: "deliberation",
      messages: [...]
    }
  ],
  final_report: {
    summary: "...",
    key_points: ["...", "...", "..."],
    agent_metrics: {
      "Sales Director": "...",
      "Customer Success Director": "...",
      "Research Director": "..."
    },
    recommendations: ["...", "...", "..."]
  },
  total_rounds: 5,
  duration_seconds: 45.2
}
```

## Example Timeline

For the question: **"How can we improve customer retention?"**

### Round 0: Research (Parallel - ~5s)
- Sales: "Current retention is 85%, down from 90% last quarter. Top churning segment is mid-market..."
- Customer Success: "Average ticket resolution time increased to 18.5hrs. Customer sat score dropped to 4.6/5..."
- Research: "Industry benchmarks show 90%+ retention for SaaS. Top factors: onboarding quality, support speed..."

### Round 1: Initial Positions (~15s)
- Sales: "We need to focus on the mid-market segment where we're seeing 20% churn. Data shows customers leaving after 6 months correlate with lack of executive engagement..."
- Customer Success: "The support backlog is our biggest issue. We're missing SLAs 12% of the time, and customers are noticing..."
- Research: "External data shows companies with sub-4hr response times have 95% retention. We're at 18.5hrs. Our competitors are investing heavily in AI-powered support..."

### Round 2-4: Deliberation (~25s)
- Agents debate priorities
- Sales and CS find common ground on improving onboarding
- Research challenges with external benchmarks
- Consensus emerges on multi-pronged approach

### Final Synthesis (~5s)
Comprehensive report synthesizing all insights with specific metrics and actionable recommendations.

**Total Duration**: ~50 seconds

---

## Orchestration Details

### Airia's Role
- **Not used in current implementation** - Discussion is managed by custom orchestrator
- **Future enhancement**: Airia could coordinate more complex workflows or manage parallel agent groups

### OpenAI's Role
1. **Agent Responses**: Powers all agent messages (research, positions, rebuttals)
2. **Final Synthesis**: Creates the comprehensive executive report
3. **Context Management**: Each agent gets full discussion history for informed responses

### Linkup's Role
- **Research Agent Only**: Provides real-time web search for external insights
- **Search Mode**: Returns relevant articles, data, trends
- **Integration**: Research context is included in agent's data for all rounds

---

## API Endpoints

### Full Discussion
```bash
POST /api/advisory-board/discuss
{
  "question": "How can we improve customer retention?",
  "include_research": true
}
```

Returns complete multi-round discussion with final report.

### Quick Discussion (Alternative)
```bash
POST /api/advisory-board/quick-discuss
{
  "question": "What's our current sales performance?",
  "include_research": false
}
```

Returns single-round responses without deliberation (faster, less thorough).

---

## Customization

### Adjust Number of Deliberation Rounds
Edit `server/orchestrator.py`:
```python
class DiscussionOrchestrator:
    def __init__(self):
        self.deliberation_rounds = 3  # Change this value
```

### Modify Agent Order
Edit the agents list in `orchestrator.py`:
```python
self.agents = [sales_agent, customer_service_agent, research_agent]
```

### Change Discussion Mode
- **Current**: Sequential (each agent sees previous messages in round)
- **Alternative**: Run agents in parallel within each deliberation round

---

## Performance Considerations

- **Full Discussion**: ~30-60 seconds depending on question complexity
- **Quick Discussion**: ~5-10 seconds
- **API Calls**: ~15-20 OpenAI calls per full discussion
- **Cost**: ~$0.10-0.30 per full discussion (GPT-4 pricing)

---

## Best Practices

1. **Use Full Discussion for**: Strategic questions, complex problems, important decisions
2. **Use Quick Discussion for**: Simple queries, data lookups, status checks
3. **Question Format**: Clear, specific questions get better results
4. **Timeout**: Allow 60+ seconds for full discussions
5. **Monitoring**: Watch for agent hallucinations or circular debates

---

## Future Enhancements

- [ ] Add voting/consensus mechanism
- [ ] Allow user to join discussion (5th participant)
- [ ] Add discussion summary at each round
- [ ] Implement discussion moderation/steering
- [ ] Add specialized agents (Finance, Product, Engineering)
- [ ] Create discussion templates for common scenarios
