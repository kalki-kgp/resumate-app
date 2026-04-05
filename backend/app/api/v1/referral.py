from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.core.config import settings
from app.models.referral import Referral
from app.models.user import User
from app.schemas.referral import ReferralEntry, ReferralInfo

router = APIRouter()

REFERRAL_REWARDS = [50, 100, 150]
MAX_REFERRAL_CREDITS = 300


@router.get("/info", response_model=ReferralInfo)
def get_referral_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    referrals = db.execute(
        select(Referral, User.full_name)
        .join(User, Referral.referred_id == User.id)
        .where(Referral.referrer_id == current_user.id)
        .order_by(Referral.created_at.asc())
    ).all()

    entries = []
    total_credits = 0
    for ref, referred_name in referrals:
        first_name = referred_name.split()[0] if referred_name else "User"
        entries.append(ReferralEntry(
            referred_name=first_name,
            credits_awarded=ref.credits_awarded,
            created_at=ref.created_at,
        ))
        total_credits += ref.credits_awarded

    count = len(entries)
    next_reward = REFERRAL_REWARDS[count] if count < len(REFERRAL_REWARDS) else 0

    return ReferralInfo(
        referral_code=current_user.referral_code,
        referral_link=f"{settings.FRONTEND_URL}/home?ref={current_user.referral_code}",
        total_referrals=count,
        total_credits_earned=total_credits,
        max_credits=MAX_REFERRAL_CREDITS,
        next_reward=next_reward,
        referrals=entries,
    )
