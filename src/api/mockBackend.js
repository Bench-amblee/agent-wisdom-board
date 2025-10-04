// Mock backend for simulating agent discussions
// This can be easily replaced with real FastAPI calls later

const agentResponses = {
  sales: [
    "Based on our Q4 data, I'm seeing a 10% drop in sales conversion rates. This is concerning and needs immediate attention.",
    "Our top-performing product line has seen reduced engagement. Customer acquisition costs have increased by 15%.",
    "I recommend focusing on high-value customer segments and implementing targeted retention campaigns.",
  ],
  support: [
    "Customer support tickets have increased by 25% over the past month. Most complaints relate to product onboarding.",
    "Average resolution time has gone up to 48 hours. Customers are expressing frustration with response times.",
    "We need to invest in better documentation and perhaps a chatbot for common issues to reduce ticket volume.",
  ],
  research: [
    "Market analysis shows our competitors have introduced similar features at 20% lower price points.",
    "Industry trends indicate a shift toward subscription-based models with more flexible pricing tiers.",
    "Customer surveys reveal that 67% prioritize ease of use over advanced features. We should simplify our product.",
  ],
};

const summaries = [
  "The advisory board has identified three critical areas: declining sales conversion, increased support burden, and competitive pressure. Immediate action items include optimizing the customer journey, scaling support infrastructure, and conducting a comprehensive pricing review.",
  "Analysis reveals interconnected challenges across sales, support, and market positioning. The team recommends a three-phase approach: first, improve onboarding to reduce support tickets; second, refine pricing strategy; third, launch targeted retention campaigns.",
  "Key insights: Product complexity is driving both sales friction and support volume. Competitors are gaining ground with simpler solutions. Recommendation: Prioritize user experience improvements and consider a tiered product strategy.",
];

export async function startDiscussion(topic) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const messages = [];
  const agents = ["Sales", "Support", "Research"];

  // Generate 3 messages per agent (9 total)
  for (let round = 0; round < 3; round++) {
    for (const agent of agents) {
      const agentKey = agent.toLowerCase();
      const responseIndex = round % agentResponses[agentKey].length;
      
      messages.push({
        agent,
        text: agentResponses[agentKey][responseIndex],
        timestamp: new Date().toISOString(),
      });
    }
  }

  return {
    messages,
    summary: summaries[Math.floor(Math.random() * summaries.length)],
  };
}

// For streaming individual messages with delays
export async function* streamDiscussion(topic) {
  // Simulate phases and rounds in the discussion stream
  const phases = [
    { id: "PHASE 1", label: "Research Phase" },
    { id: "PHASE 2", label: "Initial Presentations" },
    { id: "PHASE 3", label: "Deliberation Rounds" },
    { id: "PHASE 4", label: "Final Synthesis" },
  ];

  // Start with research phase
  for (const phase of phases) {
    // announce phase
    yield { type: "phase", data: { phase: phase.id, label: phase.label } };

    // in each phase, stream a subset of messages
    const { messages, summary } = await startDiscussion(topic);
    // send 3 messages per phase to simulate progress
    const slice = messages.slice(0, 3);
    for (const message of slice) {
      await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));
      yield { type: "message", data: message };
    }

    // small pause between phases
    await new Promise((resolve) => setTimeout(resolve, 700));
  }

  // final summary
  const { summary } = await startDiscussion(topic);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  yield { type: "summary", data: summary };
}
