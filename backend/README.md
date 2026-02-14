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

## Auth APIs

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/signin`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/signout`

## Onboarding APIs

- `GET /api/v1/onboarding`
- `POST /api/v1/onboarding/choose`
- `POST /api/v1/onboarding/step-action`
- `POST /api/v1/onboarding/back-to-options`
- `POST /api/v1/onboarding/skip`
