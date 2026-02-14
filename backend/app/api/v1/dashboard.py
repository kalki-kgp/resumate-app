from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard import list_user_dashboard_resumes

router = APIRouter()


@router.get("", response_model=DashboardResponse)
def get_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resumes = list_user_dashboard_resumes(db, current_user.id)
    selected_resume_id = resumes[0].id if resumes else None
    target_role = current_user.onboarding_progress.target_role if current_user.onboarding_progress else None
    first_name = current_user.full_name.strip().split(" ")[0] if current_user.full_name else "there"

    return DashboardResponse(
        display_name=first_name or "there",
        target_role=target_role,
        selected_resume_id=selected_resume_id,
        resumes=resumes,
    )
