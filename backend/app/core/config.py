from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    PROJECT_NAME: str = "ResuMate API"
    VERSION: str = "0.1.0"
    DATABASE_URL: str = "postgresql+psycopg://resumate:resumate@localhost:5432/resumate"


settings = Settings()
