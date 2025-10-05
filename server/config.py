from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    openai_api_key: Optional[str] = None
    linkup_api_key: Optional[str] = None
    airia_api_key: Optional[str] = None
    airia_base_url: str = "https://api.airia.ai/v2"
    linkup_base_url: str = "https://api.linkup.so/v1"

    # Airia Agent Pipeline IDs
    airia_sales_agent_id: str = "0fd0347f-27c2-4205-85ba-0d65934172b1"
    airia_cs_agent_id: str = "7401dfba-ed4b-470c-bbb5-91bfe4e4be42"
    airia_research_agent_id: str = "0e4fde0c-1d36-47c6-bab5-e3c4e52ccae2"

    # Enable Airia orchestration
    use_airia_orchestration: bool = False

    # Rate Limiting Configuration
    rate_limit_window_minutes: int = 15
    rate_limit_max_requests: int = 100
    ai_rate_limit_max_requests: int = 10
    max_tokens_per_request: int = 2000

    # Daily Budget Limit
    daily_budget_limit: float = 5.0

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

settings = Settings()
