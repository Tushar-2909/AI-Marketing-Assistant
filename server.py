import json
import os
from datetime import datetime

from crewai import Crew, Task
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from litellm import completion
from pydantic import BaseModel

from agents.executor import executor
from agents.planner import planner
from agents.researcher import researcher
from pdf_generator import generate_pdf

load_dotenv()

app = FastAPI(title="Marketing Planning Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GoalRequest(BaseModel):
    goal: str


class StrategyResult(BaseModel):
    planning: list[str]
    research: list[dict]
    execution: list[dict]


def normalize_goal(goal: str) -> str:
    """Keep the goal concise so provider token usage stays under account limits."""
    cleaned_goal = " ".join(goal.strip().split())
    return cleaned_goal[:400]


def is_token_rate_limit_error(exc: Exception) -> bool:
    message = str(exc).lower()
    return "rate_limit" in message or "rate limit" in message or "tokens per minute" in message


def build_strategy_crew(goal: str) -> Crew:
    """Create the crew and tasks for a single marketing goal."""
    task1 = Task(
        description=f"Break down this marketing goal into 4 concise actionable steps: {goal}",
        expected_output="A short numbered plan with 4 concrete milestones.",
        agent=planner,
    )
    task2 = Task(
        description=f"Summarize 3 concise market or competitor insights for: {goal}",
        expected_output="Three brief research insights with clear headlines.",
        agent=researcher,
    )
    task3 = Task(
        description=f"Create 4 concise execution actions with channels for: {goal}",
        expected_output="Four short execution actions with a channel and action for each.",
        agent=executor,
    )

    return Crew(agents=[planner, researcher, executor], tasks=[task1, task2, task3])


def parse_crew_output(output: str) -> StrategyResult:
    """Parse Crew output into the structure expected by the frontend."""
    try:
        data = json.loads(output)
        return StrategyResult(**data)
    except Exception:
        pass

    planning: list[str] = []
    research: list[dict] = []
    execution: list[dict] = []
    current_section = None

    for raw_line in output.splitlines():
        line = raw_line.strip()
        if not line:
            continue

        lower_line = line.lower()
        if "planning" in lower_line:
            current_section = "planning"
            continue
        if "research" in lower_line or "competitor" in lower_line or "trend" in lower_line:
            current_section = "research"
            continue
        if "execution" in lower_line or "channel" in lower_line:
            current_section = "execution"
            continue

        cleaned_line = line.lstrip("- •*")
        if current_section == "planning":
            planning.append(cleaned_line)
        elif current_section == "research":
            research.append({"title": "Market Insight", "insight": cleaned_line})
        elif current_section == "execution":
            execution.append({"channel": "Action", "action": cleaned_line})

    if not planning:
        planning = [output[:500]]
    if not research:
        research = [{"title": "Market Insight", "insight": output[500:1000] if len(output) > 500 else output}]
    if not execution:
        execution = [{"channel": "Action", "action": output[1000:1500] if len(output) > 1000 else output}]

    return StrategyResult(planning=planning, research=research, execution=execution)


def generate_compact_strategy(goal: str) -> StrategyResult:
    """Fallback strategy generation using a single compact model call."""
    normalized_goal = normalize_goal(goal)
    response = completion(
        model="groq/llama-3.1-8b-instant",
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1",
        temperature=0.4,
        max_tokens=450,
        response_format={"type": "json_object"},
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a concise marketing strategist. Return valid JSON with keys "
                    "'planning', 'research', and 'execution'. "
                    "'planning' must be an array of 4 short strings. "
                    "'research' must be an array of 3 objects with keys 'title' and 'insight'. "
                    "'execution' must be an array of 4 objects with keys 'channel' and 'action'. "
                    "Keep every item short and concrete."
                ),
            },
            {
                "role": "user",
                "content": f"Create a marketing strategy for this goal: {normalized_goal}",
            },
        ],
    )

    content = response.choices[0].message.content
    data = json.loads(content)
    return StrategyResult(**data)


def generate_strategy_for_goal(goal: str) -> StrategyResult:
    """Generate a strategy, falling back to a compact prompt when token limits are hit."""
    normalized_goal = normalize_goal(goal)

    try:
        crew = build_strategy_crew(normalized_goal)
        result = crew.kickoff()
        return parse_crew_output(str(result))
    except Exception as exc:
        if is_token_rate_limit_error(exc):
            return generate_compact_strategy(normalized_goal)
        raise exc


@app.get("/health")
async def health_check():
    return {"status": "ok"}


@app.post("/generate-strategy")
async def generate_strategy(request: GoalRequest) -> StrategyResult:
    try:
        return generate_strategy_for_goal(request.goal)
    except Exception as exc:
        if is_token_rate_limit_error(exc):
            return StrategyResult(
                planning=["Keep the goal shorter and try again."],
                research=[{"title": "Rate Limit", "insight": "The model hit a Groq token-per-minute limit for this request."}],
                execution=[{"channel": "Next Step", "action": "Retry in a minute or shorten the goal text."}],
            )

        return StrategyResult(
            planning=[f"Error: {str(exc)[:500]}"],
            research=[{"title": "Error", "insight": "Could not generate research insights"}],
            execution=[{"channel": "Error", "action": "Could not generate execution plan"}],
        )


@app.post("/generate-strategy-pdf")
async def generate_strategy_pdf(request: GoalRequest):
    try:
        strategy = generate_strategy_for_goal(request.goal)
        pdf_buffer = generate_pdf(normalize_goal(request.goal), strategy.model_dump())
        filename = f"marketing_plan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc)})


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
