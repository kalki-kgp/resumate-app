from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from threading import Lock
from typing import Literal
from uuid import UUID, uuid4

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.onboarding import ResumeAnalysisResult
from app.services.onboarding import advance_step, get_or_create_onboarding_progress
from app.services.resume_analysis import (
    ResumeAnalysisError,
    analyze_and_extract_resume,
    pdf_to_base64_png_images,
    save_latest_analysis_result,
)
from app.services.resumes import (
    get_user_resume_by_id,
    latest_user_resume,
    resolve_storage_path,
    set_resume_analysis,
    set_resume_extracted_data,
)

logger = logging.getLogger(__name__)

AnalysisJobStatus = Literal["processing", "completed", "failed"]


@dataclass
class OnboardingAnalysisJob:
    job_id: str
    user_id: str
    resume_id: str
    status: AnalysisJobStatus
    detail: str | None = None
    analysis: ResumeAnalysisResult | None = None


_job_lock = Lock()
_jobs: dict[str, OnboardingAnalysisJob] = {}
_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="onboarding-analysis")


def _clone_job(job: OnboardingAnalysisJob) -> OnboardingAnalysisJob:
    return OnboardingAnalysisJob(
        job_id=job.job_id,
        user_id=job.user_id,
        resume_id=job.resume_id,
        status=job.status,
        detail=job.detail,
        analysis=job.analysis,
    )


def get_onboarding_analysis_job(user_id: UUID | str) -> OnboardingAnalysisJob | None:
    with _job_lock:
        job = _jobs.get(str(user_id))
        return _clone_job(job) if job is not None else None


def start_onboarding_analysis_job(user_id: UUID, resume_id: UUID) -> OnboardingAnalysisJob:
    user_key = str(user_id)
    resume_key = str(resume_id)

    with _job_lock:
        existing = _jobs.get(user_key)
        if existing is not None and existing.status == "processing" and existing.resume_id == resume_key:
            return _clone_job(existing)

        job = OnboardingAnalysisJob(
            job_id=uuid4().hex,
            user_id=user_key,
            resume_id=resume_key,
            status="processing",
        )
        _jobs[user_key] = job

    _executor.submit(_run_onboarding_analysis_job, job.job_id, user_id, resume_id)
    return _clone_job(job)


def _set_job_state(
    *,
    user_id: UUID,
    job_id: str,
    status: AnalysisJobStatus,
    detail: str | None = None,
    analysis: ResumeAnalysisResult | None = None,
) -> None:
    with _job_lock:
        current = _jobs.get(str(user_id))
        if current is None or current.job_id != job_id:
            return

        current.status = status
        current.detail = detail
        current.analysis = analysis


def _run_onboarding_analysis_job(job_id: str, user_id: UUID, resume_id: UUID) -> None:
    db = SessionLocal()

    try:
        resume = get_user_resume_by_id(db, user_id, resume_id)
        if resume is None:
            _set_job_state(
                user_id=user_id,
                job_id=job_id,
                status="failed",
                detail="Resume not found for analysis.",
            )
            return

        resume_pdf_path = resolve_storage_path(resume.file_path)
        page_images = pdf_to_base64_png_images(
            resume_pdf_path,
            max_pages=settings.RESUME_ANALYSIS_MAX_PAGES,
        )
        analysis, extracted_data = analyze_and_extract_resume(page_images)

        updated_resume = set_resume_analysis(db, resume, analysis)
        if extracted_data is not None:
            updated_resume = set_resume_extracted_data(db, updated_resume, extracted_data)

        latest_resume = latest_user_resume(db, user_id)
        if latest_resume is not None and latest_resume.id == updated_resume.id:
            save_latest_analysis_result(user_id, resume_pdf_path, analysis)

            user = db.get(User, user_id)
            if user is not None:
                progress = get_or_create_onboarding_progress(db, user)
                if (
                    progress.selected_path == "upload"
                    and progress.phase == "steps"
                    and progress.stage == "onboarding"
                    and progress.current_step == 1
                ):
                    target_role = analysis.recommended_roles[0].title if analysis.recommended_roles else None
                    advance_step(db, progress, step_index=1, target_role=target_role)

        _set_job_state(
            user_id=user_id,
            job_id=job_id,
            status="completed",
            analysis=analysis,
        )
    except ResumeAnalysisError as exc:
        logger.warning("Onboarding analysis job failed: %s", exc)
        _set_job_state(
            user_id=user_id,
            job_id=job_id,
            status="failed",
            detail=str(exc),
        )
    except Exception as exc:
        logger.exception("Unexpected onboarding analysis job failure")
        _set_job_state(
            user_id=user_id,
            job_id=job_id,
            status="failed",
            detail=f"Analysis failed: {exc}",
        )
    finally:
        db.close()
