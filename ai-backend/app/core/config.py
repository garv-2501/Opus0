# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv
load_dotenv()  # Force reload .env to ensure E2B_API_KEY is captured



class Settings(BaseSettings):
    OPENAI_API_KEY: str
    FRONTEND_URL: str
    PORT: int = 8000
    DEBUG: bool = False
    CORS_ORIGINS: List[str] = []
    MONGODB_USERNAME: str
    MONGODB_PASSWORD: str
    MONGODB_HOST: str
    MONGODB_DATABASE: str
    ANTHROPIC_API_KEY: Optional[str]  # Added for Anthropic API key
    GOOGLE_API_KEY: Optional[str]     # Added for Google API key
    E2B_API_KEY: Optional[str]  

    class Config:
        env_file = ".env"

    def model_post_init(self, __context):
        if self.FRONTEND_URL and self.FRONTEND_URL not in self.CORS_ORIGINS:
            self.CORS_ORIGINS.append(self.FRONTEND_URL)

settings = Settings()
print("E2B_API_KEY:", os.getenv("E2B_API_KEY"))