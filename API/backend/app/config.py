import os
from pydantic_settings import BaseSettings
from typing import Optional

# Project root: config.py is at  DL PROJECT/API/backend/app/config.py
# Going up 3 levels:  app/ → backend/ → API/ → DL PROJECT/
_PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

class Settings(BaseSettings):
    APP_NAME: str = "Metascale Health API"
    DEBUG: bool = False
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    # ML Model Paths — resolved dynamically so they work on any machine
    DIABETES_MODEL_PATH: str = os.path.join(_PROJECT_ROOT, "models", "diabetes_model.pkl")
    LIVER_MODEL_PATH: str    = os.path.join(_PROJECT_ROOT, "models", "liver_model.pkl")

    # Risk Thresholds
    RISK_THRESHOLD_LOW: float  = 0.33
    RISK_THRESHOLD_HIGH: float = 0.66

    # LLM Configuration (set via environment variable in production)
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        # Absolute path ensures .env is found regardless of where python3 is launched from
        env_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
        env_file_encoding = "utf-8"

settings = Settings()
