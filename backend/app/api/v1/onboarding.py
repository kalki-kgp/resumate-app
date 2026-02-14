from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.onboarding import ChoosePathRequest, OnboardingStateResponse, StepActionRequest
from app.services.onboarding import (
    advance_step,
    back_to_options,
    choose_path,
    get_or_create_onboarding_progress,
    progress_to_response,
    skip_onboarding,
)

router = APIRouter()


@router.get("", response_model=OnboardingStateResponse)
def get_onboarding_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    return progress_to_response(progress)


@router.post("/choose", response_model=OnboardingStateResponse)
def choose_onboarding_path(
    payload: ChoosePathRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = choose_path(db, progress, payload.path)
    return progress_to_response(progress)


@router.post("/step-action", response_model=OnboardingStateResponse)
def onboarding_step_action(
    payload: StepActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = advance_step(db, progress, payload.step_index, payload.target_role)
    return progress_to_response(progress)


@router.post("/back-to-options", response_model=OnboardingStateResponse)
def onboarding_back_to_options(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = back_to_options(db, progress)
    return progress_to_response(progress)


@router.post("/skip", response_model=OnboardingStateResponse)
def onboarding_skip(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = skip_onboarding(db, progress)
    return progress_to_response(progress)
