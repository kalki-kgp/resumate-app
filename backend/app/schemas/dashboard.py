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


class DashboardSavedResume(BaseModel):
    id: str
    title: str
    template: str
    created_at: str
    updated_at: str


class DashboardCoverLetter(BaseModel):
    id: str
    company_name: str
    tone: str
    sender_name: str
    created_at: str


class DashboardResponse(BaseModel):
    display_name: str
    target_role: str | None
    selected_resume_id: str | None
    resumes: list[DashboardResume] = Field(default_factory=list)
    saved_resumes: list[DashboardSavedResume] = Field(default_factory=list)
    cover_letters: list[DashboardCoverLetter] = Field(default_factory=list)
