# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2408e7d0-7305-4749-a114-dc76e7fa9802

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2408e7d0-7305-4749-a114-dc76e7fa9802) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2408e7d0-7305-4749-a114-dc76e7fa9802) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Local backend & API keys

This project includes a small Express backend proxy that lets you keep API keys out of the client.

1. Copy `.env.example` to `.env` and fill in your real keys (do NOT commit `.env`).

2. Install dependencies:

```powershell
npm install
```

3. Start the backend server:

```powershell
npm run server
```

Or start frontend + server concurrently:

```powershell
npm run start:dev
```

The server exposes proxy endpoints under `/api/openai`, `/api/linkup` and `/api/airia`. The frontend helper `src/api/backendClient.ts` shows how to call them.

Note on ports
--
By default this project expects the backend (FastAPI/Express) to run on port 8000 and the Vite frontend on port 8080. The Vite dev server is configured to proxy `/api/*` to `http://localhost:8000` so you can call `/api/...` from the browser without CORS issues.

Start both locally (PowerShell):

```powershell
# In one terminal: start the backend (example for FastAPI)
uvicorn server.main:app --reload --port 8000

# In another terminal: start the frontend

npm run dev
```



# 🧠 NovaMart Query Pack

> **NovaMart – Home Fitness Gear**  
> Data Intelligence Layer powering our AI agents: Support, Sales, and Research.

---

## 📦 Overview

The **Query Pack** is a lightweight, pre-processed JSON layer that summarizes NovaMart’s internal data.  
It transforms raw CSV files into structured insights that our agents can consume directly — both **locally** and in **Airia**.

This allows our agents to reason faster, avoid repetitive SQL/CSV scans, and maintain a shared, consistent understanding of the company’s data.

---

## 🏢 About the Company

**NovaMart** is a next-gen ecommerce brand focused on **AI-powered home fitness gear**.  
We sell products like:
- 🏋️ Smart dumbbells  
- 🧘 AI-connected resistance bands  
- 💪 Intelligent workout mats and recovery sensors  

Our mission is simple:  
> *Help people train smarter at home using adaptive AI technology.*

---

## ⚙️ Data Sources

All analytics in this Query Pack come from NovaMart’s core operational datasets:

| Dataset | File | Description |
|----------|------|--------------|
| **Customer Support** | `data/support.csv` | Support tickets and chat interactions about orders, returns, defects, and app issues. |
| **Sales Pipeline** | `data/sales.csv` | Opportunities, lead sources, and win/loss outcomes from marketing channels. |
| **Market Research** | `data/research.csv` | Aggregated web insights and trend findings from the fitness tech market. |

These CSVs represent NovaMart’s internal data streams.  
They are processed locally into a unified **`query_pack.json`** file that contains key business signals for each domain.

---

## 🧩 Structure of `query_pack.json`

The Query Pack summarizes data into three top-level domains:

```json
{
  "meta": {
    "generated_at": "2025-10-04T12:00:00Z",
    "source": "NovaMart Home Fitness Data"
  },
  "support": {
    "rising_topics": [],
    "escalation_rate_by_topic": [],
    "p50_tts_by_topic": []
  },
  "sales": {
    "stalled_opps_gt14d": [],
    "win_rate_by_source": []
  },
  "research": {
    "top_findings": []
  }
}
