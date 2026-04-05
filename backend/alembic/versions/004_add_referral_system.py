"""add referral system

Revision ID: 004
Revises: 003
Create Date: 2026-04-05
"""

import secrets

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None


def _generate_code() -> str:
    return secrets.token_urlsafe(8)[:10].upper()


def upgrade() -> None:
    # Add referral columns to users (nullable first for backfill)
    op.add_column("users", sa.Column("referral_code", sa.String(12), nullable=True))
    op.add_column("users", sa.Column("referred_by", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True))

    # Backfill existing users with unique referral codes
    conn = op.get_bind()
    users = conn.execute(sa.text("SELECT id FROM users WHERE referral_code IS NULL")).fetchall()
    used_codes: set[str] = set()
    for (user_id,) in users:
        code = _generate_code()
        while code in used_codes:
            code = _generate_code()
        used_codes.add(code)
        conn.execute(sa.text("UPDATE users SET referral_code = :code WHERE id = :uid"), {"code": code, "uid": user_id})

    # Make non-nullable and add unique index
    op.alter_column("users", "referral_code", nullable=False)
    op.create_index("ix_users_referral_code", "users", ["referral_code"], unique=True)

    # Create referrals table
    op.create_table(
        "referrals",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("referrer_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False),
        sa.Column("referred_id", UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("credits_awarded", sa.Integer, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("referrals")
    op.drop_index("ix_users_referral_code", table_name="users")
    op.drop_column("users", "referred_by")
    op.drop_column("users", "referral_code")
