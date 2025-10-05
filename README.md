# 🎯 AI Advisory Board

> **Built in 5 hours at the NYC AI Agents Hackathon** | **Top 5 Finish** 🏆

Get strategic insights from a panel of AI experts who analyze your data and collaborate to answer your business questions. Watch as Sales, Customer Success, and Research directors engage in multi-round discussions to provide comprehensive recommendations.

**[🚀 Try it Live](https://ai-advisor-board.vercel.app/)**

![AI Advisory Board Demo](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)
![Built with Love](https://img.shields.io/badge/Built%20with-❤️%20in%205hrs-ff69b4?style=for-the-badge)

---

## 🌟 What We Built

An intelligent advisory board system where specialized AI agents collaborate to solve complex business problems. Each agent:
- 🔵 **Sales Director** - Analyzes revenue patterns, pipeline health, and conversion metrics
- 🔵 **Customer Success Director** - Examines support trends, customer pain points, and satisfaction
- 🟣 **Research Director** - Provides market analysis and data-driven insights

### The Experience

1. **Research Phase** - Each director independently analyzes relevant data
2. **Initial Presentations** - Directors present their findings and perspectives
3. **Deliberation Rounds** - Agents debate, challenge assumptions, and build on each other's insights
4. **Final Synthesis** - A comprehensive report with actionable recommendations

---

## 🏗️ Architecture

### Multi-Agent Orchestration
- **Custom orchestration engine** managing deliberation rounds and consensus building
- **Context-aware agents** with specialized domain knowledge
- **Dynamic discussion flow** adapting based on question complexity

### Tech Stack

**Frontend:**
- ⚛️ React + TypeScript
- 🎨 Tailwind CSS + shadcn/ui components
- 🎭 Lucide React icons
- ⚡ Vite for blazing-fast dev experience

**Backend:**
- 🐍 FastAPI (Python)
- 🤖 OpenAI GPT-4 for agent intelligence
- 🔗 Airia API for advanced orchestration
- 🔍 Linkup API for web search capabilities

**Infrastructure:**
- 🚀 Vercel (Frontend deployment)
- 🌐 Render (Backend API)
- 📊 Sample datasets: Athletic wear ecommerce company

---

## 🚀 Quick Start

### Prerequisites
```bash
node >= 18
python >= 3.10
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/agent-wisdom-board.git
cd agent-wisdom-board
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd server
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
# Create server/.env file
OPENAI_API_KEY=your_openai_key
LINKUP_API_KEY=your_linkup_key
AIRIA_API_KEY=your_airia_key
```

5. **Run the development servers**

Terminal 1 (Frontend):
```bash
npm run dev
```

Terminal 2 (Backend):
```bash
npm run fastapi
```

Visit `http://localhost:5173` to see the app!

---

## 💡 Key Features

### 🎯 Smart Question Routing
Ask any business question and watch the board automatically determine which agents should participate and how many deliberation rounds are needed.

### 📊 Data-Driven Insights
Agents analyze real sales pipeline data and customer support tickets to provide grounded, actionable recommendations.

### 🔄 Multi-Round Deliberation
Unlike single-shot AI responses, our agents engage in back-and-forth discussions, challenging assumptions and building consensus.

### 📝 Comprehensive Reports
Get both a high-level summary and detailed analysis with:
- Agent perspectives (what each director thinks)
- Key points and takeaways
- Prioritized recommendations
- Full discussion transcript

### 🎨 UI/UX
- Real-time phase indicators showing research, presentations, and deliberation
- Animated agent status cards
- Tabbed interface for discussion vs. summary views
- Responsive design for all screen sizes

---
