import json
import re
from pathlib import Path
from uuid import UUID

from sqlalchemy.orm import Session

from app.schemas.dashboard import DashboardResume
from app.schemas.onboarding import ResumeAnalysisResult
from app.services.resume_analysis import latest_analysis_result_path
from app.services.resumes import list_user_resumes, parse_resume_analysis


def _title_from_filename(filename: str) -> str:
    stem = Path(filename).stem
    normalized = re.sub(r"[_-]+", " ", stem).strip()
    return normalized.title() if normalized else "Untitled Resume"


def _load_latest_analysis_bundle(user_id: UUID) -> tuple[str | None, ResumeAnalysisResult | None]:
    path = latest_analysis_result_path(user_id)
    if not path.exists():
        return None, None

    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            return None, None

        resume_filename = payload.get("resume_filename")
        if not isinstance(resume_filename, str) or not resume_filename.strip():
            resume_filename = None

        analysis_payload = payload.get("analysis")
        if not isinstance(analysis_payload, dict):
            return resume_filename, None

        analysis = ResumeAnalysisResult.model_validate(analysis_payload)
        return resume_filename, analysis
    except Exception:
        return None, None


def list_user_dashboard_resumes(db: Session, user_id: UUID) -> list[DashboardResume]:
    resumes = list_user_resumes(db, user_id)
    fallback_filename, fallback_analysis = _load_latest_analysis_bundle(user_id)
    payload: list[DashboardResume] = []

    for resume in resumes:
        analysis = parse_resume_analysis(resume)
        if analysis is None and fallback_analysis is not None and fallback_filename is not None:
            if fallback_filename in {resume.stored_filename, Path(resume.file_path).name, resume.original_filename}:
                analysis = fallback_analysis

        payload.append(
            DashboardResume(
                id=str(resume.id),
                filename=resume.original_filename,
                title=_title_from_filename(resume.original_filename),
                uploaded_at=resume.uploaded_at,
                file_size_bytes=max(0, resume.file_size_bytes),
                analysis=analysis,
                thumbnail_url=f"/api/v1/resumes/{resume.id}/thumbnail",
            )
        )

    return payload
