from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.onboarding_progress import OnboardingProgress
from app.models.user import User
from app.schemas.onboarding import OnboardingStateResponse, OnboardingStep

ONBOARDING_STEPS: list[OnboardingStep] = [
    OnboardingStep(
        index=0,
        title="Upload Resume",
        description="Import your existing resume for AI-powered optimization",
        action="Upload Resume",
    ),
    OnboardingStep(
        index=1,
        title="AI Analysis",
        description="Get instant ATS score and AI-powered improvement suggestions",
        action="Analyze Resume",
    ),
    OnboardingStep(
        index=2,
        title="Find Jobs",
        description="Discover jobs that match your skills and experience",
        action="Browse Jobs",
    ),
    OnboardingStep(
        index=3,
        title="Apply & Track",
        description="Apply with tailored resumes and track your applications",
        action="Start Applying",
    ),
]


def get_or_create_onboarding_progress(db: Session, user: User) -> OnboardingProgress:
    progress = user.onboarding_progress
    if progress is not None:
        return progress

    progress = OnboardingProgress(user_id=user.id)
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def progress_to_response(progress: OnboardingProgress) -> OnboardingStateResponse:
    return OnboardingStateResponse(
        stage=progress.stage,
        phase=progress.phase,
        selected_path=progress.selected_path,
        current_step=progress.current_step,
        target_role=progress.target_role,
        steps=ONBOARDING_STEPS,
        updated_at=progress.updated_at,
    )


def choose_path(db: Session, progress: OnboardingProgress, path: str) -> OnboardingProgress:
    now = datetime.now(timezone.utc)
    progress.selected_path = path

    if path == "upload":
        progress.stage = "onboarding"
        progress.phase = "steps"
        progress.current_step = 0
        progress.completed_at = None
    elif path == "create":
        progress.stage = "workspace"
        progress.phase = "choice"
        progress.current_step = 0
        progress.completed_at = now
    else:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid onboarding path")

    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def back_to_options(db: Session, progress: OnboardingProgress) -> OnboardingProgress:
    progress.stage = "onboarding"
    progress.phase = "choice"
    progress.current_step = 0
    progress.selected_path = None
    progress.completed_at = None
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def skip_onboarding(db: Session, progress: OnboardingProgress) -> OnboardingProgress:
    progress.stage = "workspace"
    progress.completed_at = datetime.now(timezone.utc)
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def advance_step(
    db: Session,
    progress: OnboardingProgress,
    step_index: int,
    target_role: str | None = None,
) -> OnboardingProgress:
    if progress.selected_path != "upload" or progress.phase != "steps":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Upload onboarding path is not active",
        )

    if progress.stage != "onboarding":
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Onboarding already completed")

    if step_index != progress.current_step:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Expected step {progress.current_step}, got {step_index}",
        )

    if step_index < 0 or step_index >= len(ONBOARDING_STEPS):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid onboarding step")

    if step_index == 2:
        normalized_target_role = (target_role or "").strip()
        progress.target_role = normalized_target_role or progress.target_role or "Senior Product Designer"

    if step_index < len(ONBOARDING_STEPS) - 1:
        progress.current_step += 1
    else:
        progress.stage = "workspace"
        progress.completed_at = datetime.now(timezone.utc)

    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress
