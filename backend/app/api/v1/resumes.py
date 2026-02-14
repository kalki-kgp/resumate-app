from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.services.resumes import ensure_resume_thumbnail, get_resume_by_id

router = APIRouter()


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
