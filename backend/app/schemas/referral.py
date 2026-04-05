from datetime import datetime

from pydantic import BaseModel


class ReferralEntry(BaseModel):
    referred_name: str
    credits_awarded: int
    created_at: datetime


class ReferralInfo(BaseModel):
    referral_code: str
    referral_link: str
    total_referrals: int
    total_credits_earned: int
    max_credits: int = 300
    next_reward: int
    referrals: list[ReferralEntry]
