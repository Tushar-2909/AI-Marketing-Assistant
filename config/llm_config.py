import os
from crewai import LLM
from dotenv import load_dotenv

load_dotenv()


def get_groq_api_key() -> str:
    api_key = (os.getenv("GROQ_API_KEY") or "").strip().strip('"').strip("'")
    if not api_key or api_key == "your_groq_api_key_here":
        raise ValueError("GROQ_API_KEY is missing. Add a valid Groq API key to your .env file.")
    return api_key


def create_llm():
    return LLM(
        model="groq/llama-3.1-8b-instant",
        api_key=get_groq_api_key(),
        base_url="https://api.groq.com/openai/v1"
    )
