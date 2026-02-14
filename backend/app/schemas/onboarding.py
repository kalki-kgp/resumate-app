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


class OnboardingStateResponse(BaseModel):
    stage: Stage
    phase: Phase
    selected_path: PathType | None
    current_step: int = Field(ge=0)
    target_role: str | None
    steps: list[OnboardingStep]
    updated_at: datetime


class ChoosePathRequest(BaseModel):
    path: PathType


class StepActionRequest(BaseModel):
    step_index: int = Field(ge=0)
    target_role: str | None = Field(default=None, max_length=160)
