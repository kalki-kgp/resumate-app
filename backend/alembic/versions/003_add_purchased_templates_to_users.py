"""add purchased_templates to users

Revision ID: 003
Revises: 002
Create Date: 2026-04-02
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ARRAY

revision = "003"
down_revision = "002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("purchased_templates", ARRAY(sa.String()), server_default="{}", nullable=False))


def downgrade() -> None:
    op.drop_column("users", "purchased_templates")
