import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.cover_letter import CoverLetter
from app.models.user import User
from app.schemas.cover_letter import (
    CoverLetterData,
    GenerateCoverLetterRequest,
    GenerateCoverLetterResponse,
    RefineParagraphRequest,
    RefineParagraphResponse,
    SaveCoverLetterRequest,
    SavedCoverLetterListItem,
    SavedCoverLetterResponse,
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

    # Always use the authenticated user's name — never trust LLM output for this
    result["senderName"] = current_user.full_name

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


@router.post("/save", response_model=SavedCoverLetterResponse)
def save_cover_letter(
    payload: SaveCoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume_uuid = None
    if payload.resume_id:
        try:
            resume_uuid = UUID(payload.resume_id)
        except ValueError:
            pass

    cl = CoverLetter(
        user_id=current_user.id,
        resume_id=resume_uuid,
        company_name=payload.cover_letter.companyName or "",
        job_description=payload.job_description,
        tone=payload.tone,
        cover_letter_data=payload.cover_letter.model_dump(),
    )
    db.add(cl)
    db.commit()
    db.refresh(cl)

    return SavedCoverLetterResponse(
        id=str(cl.id),
        resume_id=str(cl.resume_id) if cl.resume_id else None,
        company_name=cl.company_name,
        tone=cl.tone,
        cover_letter=CoverLetterData.model_validate(cl.cover_letter_data),
        created_at=cl.created_at.isoformat(),
        updated_at=cl.updated_at.isoformat(),
    )


@router.get("/list", response_model=list[SavedCoverLetterListItem])
def list_cover_letters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(CoverLetter)
        .filter(CoverLetter.user_id == current_user.id)
        .order_by(CoverLetter.created_at.desc())
        .all()
    )

    return [
        SavedCoverLetterListItem(
            id=str(cl.id),
            company_name=cl.company_name or "Unknown Company",
            tone=cl.tone,
            sender_name=cl.cover_letter_data.get("senderName", "") if isinstance(cl.cover_letter_data, dict) else "",
            created_at=cl.created_at.isoformat(),
        )
        for cl in rows
    ]


@router.get("/{cover_letter_id}", response_model=SavedCoverLetterResponse)
def get_cover_letter(
    cover_letter_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cl = (
        db.query(CoverLetter)
        .filter(CoverLetter.id == cover_letter_id, CoverLetter.user_id == current_user.id)
        .first()
    )
    if cl is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover letter not found")

    return SavedCoverLetterResponse(
        id=str(cl.id),
        resume_id=str(cl.resume_id) if cl.resume_id else None,
        company_name=cl.company_name,
        tone=cl.tone,
        cover_letter=CoverLetterData.model_validate(cl.cover_letter_data),
        created_at=cl.created_at.isoformat(),
        updated_at=cl.updated_at.isoformat(),
    )


@router.delete("/{cover_letter_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cover_letter(
    cover_letter_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    cl = (
        db.query(CoverLetter)
        .filter(CoverLetter.id == cover_letter_id, CoverLetter.user_id == current_user.id)
        .first()
    )
    if cl is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cover letter not found")

    db.delete(cl)
    db.commit()
