from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    openai_api_key: str
    linkup_api_key: str
    airia_api_key: str
    airia_base_url: str = "https://api.airia.com/v1"
    linkup_base_url: str = "https://api.linkup.so/v1"

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
