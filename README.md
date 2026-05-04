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

Create a frontend env file at `marketing-muse-main/marketing-muse-main/.env` only if you want to override the default API URL during local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

In production, the frontend defaults to the same origin as the backend, so no frontend env variable is required when both are served from one container.

Example templates are already included as `.env.example` files in the backend directory.

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

## Docker

This repo now includes a production `Dockerfile` that:

- builds the Vite frontend
- copies the frontend build into the FastAPI app
- serves both frontend and API from the same container on port `8000`

### Run Locally With Docker Compose

```bash
docker compose up --build
```

Then open:

- App: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`

### Build and Run Manually

```bash
docker build -t marketing-planning-generator .
docker run --env-file .env -p 8000:8000 marketing-planning-generator
```

## AWS Deployment

The recommended production target in this repo is now:

- Docker image in Docker Hub
- one Ubuntu EC2 instance running Docker Compose
- GitHub Actions for CI/CD over SSH

### CI/CD Flow

This deployment pipeline works like this:

1. You push code to GitHub.
2. GitHub Actions validates the backend and frontend.
3. GitHub Actions builds a Docker image from this repo.
4. GitHub Actions pushes that image to Docker Hub.
5. GitHub Actions connects to your EC2 instance over SSH.
6. The EC2 instance logs in to Docker Hub, pulls the new image, and restarts the app with Docker Compose.

This is possible because:

- GitHub Actions can build Docker images in the cloud
- Docker Hub acts as the image registry between GitHub and EC2
- EC2 only needs Docker, Docker Compose, and SSH access
- the app is already packaged as a single container through the `Dockerfile`

### 1. Create AWS resources

Create these once in AWS:

1. One EC2 instance with a public IP or DNS name.
2. A security group allowing inbound `80` for the app and `22` for SSH.
3. An SSH key pair or SSH user access for deployment.

### 2. Prepare the EC2 instance

Install Docker and Docker Compose on the instance.

Example for Ubuntu:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

Then log out and back in once so your user can run Docker without `sudo`.

### 3. Configure GitHub Actions authentication

This setup uses two trust paths:

- GitHub Actions logs in to Docker Hub to push the Docker image
- GitHub Actions SSHs into EC2 to restart the container

Add these repository secrets:

- `DOCKERHUB_TOKEN`: a Docker Hub access token
- `EC2_SSH_PRIVATE_KEY`: the private SSH key for the EC2 user
- `GROQ_API_KEY`: your application secret

Use a Docker Hub access token, not your Docker Hub password.

### 4. Add repository variables

Add these GitHub repository variables:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_REPOSITORY`
- `EC2_HOST`
- `EC2_USERNAME`
- `EC2_APP_DIR`
- `HOST_PORT`

Recommended values:

- `DOCKERHUB_USERNAME=your-dockerhub-username`
- `DOCKERHUB_REPOSITORY=marketing-planning-generator`
- `EC2_APP_DIR=/opt/marketing-planning-generator`
- `HOST_PORT=80`

### 5. Push to deploy

The EC2 workflow file is `.github/workflows/deploy-ec2.yml`.

Behavior:

- pull requests run validation only
- pushes to `main` run validation, build the Docker image, push to Docker Hub, copy deploy files to EC2, and restart the app
- manual runs are available through `workflow_dispatch`

If your default deployment branch is not `main`, update `.github/workflows/deploy-ec2.yml`.

### 6. What gets deployed

The EC2 deployment uses:

- [Dockerfile](</d:/6th sem ki padhai/agentic AI/marketing planning generator/Dockerfile:1>) to build the image
- [compose.ec2.yaml](</d:/6th sem ki padhai/agentic AI/marketing planning generator/deploy/compose.ec2.yaml:1>) to run the container on the server
- [deploy-ec2.sh](</d:/6th sem ki padhai/agentic AI/marketing planning generator/scripts/deploy-ec2.sh:1>) to log in to Docker Hub, pull the image, and restart the service

The app will be available on:

- `http://<your-ec2-public-ip-or-domain>/`
- `http://<your-ec2-public-ip-or-domain>/docs`

## GitHub Actions Checks

The workflow validates:

- Python import/syntax compilation
- frontend dependency install
- frontend lint
- frontend production build

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
- Improve prompt formatting for more compact structured outputs
