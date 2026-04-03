from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session


from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.onboarding import (
    AnalyzeResumeJobResponse,
    ChoosePathRequest,
    OnboardingStateResponse,
    StepActionRequest,
)
from app.services.onboarding_analysis_jobs import (
    get_onboarding_analysis_job,
    start_onboarding_analysis_job,
)
from app.services.resume_analysis import (
    clear_latest_analysis_result,
    load_latest_analysis_result,
)
from app.services.resumes import (
    latest_user_resume,
    parse_resume_analysis,
    save_user_uploaded_resume,
)
from app.services.onboarding import (
    advance_step,
    back_to_options,
    choose_path,
    ensure_analysis_step_active,
    ensure_upload_step_active,
    get_or_create_onboarding_progress,
    progress_to_response,
    skip_onboarding,
)

router = APIRouter()

ONBOARDING_CREDIT_REWARD = 100


def _grant_onboarding_credits(db: Session, user: User) -> None:
    """Grant credits to user when they complete onboarding (only once)."""
    if user.credits == 0:
        user.credits = ONBOARDING_CREDIT_REWARD
        db.add(user)
        db.commit()
        db.refresh(user)


def _load_existing_onboarding_analysis(db: Session, user: User):
    latest_resume = latest_user_resume(db, user.id)
    if latest_resume is not None:
        analysis = parse_resume_analysis(latest_resume)
        if analysis is not None:
            return analysis
    return load_latest_analysis_result(user.id)


def _build_analysis_job_response(
    *,
    progress,
    status: str,
    analysis,
    detail: str | None = None,
):
    onboarding_state = progress_to_response(progress, analysis)
    return AnalyzeResumeJobResponse(
        status=status,
        onboarding=onboarding_state,
        analysis=analysis,
        detail=detail,
    )


@router.get("", response_model=OnboardingStateResponse)
def get_onboarding_state(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    analysis = load_latest_analysis_result(current_user.id)
    return progress_to_response(progress, analysis)


@router.post("/choose", response_model=OnboardingStateResponse)
def choose_onboarding_path(
    payload: ChoosePathRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = choose_path(db, progress, payload.path)
    if progress.stage == "workspace":
        _grant_onboarding_credits(db, current_user)
    analysis = load_latest_analysis_result(current_user.id)
    return progress_to_response(progress, analysis)


@router.post("/step-action", response_model=OnboardingStateResponse)
def onboarding_step_action(
    payload: StepActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = advance_step(db, progress, payload.step_index, payload.target_role)
    if progress.stage == "workspace":
        _grant_onboarding_credits(db, current_user)
    analysis = load_latest_analysis_result(current_user.id)
    return progress_to_response(progress, analysis)


@router.post("/back-to-options", response_model=OnboardingStateResponse)
def onboarding_back_to_options(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = back_to_options(db, progress)
    analysis = load_latest_analysis_result(current_user.id)
    return progress_to_response(progress, analysis)


@router.post("/skip", response_model=OnboardingStateResponse)
def onboarding_skip(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    progress = skip_onboarding(db, progress)
    _grant_onboarding_credits(db, current_user)
    analysis = load_latest_analysis_result(current_user.id)
    return progress_to_response(progress, analysis)


@router.post("/upload-resume", response_model=OnboardingStateResponse)
async def onboarding_upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    ensure_upload_step_active(progress)

    filename = (file.filename or "").strip()
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Only PDF files are allowed",
        )

    content = await file.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Uploaded file is empty")

    max_bytes = settings.MAX_RESUME_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds {settings.MAX_RESUME_UPLOAD_SIZE_MB}MB limit",
        )

    if not content.startswith(b"%PDF"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Invalid PDF file format",
        )

    save_user_uploaded_resume(
        db=db,
        user_id=current_user.id,
        original_filename=filename,
        content=content,
    )
    await file.close()
    clear_latest_analysis_result(current_user.id)

    progress = advance_step(db, progress, step_index=0)
    return progress_to_response(progress, analysis=None)


@router.post("/analyze-resume", response_model=AnalyzeResumeJobResponse)
def onboarding_analyze_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    if progress.current_step != 1:
        existing_analysis = _load_existing_onboarding_analysis(db, current_user)
        if (
            progress.selected_path == "upload"
            and progress.phase == "steps"
            and progress.stage == "onboarding"
            and progress.current_step >= 2
            and existing_analysis is not None
        ):
            return _build_analysis_job_response(
                progress=progress,
                status="completed",
                analysis=existing_analysis,
            )

    ensure_analysis_step_active(progress)

    latest_resume = latest_user_resume(db, current_user.id)
    if latest_resume is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No uploaded resume found. Upload a resume first.",
        )
    job = get_onboarding_analysis_job(current_user.id)
    if job is not None and job.status == "processing" and job.resume_id == str(latest_resume.id):
        return _build_analysis_job_response(
            progress=progress,
            status="processing",
            analysis=None,
        )

    start_onboarding_analysis_job(current_user.id, latest_resume.id)
    return _build_analysis_job_response(
        progress=progress,
        status="processing",
        analysis=None,
    )


@router.get("/analyze-resume-status", response_model=AnalyzeResumeJobResponse)
def onboarding_analyze_resume_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    existing_analysis = _load_existing_onboarding_analysis(db, current_user)
    job = get_onboarding_analysis_job(current_user.id)

    if job is not None:
        if job.status == "processing":
            return _build_analysis_job_response(
                progress=progress,
                status="processing",
                analysis=None,
            )
        if job.status == "failed":
            return _build_analysis_job_response(
                progress=progress,
                status="failed",
                analysis=existing_analysis,
                detail=job.detail,
            )
        if job.status == "completed":
            return _build_analysis_job_response(
                progress=progress,
                status="completed",
                analysis=existing_analysis or job.analysis,
            )

    if existing_analysis is not None and progress.current_step >= 2:
        return _build_analysis_job_response(
            progress=progress,
            status="completed",
            analysis=existing_analysis,
        )

    return _build_analysis_job_response(
        progress=progress,
        status="idle",
        analysis=existing_analysis,
    )
