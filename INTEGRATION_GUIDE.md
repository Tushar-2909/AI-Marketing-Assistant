# Marketing Planning Generator - Setup & Usage

## Integration Complete! 🚀

Your frontend and backend are now integrated. Here's how to use them:

## Quick Start

### Option 1: Run Both Servers (Recommended)

**Windows (Batch file):**
```bash
start-all.bat
```

**Windows (PowerShell):**
```powershell
.\start-all.ps1
```

**Manual (Two Terminal Windows):**

Terminal 1 - Start Backend:
```bash
cd "d:\6th sem ki padhai\agentic AI\marketing planning generator"
python server.py
```

Terminal 2 - Start Frontend:
```bash
cd "d:\6th sem ki padhai\agentic AI\marketing planning generator\marketing-muse-main\marketing-muse-main"
npm run dev
```

## Access Points

- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **API RedDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Check
```
GET /health
```

### Generate Marketing Strategy
```
POST /generate-strategy
Content-Type: application/json

{
  "goal": "Launch a new eco-friendly water bottle on Instagram"
}
```

## Prerequisites

Make sure you have:
1. ✅ Python 3.10+ installed
2. ✅ Node.js 18+ installed
3. ✅ `GROQ_API_KEY` set in `.env` file (get free key from https://console.groq.com/)

## Configuration

### Set Your Groq API Key
Edit `.env` file:
```
GROQ_API_KEY=your_api_key_here
```

## Project Structure

```
marketing-planning-generator/
├── main.py                          # CLI entry point
├── server.py                        # FastAPI backend server
├── requirements.txt                 # Python dependencies
├── .env                            # Environment variables
├── start-all.bat                   # Quick start script (Windows)
├── start-all.ps1                   # Quick start script (PowerShell)
├── agents/
│   ├── planner.py                  # Planning agent
│   ├── researcher.py               # Research agent
│   └── executor.py                 # Execution agent
├── config/
│   └── llm_config.py              # LLM configuration
└── marketing-muse-main/
    └── marketing-muse-main/
        ├── src/
        │   ├── pages/
        │   │   └── Index.tsx        # Main page (now calls backend API)
        │   ├── components/
        │   │   └── marketing/
        │   │       ├── GoalInput.tsx
        │   │       ├── ResultsDisplay.tsx
        │   │       ├── AgentProgress.tsx
        │   │       └── ...
        │   └── ...
        ├── package.json
        └── ...
```

## How It Works

1. **User enters marketing goal** in the frontend UI
2. **Frontend sends request** to backend API (`POST /generate-strategy`)
3. **Backend runs CrewAI agents**:
   - Planner agent: Creates step-by-step strategy
   - Researcher agent: Analyzes market & competitors
   - Executor agent: Compiles execution plan
4. **Backend returns structured result** with planning, research, and execution sections
5. **Frontend displays results** with agent progress animation

## Troubleshooting

### "Cannot connect to backend" Error
- Make sure `python server.py` is running on port 8000
- Check that no other service is using port 8000

### "Groq API Key Error"
- Verify `.env` file contains `GROQ_API_KEY=your_key`
- Get a free API key from https://console.groq.com/

### "npm install fails"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### "Python dependency issues"
- Run `pip install --upgrade -r requirements.txt`
- Check that Python 3.10+ is installed: `python --version`

## Development

To modify the backend logic:
- Edit `/agents/*.py` files
- Restart `python server.py`

To modify the frontend:
- Edit files in `/marketing-muse-main/marketing-muse-main/src/`
- Changes auto-reload in dev server

## Next Steps

- Customize agent behaviors in `/agents/` folder
- Add more API endpoints in `server.py`
- Enhance UI components in frontend
- Add database to store strategy history
- Deploy to production (see deployment guide)
