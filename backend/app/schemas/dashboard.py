from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.onboarding import ResumeAnalysisResult


class DashboardResume(BaseModel):
    id: str
    filename: str
    title: str
    uploaded_at: datetime
    file_size_bytes: int = Field(ge=0)
    analysis: ResumeAnalysisResult | None = None
    thumbnail_url: str | None = None


class DashboardResponse(BaseModel):
    display_name: str
    target_role: str | None
    selected_resume_id: str | None
    resumes: list[DashboardResume] = Field(default_factory=list)
