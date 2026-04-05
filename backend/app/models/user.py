import secrets
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def _generate_referral_code() -> str:
    return secrets.token_urlsafe(8)[:10].upper()


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    credits: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    purchased_templates: Mapped[list[str]] = mapped_column(ARRAY(String), server_default="{}", nullable=False)
    referral_code: Mapped[str] = mapped_column(String(12), unique=True, index=True, nullable=False, default=_generate_referral_code)
    referred_by: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    sessions = relationship("AuthSession", back_populates="user", cascade="all, delete-orphan")
    onboarding_progress = relationship(
        "OnboardingProgress",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )
    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    saved_resumes = relationship("SavedResume", back_populates="user", cascade="all, delete-orphan")
    cover_letters = relationship("CoverLetter", back_populates="user", cascade="all, delete-orphan")
    referrals_made = relationship("Referral", back_populates="referrer", foreign_keys="[Referral.referrer_id]")
