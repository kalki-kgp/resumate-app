import re
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID, uuid4

import pypdfium2 as pdfium
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.resume import Resume
from app.schemas.onboarding import ResumeAnalysisResult


def _upload_root() -> Path:
    return Path(settings.UPLOAD_DIR)


def _safe_filename(filename: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "_", Path(filename).name)
    if cleaned.lower().endswith(".pdf"):
        return cleaned
    return f"{cleaned}.pdf"


def _user_resume_dir(user_id: UUID | str) -> Path:
    return _upload_root() / "resumes" / str(user_id)


def _thumbnail_name(stored_filename: str) -> str:
    return f"{Path(stored_filename).stem}.thumb.png"


def _render_first_page_thumbnail(pdf_path: Path, thumbnail_path: Path) -> bool:
    if not pdf_path.exists():
        return False

    document = pdfium.PdfDocument(str(pdf_path))
    try:
        if len(document) < 1:
            return False

        page = document[0]
        rendered = page.render(scale=1.2, rotation=0)
        image = rendered.to_pil()

        max_width = 320
        if image.width > max_width:
            ratio = max_width / image.width
            resized_height = max(1, int(image.height * ratio))
            image = image.resize((max_width, resized_height))

        thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(thumbnail_path, format="PNG", optimize=True)

        if hasattr(rendered, "close"):
            rendered.close()
        if hasattr(page, "close"):
            page.close()

        return True
    finally:
        if hasattr(document, "close"):
            document.close()


def _relative_to_upload_root(path: Path) -> str:
    try:
        return path.relative_to(_upload_root()).as_posix()
    except ValueError:
        return path.as_posix()


def resolve_storage_path(relative_or_absolute: str) -> Path:
    raw = Path(relative_or_absolute)
    if raw.is_absolute():
        return raw
    return _upload_root() / raw


def save_user_uploaded_resume(
    db: Session,
    user_id: UUID,
    original_filename: str,
    content: bytes,
) -> Resume:
    safe_basename = _safe_filename(original_filename)
    unique_stem = f"{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}_{uuid4().hex[:8]}"
    stored_filename = f"{unique_stem}_{safe_basename}"

    resume_dir = _user_resume_dir(user_id)
    resume_dir.mkdir(parents=True, exist_ok=True)

    pdf_path = resume_dir / stored_filename
    pdf_path.write_bytes(content)

    thumbnail_path = resume_dir / _thumbnail_name(stored_filename)
    has_thumbnail = _render_first_page_thumbnail(pdf_path, thumbnail_path)

    resume = Resume(
        user_id=user_id,
        original_filename=Path(original_filename).name,
        stored_filename=stored_filename,
        file_path=_relative_to_upload_root(pdf_path),
        thumbnail_path=_relative_to_upload_root(thumbnail_path) if has_thumbnail else None,
        mime_type="application/pdf",
        file_size_bytes=len(content),
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def list_user_resumes(db: Session, user_id: UUID) -> list[Resume]:
    sync_user_resumes_from_disk(db, user_id)
    return list(
        db.scalars(
            select(Resume).where(Resume.user_id == user_id).order_by(desc(Resume.uploaded_at))
        ).all()
    )


def latest_user_resume(db: Session, user_id: UUID) -> Resume | None:
    sync_user_resumes_from_disk(db, user_id)
    return db.scalar(
        select(Resume)
        .where(Resume.user_id == user_id)
        .order_by(desc(Resume.uploaded_at))
        .limit(1)
    )


def get_user_resume_by_id(db: Session, user_id: UUID, resume_id: UUID) -> Resume | None:
    return db.scalar(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == user_id,
        )
    )


def get_resume_by_id(db: Session, resume_id: UUID) -> Resume | None:
    return db.get(Resume, resume_id)


def set_resume_analysis(
    db: Session,
    resume: Resume,
    analysis: ResumeAnalysisResult,
) -> Resume:
    resume.analysis_payload = analysis.model_dump(mode="json")
    resume.last_analyzed_at = datetime.now(timezone.utc)
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume


def parse_resume_analysis(resume: Resume) -> ResumeAnalysisResult | None:
    payload = resume.analysis_payload
    if not isinstance(payload, dict):
        return None
    try:
        return ResumeAnalysisResult.model_validate(payload)
    except Exception:
        return None


def ensure_resume_thumbnail(resume: Resume) -> Path | None:
    pdf_path = resolve_storage_path(resume.file_path)
    thumbnail_path = resolve_storage_path(resume.thumbnail_path) if resume.thumbnail_path else None

    if thumbnail_path and thumbnail_path.exists():
        return thumbnail_path

    fallback_thumbnail = pdf_path.parent / _thumbnail_name(resume.stored_filename)
    if fallback_thumbnail.exists():
        return fallback_thumbnail

    created = _render_first_page_thumbnail(pdf_path, fallback_thumbnail)
    if not created:
        return None
    return fallback_thumbnail


def sync_user_resumes_from_disk(db: Session, user_id: UUID) -> None:
    resume_dir = _user_resume_dir(user_id)
    if not resume_dir.exists():
        return

    existing = list(
        db.scalars(
            select(Resume).where(Resume.user_id == user_id)
        ).all()
    )
    existing_paths = {item.file_path for item in existing}

    created_any = False
    for pdf_path in resume_dir.glob("*.pdf"):
        relative_pdf_path = _relative_to_upload_root(pdf_path)
        if relative_pdf_path in existing_paths:
            continue

        stat = pdf_path.stat()
        stored_filename = pdf_path.name
        thumbnail_path = pdf_path.parent / _thumbnail_name(stored_filename)
        has_thumbnail = thumbnail_path.exists()

        db.add(
            Resume(
                user_id=user_id,
                original_filename=stored_filename,
                stored_filename=stored_filename,
                file_path=relative_pdf_path,
                thumbnail_path=_relative_to_upload_root(thumbnail_path) if has_thumbnail else None,
                mime_type="application/pdf",
                file_size_bytes=stat.st_size,
                uploaded_at=datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc),
            )
        )
        created_any = True

    if created_any:
        db.commit()
