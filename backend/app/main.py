import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text

from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models import auth_session, cover_letter, onboarding_progress, resume, user  # noqa: F401

logger = logging.getLogger(__name__)


def _apply_pending_column_migrations() -> None:
    """Add columns that create_all cannot add to existing tables."""
    inspector = inspect(engine)
    if not inspector.has_table("resumes"):
        return

    existing_columns = {col["name"] for col in inspector.get_columns("resumes")}
    if "extracted_data" not in existing_columns:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE resumes ADD COLUMN extracted_data JSON"))
        logger.info("Added extracted_data column to resumes table")


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    _apply_pending_column_migrations()
    yield


app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
