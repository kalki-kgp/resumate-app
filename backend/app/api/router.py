from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.cover_letter import router as cover_letter_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.onboarding import router as onboarding_router
from app.api.v1.resumes import router as resumes_router
from app.api.v1.saved_resumes import router as saved_resumes_router
from app.api.v1.templates import router as templates_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(onboarding_router, prefix="/onboarding", tags=["onboarding"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(resumes_router, prefix="/resumes", tags=["resumes"])
api_router.include_router(saved_resumes_router, prefix="/saved-resumes", tags=["saved-resumes"])
api_router.include_router(cover_letter_router, prefix="/cover-letter", tags=["cover-letter"])
api_router.include_router(templates_router, prefix="/templates", tags=["templates"])
