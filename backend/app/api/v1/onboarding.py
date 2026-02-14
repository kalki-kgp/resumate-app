from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.onboarding import (
    AnalyzeResumeResponse,
    ChoosePathRequest,
    OnboardingStateResponse,
    StepActionRequest,
)
from app.services.resume_analysis import (
    ResumeAnalysisError,
    analyze_resume_with_nebius,
    clear_latest_analysis_result,
    load_latest_analysis_result,
    pdf_to_base64_png_images,
    save_latest_analysis_result,
)
from app.services.resumes import latest_user_resume, save_user_uploaded_resume, set_resume_analysis, resolve_storage_path
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


@router.post("/analyze-resume", response_model=AnalyzeResumeResponse)
def onboarding_analyze_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    progress = get_or_create_onboarding_progress(db, current_user)
    ensure_analysis_step_active(progress)

    latest_resume = latest_user_resume(db, current_user.id)
    if latest_resume is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No uploaded resume found. Upload a resume first.",
        )
    resume_pdf_path = resolve_storage_path(latest_resume.file_path)

    try:
        page_images = pdf_to_base64_png_images(
            resume_pdf_path,
            max_pages=settings.RESUME_ANALYSIS_MAX_PAGES,
        )
        analysis = analyze_resume_with_nebius(page_images)
    except ResumeAnalysisError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Analysis failed: {exc}") from exc

    save_latest_analysis_result(current_user.id, resume_pdf_path, analysis)
    set_resume_analysis(db, latest_resume, analysis)

    target_role = analysis.recommended_roles[0].title if analysis.recommended_roles else None
    progress = advance_step(db, progress, step_index=1, target_role=target_role)
    onboarding_state = progress_to_response(progress, analysis)
    return AnalyzeResumeResponse(onboarding=onboarding_state, analysis=analysis)
