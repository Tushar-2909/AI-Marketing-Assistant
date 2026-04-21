from crewai import Agent
from config.llm_config import create_llm

planner = Agent(
    role="Marketing Planner",
    goal="Break down marketing goals into actionable steps",
    backstory="Expert in marketing strategy",
    llm=create_llm()
)