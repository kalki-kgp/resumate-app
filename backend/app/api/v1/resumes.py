import re
from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.user import User
from app.schemas.dashboard import DashboardResume
from app.services.resumes import (
    ensure_resume_thumbnail,
    get_resume_by_id,
    parse_resume_analysis,
    save_user_uploaded_resume,
)

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
    db: Session = Depends(get_db),
):
    resume = get_resume_by_id(db, resume_id)
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
