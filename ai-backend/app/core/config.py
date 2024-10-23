# app/core/config.py
from pydantic_settings import BaseSettings
from typing import List

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

    class Config:
        env_file = ".env"

    def model_post_init(self, __context):
        if self.FRONTEND_URL and self.FRONTEND_URL not in self.CORS_ORIGINS:
            self.CORS_ORIGINS.append(self.FRONTEND_URL)

settings = Settings()
