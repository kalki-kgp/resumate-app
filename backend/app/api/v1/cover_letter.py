import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.cover_letter import (
    CoverLetterData,
    GenerateCoverLetterRequest,
    GenerateCoverLetterResponse,
    RefineParagraphRequest,
    RefineParagraphResponse,
)
from app.services.cover_letter import generate_cover_letter, refine_paragraph
from app.services.resumes import get_user_resume_by_id

logger = logging.getLogger(__name__)

router = APIRouter()

VALID_TONES = {"professional", "conversational", "confident", "enthusiastic"}
VALID_PARAGRAPH_TYPES = {"opening", "body", "closing"}


@router.post("/{resume_id}/generate", response_model=GenerateCoverLetterResponse)
def generate(
    resume_id: UUID,
    payload: GenerateCoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = get_user_resume_by_id(db, current_user.id, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if not resume.extracted_data:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No extracted data available. Analyze the resume first.",
        )

    tone = payload.tone.strip().lower()
    if tone not in VALID_TONES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid tone. Must be one of: {', '.join(sorted(VALID_TONES))}",
        )

    result = generate_cover_letter(
        extracted_data=resume.extracted_data,
        job_description=payload.job_description,
        tone=tone,
        additional_instructions=payload.additional_instructions,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Cover letter generation service unavailable. Please try again.",
        )

    try:
        cover_letter = CoverLetterData.model_validate(result)
    except Exception:
        logger.exception("Failed to validate cover letter data")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Generated data did not match expected schema.",
        )

    return GenerateCoverLetterResponse(
        resume_id=str(resume.id),
        cover_letter=cover_letter,
    )


@router.post("/refine-paragraph", response_model=RefineParagraphResponse)
def refine(
    payload: RefineParagraphRequest,
    current_user: User = Depends(get_current_user),
):
    if payload.paragraph_type not in VALID_PARAGRAPH_TYPES:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid paragraph_type. Must be one of: {', '.join(sorted(VALID_PARAGRAPH_TYPES))}",
        )

    refined = refine_paragraph(
        paragraph_text=payload.paragraph_text,
        paragraph_type=payload.paragraph_type,
        prompt=payload.prompt,
        context=payload.context,
    )

    if refined is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Paragraph refinement service unavailable. Please try again.",
        )

    return RefineParagraphResponse(
        refined_text=refined,
        paragraph_type=payload.paragraph_type,
    )
