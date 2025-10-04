from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    openai_api_key: str
    linkup_api_key: str
    airia_api_key: str
    airia_base_url: str = "https://api.airia.ai/v2"
    linkup_base_url: str = "https://api.linkup.so/v1"

    # Airia Agent Pipeline IDs
    airia_sales_agent_id: str = "0fd0347f-27c2-4205-85ba-0d65934172b1"
    airia_cs_agent_id: str = "7401dfba-ed4b-470c-bbb5-91bfe4e4be42"
    airia_research_agent_id: str = "0e4fde0c-1d36-47c6-bab5-e3c4e52ccae2"

    # Enable Airia orchestration
    use_airia_orchestration: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
