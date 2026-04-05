from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_session, get_current_user, get_db
from app.core.config import settings
from app.models.auth_session import AuthSession
from app.models.referral import Referral
from app.models.user import User
from app.schemas.auth import AuthResponse, MessageResponse, SignInRequest, SignUpRequest, UserPublic
from app.utils.rate_limit import auth_rate_limiter
from app.utils.security import generate_session_token, hash_password, hash_session_token, verify_password

REFERRAL_REWARDS = [50, 100, 150]

router = APIRouter()


def _create_user_session(db: Session, user_id) -> str:
    raw_token = generate_session_token()
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.AUTH_SESSION_TTL_HOURS)
    db.add(
        AuthSession(
            user_id=user_id,
            token_hash=hash_session_token(raw_token),
            expires_at=expires_at,
        )
    )
    return raw_token


def _normalize_email(email: str) -> str:
    return email.strip().lower()


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(request: Request, payload: SignUpRequest, db: Session = Depends(get_db)):
    auth_rate_limiter.check(request)
    normalized_email = _normalize_email(str(payload.email))
    existing_user = db.scalar(select(User).where(User.email == normalized_email))
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        full_name=payload.full_name.strip(),
        email=normalized_email,
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    # Process referral code
    if payload.referral_code:
        referrer = db.scalar(
            select(User).where(User.referral_code == payload.referral_code.strip().upper())
        )
        if referrer and referrer.id != user.id:
            existing_count = db.scalar(
                select(func.count()).select_from(Referral).where(Referral.referrer_id == referrer.id)
            ) or 0
            user.referred_by = referrer.id
            if existing_count < len(REFERRAL_REWARDS):
                credits = REFERRAL_REWARDS[existing_count]
                db.add(Referral(
                    referrer_id=referrer.id,
                    referred_id=user.id,
                    credits_awarded=credits,
                ))
                referrer.credits += credits

    access_token = _create_user_session(db, user.id)
    db.commit()
    db.refresh(user)
    return AuthResponse(access_token=access_token, user=UserPublic.model_validate(user))


@router.post("/signin", response_model=AuthResponse)
def signin(request: Request, payload: SignInRequest, db: Session = Depends(get_db)):
    auth_rate_limiter.check(request)
    normalized_email = _normalize_email(str(payload.email))
    user = db.scalar(select(User).where(User.email == normalized_email))

    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = _create_user_session(db, user.id)
    db.commit()
    db.refresh(user)
    return AuthResponse(access_token=access_token, user=UserPublic.model_validate(user))


@router.get("/me", response_model=UserPublic)
def me(current_user: User = Depends(get_current_user)):
    return UserPublic.model_validate(current_user)


@router.post("/signout", response_model=MessageResponse)
def signout(
    current_session: AuthSession = Depends(get_current_session),
    db: Session = Depends(get_db),
):
    current_session.revoked_at = datetime.now(timezone.utc)
    db.add(current_session)
    db.commit()
    return MessageResponse(detail="Signed out successfully")
