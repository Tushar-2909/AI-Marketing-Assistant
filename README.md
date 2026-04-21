# AI Marketing Assistant

AI Marketing Assistant is a full-stack project that turns a simple marketing goal into a structured campaign plan. It combines a FastAPI backend, CrewAI-powered marketing agents, a React/Vite frontend, and optional PDF export so users can go from idea to execution plan in one workflow.

## Features

- Generate a three-part marketing strategy with planning, research, and execution sections
- Use specialized AI agents for planning, market research, and execution design
- Handle Groq token-limit issues more gracefully with a compact fallback generation path
- Export generated strategies as PDF files
- View results in a polished frontend with progress states and strategy history
- Run backend and frontend together with simple Windows startup scripts

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Backend: Python, FastAPI, CrewAI, LiteLLM
- LLM Provider: Groq
- PDF Export: ReportLab

## Project Structure

```text
AI-Marketing-Assistant/
|-- agents/                         # CrewAI agents
|-- config/                         # LLM configuration
|-- marketing-muse-main/
|   `-- marketing-muse-main/        # React frontend
|-- main.py                         # CLI entry point
|-- server.py                       # FastAPI backend
|-- pdf_generator.py                # PDF export utility
|-- requirements.txt                # Python dependencies
|-- start-all.bat                   # Windows batch launcher
|-- start-all.ps1                   # Windows PowerShell launcher
`-- README.md
```

## How It Works

1. The user enters a marketing goal in the frontend.
2. The frontend sends the goal to the FastAPI backend.
3. The backend runs AI agents for planning, research, and execution.
4. If the provider hits a token-per-minute limit, the backend falls back to a smaller single-call strategy generator.
5. The frontend displays the final strategy and optionally downloads it as a PDF.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- A Groq API key

## Environment Variables

Create a root `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
HOST=0.0.0.0
PORT=8000
```

Create a frontend env file at `marketing-muse-main/marketing-muse-main/.env` if you want to override the backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Example templates are already included as `.env.example` files in both the backend and frontend directories.

## Installation

### Backend

```bash
pip install -r requirements.txt
```

### Frontend

```bash
cd marketing-muse-main/marketing-muse-main
npm install
```

## Running the Project

### Option 1: Start Both Services Quickly

Batch:

```bat
start-all.bat
```

PowerShell:

```powershell
.\start-all.ps1
```

### Option 2: Start Manually

Backend:

```bash
python server.py
```

Frontend:

```bash
cd marketing-muse-main/marketing-muse-main
npm run dev
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

## API Endpoints

### `GET /health`

Returns the backend health status.

### `POST /generate-strategy`

Request body:

```json
{
  "goal": "Increase Instagram engagement for a student startup by 20 percent in 30 days"
}
```

Returns:

```json
{
  "planning": ["..."],
  "research": [
    { "title": "...", "insight": "..." }
  ],
  "execution": [
    { "channel": "...", "action": "..." }
  ]
}
```

### `POST /generate-strategy-pdf`

Accepts the same request body and returns a downloadable PDF strategy.

## Validation

Useful local checks:

```bash
python -m py_compile server.py pdf_generator.py main.py agents/planner.py agents/researcher.py agents/executor.py config/llm_config.py
```

```bash
cd marketing-muse-main/marketing-muse-main
npm run lint
npm run build
```

## Common Issues

### Port 8000 already in use

Another backend is already running. Stop the existing process or set a different `PORT` in `.env`.

### Groq rate-limit or token-limit errors

The backend now includes a smaller fallback strategy generation path, but very long prompts can still reduce output quality. Keep the goal concise for best results.

### Frontend cannot reach backend

Make sure the backend is running and `VITE_API_BASE_URL` points to the correct host and port.

## Future Improvements

- Persist strategy history in a database
- Add authentication
- Add deployment configuration
- Improve prompt formatting for more compact structured outputs
