from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field

Stage = Literal["onboarding", "workspace"]
Phase = Literal["choice", "steps"]
PathType = Literal["upload", "create"]


class OnboardingStep(BaseModel):
    index: int
    title: str
    description: str
    action: str


class ResumeAnalysisRole(BaseModel):
    title: str
    reason: str


class ResumeAnalysisBullet(BaseModel):
    original: str
    improved: str


class ResumeAnalysisCategoryScores(BaseModel):
    impact: int | None = Field(default=None, ge=0, le=100)
    brevity: int | None = Field(default=None, ge=0, le=100)
    style: int | None = Field(default=None, ge=0, le=100)
    soft_skills: int | None = Field(default=None, ge=0, le=100)


class ResumeAnalysisSectionScores(BaseModel):
    headline: int | None = Field(default=None, ge=0, le=10)
    summary: int | None = Field(default=None, ge=0, le=10)
    experience: int | None = Field(default=None, ge=0, le=10)
    education: int | None = Field(default=None, ge=0, le=10)


class ResumeAnalysisResult(BaseModel):
    candidate_headline: str | None = None
    summary: str | None = None
    ats_score_estimate: int | None = Field(default=None, ge=0, le=100)
    category_scores: ResumeAnalysisCategoryScores | None = None
    section_scores: ResumeAnalysisSectionScores | None = None
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    priority_fixes: list[str] = Field(default_factory=list)
    keywords_to_add: list[str] = Field(default_factory=list)
    recommended_roles: list[ResumeAnalysisRole] = Field(default_factory=list)
    improved_bullets: list[ResumeAnalysisBullet] = Field(default_factory=list)
    confidence_note: str | None = None
    raw_response: str | None = None
    analyzed_at: datetime | None = None


class OnboardingStateResponse(BaseModel):
    stage: Stage
    phase: Phase
    selected_path: PathType | None
    current_step: int = Field(ge=0)
    target_role: str | None
    steps: list[OnboardingStep]
    analysis: ResumeAnalysisResult | None = None
    updated_at: datetime


class ChoosePathRequest(BaseModel):
    path: PathType


class StepActionRequest(BaseModel):
    step_index: int = Field(ge=0)
    target_role: str | None = Field(default=None, max_length=160)


class AnalyzeResumeResponse(BaseModel):
    onboarding: OnboardingStateResponse
    analysis: ResumeAnalysisResult
