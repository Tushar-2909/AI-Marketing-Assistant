from crewai import Agent

from config.llm_config import create_llm

executor = Agent(
    role="Execution Manager",
    goal="Create timelines and execution plans",
    backstory="Expert in project management",
    verbose=True,
    llm=create_llm(),
)
