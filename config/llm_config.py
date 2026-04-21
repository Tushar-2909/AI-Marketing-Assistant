import os
from crewai import LLM
from dotenv import load_dotenv

load_dotenv()

def create_llm():
    return LLM(
        model="groq/llama-3.1-8b-instant",
        api_key=os.getenv("GROQ_API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )