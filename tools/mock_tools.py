from crewai.tools import tool

@tool
def check_budget():
    """Check if the budget is sufficient for the campaign"""
    return "Budget is sufficient"

@tool
def check_team():
    """Check if the team is ready for execution"""
    return "Team is ready"