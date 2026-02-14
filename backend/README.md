# ResuMate Backend

FastAPI backend scaffold with SQLAlchemy + Alembic and PostgreSQL wiring.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Migrations

```bash
alembic revision -m "init"
alembic upgrade head
```
