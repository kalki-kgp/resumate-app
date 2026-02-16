from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BACKEND_DIR.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(
            BACKEND_DIR / ".env",
            PROJECT_DIR / ".env",
            ".env",
        ),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "ResuMate API"
    VERSION: str = "0.1.0"
    DATABASE_URL: str = "postgresql+psycopg://resumate:resumate@localhost:5432/resumate"
    BACKEND_CORS_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"
    AUTH_SESSION_TTL_HOURS: int = 720
    UPLOAD_DIR: str = "uploads"
    MAX_RESUME_UPLOAD_SIZE_MB: int = 8
    RESUME_IMAGE_PROCESSING_PROVIDER: str = "nebius"
    NEBIUS_API_KEY: str | None = None
    NEBIUS_BASE_URL: str = "https://api.tokenfactory.nebius.com/v1/"
    NEBIUS_MODEL: str = "google/gemma-3-27b-it-fast"
    CHUTES_API_TOKEN: str | None = None
    CHUTES_BASE_URL: str = "https://llm.chutes.ai/v1/"
    CHUTES_MODEL: str = "Qwen/Qwen3-VL-235B-A22B-Instruct"
    RESUME_ANALYSIS_MAX_PAGES: int = 2
    RESUME_ANALYSIS_MAX_TOKENS: int = 1200
    RESUME_ANALYSIS_TEMPERATURE: float = 0.35
    RESUME_ANALYSIS_TOP_P: float = 0.9
    RESUME_ANALYSIS_TOP_K: int = 50
    RESUME_RENDER_SCALE: float = 1.6
    RESUME_RENDER_MAX_WIDTH: int = 1400

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()
