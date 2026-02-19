"""add extracted_data to resumes

Revision ID: 001
Revises:
Create Date: 2026-02-20
"""

from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("resumes", sa.Column("extracted_data", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("resumes", "extracted_data")
