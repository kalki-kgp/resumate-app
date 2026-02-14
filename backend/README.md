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
- `POST /api/v1/onboarding/upload-resume`
- `POST /api/v1/onboarding/analyze-resume`
- `POST /api/v1/onboarding/step-action`
- `POST /api/v1/onboarding/back-to-options`
- `POST /api/v1/onboarding/skip`

## Dashboard APIs

- `GET /api/v1/dashboard`

## Resume APIs

- `GET /api/v1/resumes/{resume_id}/thumbnail`

Uploaded resumes are persisted in PostgreSQL (`resumes` table) and stored on disk under `uploads/resumes/<user_id>/`.

## AI Analysis Setup

Set `NEBIUS_API_KEY` in `backend/.env` (or docker environment) to enable `/api/v1/onboarding/analyze-resume`.
