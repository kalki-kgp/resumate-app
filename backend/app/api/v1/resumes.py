import logging
import re
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, File, Form, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.dashboard import DashboardResume
from app.schemas.resumes import (
    AIWriteRequest,
    AIWriteResponse,
    ExtractedDataResponse,
    FillTemplateRequest,
    FillTemplateResponse,
    ResumeDataFilled,
)
from app.services.resume_analysis import (
    ResumeAnalysisError,
    analyze_and_extract_resume,
    pdf_to_base64_png_images,
    save_latest_analysis_result,
)
from app.services.resumes import (
    delete_user_resume,
    ensure_resume_thumbnail,
    get_user_resume_by_id,
    get_resume_by_id,
    parse_resume_analysis,
    resolve_storage_path,
    save_user_uploaded_resume,
    set_resume_analysis,
    set_resume_extracted_data,
)
from app.services.ai_write import generate_ai_text
from app.services.template_fill import fill_template_from_extracted_data

logger = logging.getLogger(__name__)

router = APIRouter()


def _title_from_filename(filename: str) -> str:
    stem = Path(filename).stem
    normalized = re.sub(r"[_-]+", " ", stem).strip()
    return normalized.title() if normalized else "Untitled Resume"


@router.post("/upload", response_model=DashboardResume)
async def upload_resume_to_library(
    file: UploadFile = File(...),
    source: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _ = source  # reserved for future source tracking

    filename = (file.filename or "").strip()
    if not filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Only PDF files are allowed")

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
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid PDF file format")

    resume = save_user_uploaded_resume(
        db=db,
        user_id=current_user.id,
        original_filename=filename,
        content=content,
    )
    await file.close()

    return DashboardResume(
        id=str(resume.id),
        filename=resume.original_filename,
        title=_title_from_filename(resume.original_filename),
        uploaded_at=resume.uploaded_at,
        file_size_bytes=max(0, resume.file_size_bytes),
        analysis=parse_resume_analysis(resume),
        thumbnail_url=f"/api/v1/resumes/{resume.id}/thumbnail",
    )


@router.get("/{resume_id}/thumbnail")
def get_resume_thumbnail(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume_by_id(db, current_user.id, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    thumbnail_path = ensure_resume_thumbnail(resume)
    if thumbnail_path is None or not thumbnail_path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Thumbnail not available")

    return FileResponse(
        path=str(thumbnail_path),
        media_type="image/png",
        filename=f"{resume_id}.png",
        headers={"Cache-Control": "private, max-age=300"},
    )


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    deleted = delete_user_resume(db, current_user.id, resume_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")


@router.post("/{resume_id}/analyze", response_model=DashboardResume)
def analyze_resume_from_library(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume_by_id(db, current_user.id, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    resume_pdf_path = resolve_storage_path(resume.file_path)
    try:
        page_images = pdf_to_base64_png_images(
            resume_pdf_path,
            max_pages=settings.RESUME_ANALYSIS_MAX_PAGES,
        )
        analysis, extracted_data = analyze_and_extract_resume(page_images)
    except ResumeAnalysisError as exc:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Analysis failed: {exc}") from exc

    save_latest_analysis_result(current_user.id, resume_pdf_path, analysis)
    updated_resume = set_resume_analysis(db, resume, analysis)
    if extracted_data is not None:
        updated_resume = set_resume_extracted_data(db, updated_resume, extracted_data)

    return DashboardResume(
        id=str(updated_resume.id),
        filename=updated_resume.original_filename,
        title=_title_from_filename(updated_resume.original_filename),
        uploaded_at=updated_resume.uploaded_at,
        file_size_bytes=max(0, updated_resume.file_size_bytes),
        analysis=parse_resume_analysis(updated_resume),
        thumbnail_url=f"/api/v1/resumes/{updated_resume.id}/thumbnail",
    )


@router.get("/{resume_id}/extracted-data", response_model=ExtractedDataResponse)
def get_extracted_data(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume_by_id(db, current_user.id, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    return ExtractedDataResponse(
        resume_id=str(resume.id),
        extracted_data=resume.extracted_data,
    )


@router.post("/{resume_id}/fill-template", response_model=FillTemplateResponse)
def fill_template(
    resume_id: UUID,
    payload: FillTemplateRequest | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume_by_id(db, current_user.id, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    extracted = (payload.extracted_data_override if payload else None) or resume.extracted_data
    if not extracted:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No extracted data available. Analyze the resume first.",
        )

    filled = fill_template_from_extracted_data(extracted)
    if filled is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Template fill service unavailable. Please try again.",
        )

    try:
        data = ResumeDataFilled.model_validate(filled)
    except Exception:
        logger.exception("Failed to validate filled template data")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Filled data did not match expected schema.",
        )

    return FillTemplateResponse(
        resume_id=str(resume.id),
        data=data,
    )


AI_CREDIT_COST = 5


@router.post("/ai-write", response_model=AIWriteResponse)
def ai_write(
    payload: AIWriteRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.credits < AI_CREDIT_COST:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail=f"Insufficient credits. You need {AI_CREDIT_COST} credits but have {current_user.credits}.",
        )

    valid_sections = {"summary", "experience", "project", "skills"}
    if payload.section_type not in valid_sections:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid section_type. Must be one of: {', '.join(sorted(valid_sections))}",
        )

    generated = generate_ai_text(
        section_type=payload.section_type,
        prompt=payload.prompt,
        current_text=payload.current_text,
        context=payload.context,
    )

    if generated is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI writing service unavailable. Please try again.",
        )

    current_user.credits -= AI_CREDIT_COST
    db.add(current_user)
    db.commit()

    return AIWriteResponse(
        generated_text=generated,
        section_type=payload.section_type,
    )
