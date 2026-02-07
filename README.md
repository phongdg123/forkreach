<div align="center">

<h1 style="border-bottom: none">
    <b>ForkReach</b><br />
    Multi-AI Marketing Agent for Indie Hackers
</h1>

<img alt="ForkReach Demo" src="./demo.gif" style="width: 100%">

<br/>
<p align="center">
  A conversational AI platform with specialized marketing agents for indie hackers and startups.<br />
  Powered by Google's Gemini AI for Twitter content, email marketing, landing pages & launch strategies.
</p>

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)

</div>

<br />
<div align="center">
<em>Your AI-powered marketing team, available 24/7.</em>
</div>
<br />

## Getting started & staying tuned with us.

Star us, and you will receive all release notifications from GitHub without any delay!

<div align="center">
<img src="./star.gif" style="width: 100%"/>
</div>

---

## ✨ Features

- **🤖 Specialized AI Agents** - Purpose-built agents for different marketing tasks:
  - **Twitter Agent** - Generate engaging tweets and thread content
  - **Email Marketing Agent** - Craft compelling email campaigns
  - **Landing Page Agent** - Write converting landing page copy
  - **Launch Strategist** - Plan and execute product launches
  
- **🧠 Smart Routing** - Auto-routes queries to the most appropriate agent based on user intent

- **💬 Real-time Streaming** - Responses stream in real-time using the ai-sdk UI Message Stream Protocol

- **📦 Product Context** - Personalize responses with your product/brand context

- **💾 Conversation History** - Persist and continue conversations across sessions with Supabase

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **Google Gemini AI** - Powers all AI agents (gemini-2.5-flash, gemini-1.5-pro, etc.)
- **Supabase** - Database for conversation persistence
- **UV** - Modern Python package manager

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **ai-sdk** - Vercel AI SDK for chat streaming
- **Lucide React** - Beautiful icon library

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v22.18.0+ (recommended via nvm)
- **Python** 3.13+
- **UV** package manager (`pip install uv`)
- **Supabase** account (for conversation persistence)

### Environment Setup

#### Backend
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Frontend
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Installation

#### Backend
```bash
cd backend
uv sync
```

#### Frontend
```bash
cd frontend
npm install
```

### Running the Application

#### Start Backend Server
```bash
cd backend
uv run uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
├── backend/
│   ├── agents/                  # AI agent implementations
│   │   ├── base_agent.py        # Base agent class
│   │   ├── coordinator.py       # Agent routing coordinator
│   │   ├── twitter_agent.py     # Twitter content agent
│   │   ├── email_marketing_agent.py
│   │   ├── landing_page_agent.py
│   │   └── launch_strategist_agent.py
│   ├── main.py                  # FastAPI app entry point
│   ├── stream.py                # Streaming chat endpoint
│   ├── conversations_api.py     # Conversation CRUD API
│   ├── products_api.py          # Product context API
│   ├── supabase_client.py       # Supabase client setup
│   └── pyproject.toml           # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── session/         # Main chat session pages
│   │   ├── components/          # React components
│   │   │   └── ui/              # Shadcn UI components
│   │   └── contexts/            # React context providers
│   ├── public/                  # Static assets
│   └── package.json             # Node dependencies
│
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Stream chat responses from agents |
| GET | `/api/agents` | List available agents |
| GET | `/api/conversations` | Get user conversations |
| POST | `/api/conversations` | Create new conversation |
| POST | `/api/conversations/{id}/messages` | Add message to conversation |
| GET | `/api/products` | Get user products |
| POST | `/api/products` | Create product context |

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and pull requests.
