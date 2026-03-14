from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.saved_resume import SavedResume
from app.models.user import User

router = APIRouter()


class SaveResumeRequest(BaseModel):
    title: str = Field(max_length=255)
    template: str = Field(default="modern", max_length=50)
    resume_data: dict[str, Any]
    source_resume_id: str | None = None


class UpdateResumeRequest(BaseModel):
    title: str | None = Field(default=None, max_length=255)
    template: str | None = Field(default=None, max_length=50)
    resume_data: dict[str, Any] | None = None


class SavedResumeResponse(BaseModel):
    id: str
    title: str
    template: str
    resume_data: dict[str, Any]
    source_resume_id: str | None
    created_at: str
    updated_at: str


class SavedResumeListItem(BaseModel):
    id: str
    title: str
    template: str
    created_at: str
    updated_at: str


def _to_response(sr: SavedResume) -> SavedResumeResponse:
    return SavedResumeResponse(
        id=str(sr.id),
        title=sr.title,
        template=sr.template,
        resume_data=sr.resume_data,
        source_resume_id=str(sr.source_resume_id) if sr.source_resume_id else None,
        created_at=sr.created_at.isoformat(),
        updated_at=sr.updated_at.isoformat(),
    )


@router.post("/save", response_model=SavedResumeResponse)
def save_resume(
    body: SaveResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sr = SavedResume(
        user_id=current_user.id,
        title=body.title,
        template=body.template,
        resume_data=body.resume_data,
        source_resume_id=UUID(body.source_resume_id) if body.source_resume_id else None,
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)
    return _to_response(sr)


@router.put("/{saved_resume_id}", response_model=SavedResumeResponse)
def update_saved_resume(
    saved_resume_id: UUID,
    body: UpdateResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sr = (
        db.query(SavedResume)
        .filter(SavedResume.id == saved_resume_id, SavedResume.user_id == current_user.id)
        .first()
    )
    if not sr:
        raise HTTPException(status_code=404, detail="Saved resume not found")

    if body.title is not None:
        sr.title = body.title
    if body.template is not None:
        sr.template = body.template
    if body.resume_data is not None:
        sr.resume_data = body.resume_data

    db.commit()
    db.refresh(sr)
    return _to_response(sr)


@router.get("/list", response_model=list[SavedResumeListItem])
def list_saved_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = (
        db.query(SavedResume)
        .filter(SavedResume.user_id == current_user.id)
        .order_by(SavedResume.updated_at.desc())
        .all()
    )
    return [
        SavedResumeListItem(
            id=str(sr.id),
            title=sr.title,
            template=sr.template,
            created_at=sr.created_at.isoformat(),
            updated_at=sr.updated_at.isoformat(),
        )
        for sr in rows
    ]


@router.get("/{saved_resume_id}", response_model=SavedResumeResponse)
def get_saved_resume(
    saved_resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sr = (
        db.query(SavedResume)
        .filter(SavedResume.id == saved_resume_id, SavedResume.user_id == current_user.id)
        .first()
    )
    if not sr:
        raise HTTPException(status_code=404, detail="Saved resume not found")
    return _to_response(sr)


@router.delete("/{saved_resume_id}")
def delete_saved_resume(
    saved_resume_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sr = (
        db.query(SavedResume)
        .filter(SavedResume.id == saved_resume_id, SavedResume.user_id == current_user.id)
        .first()
    )
    if not sr:
        raise HTTPException(status_code=404, detail="Saved resume not found")
    db.delete(sr)
    db.commit()
    return {"detail": "Deleted"}
