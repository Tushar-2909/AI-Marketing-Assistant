from crewai import Agent
from config.llm_config import create_llm

researcher = Agent(
    role="Marketing Researcher",
    goal="Analyze competitors and trends",
    backstory="Expert in market research",
    llm=create_llm()
)