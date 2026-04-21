from crewai import Task, Crew
from agents.planner import planner
from agents.researcher import researcher
from agents.executor import executor

# Take user input
user_goal = input("Enter your marketing goal: ")

# Create tasks using user input
task1 = Task(
    description=f"Break down this marketing goal into steps: {user_goal}",
    expected_output="A clear step-by-step marketing plan",
    agent=planner
)

task2 = Task(
    description=f"Analyze competitors and trends for: {user_goal}",
    expected_output="Insights about competitors and current trends",
    agent=researcher
)

task3 = Task(
    description=f"Execute this marketing plan: {user_goal}",
    expected_output="A complete executed marketing strategy",
    agent=executor
)

# Create crew
crew = Crew(
    agents=[planner, researcher, executor],
    tasks=[task1, task2, task3]
)

# Run
result = crew.kickoff()

# Clean output
print("\n" + "=" * 50)
print("FINAL MARKETING PLAN")
print("=" * 50 + "\n")

print(result)
