---
description: 
alwaysApply: false
---

## Cursor Cloud specific instructions

### Services overview

| Service | Port | How to start |
|---------|------|-------------|
| Frontend (Next.js) | 3000 | `bun run dev` from repo root |
| Backend (FastAPI) | 8000 | `cd backend && source .venv/bin/activate && DATABASE_URL="postgresql+psycopg://resumate:resumate@localhost:5432/resumate" uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` |
| PostgreSQL | 5432 | `sudo dockerd &>/tmp/dockerd.log &` then `sudo docker run -d --name resumate-db -e POSTGRES_USER=resumate -e POSTGRES_PASSWORD=resumate -e POSTGRES_DB=resumate -p 5432:5432 postgres:16-alpine` |

### Gotchas

- **DATABASE_URL env var override**: The VM may have a `DATABASE_URL` environment variable pre-set that points to the Docker Compose internal hostname (`db`). When running the backend outside Docker, you **must** explicitly set `DATABASE_URL="postgresql+psycopg://resumate:resumate@localhost:5432/resumate"` or it will fail to connect.
- **Docker daemon**: Docker must be started manually with `sudo dockerd` before running `docker compose` commands. The VM uses `fuse-overlayfs` storage driver and `iptables-legacy`.
- **PostgreSQL port exposure**: The `docker-compose.yml` has port 5432 commented out for the `db` service. When running the backend outside Docker, use `docker run` directly with `-p 5432:5432` instead of `docker compose up -d db`.
- **Backend venv**: The Python virtual environment lives at `backend/.venv`. Always activate it before running backend commands.
- **Backend auto-migrates on startup**: `Base.metadata.create_all()` runs in the FastAPI lifespan; no manual Alembic migration is needed for initial table creation.
- **Frontend env**: Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` when running the frontend to connect to the local backend.

- **Pre-existing lint error**: `bun run lint` reports 1 error in `src/app/pricing/_components/RazorpayCheckout.tsx` (line 42, `Date.now()` called during render). This is a known pre-existing issue.
- **Deployed site**: The production deployment is at `https://resumate.paperknife.app` with backend API at the configured `NEXT_PUBLIC_API_BASE_URL`.

### Commands reference

See `CLAUDE.md` for full development commands. Key ones:
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Type-check**: `bun run type-check`
- **Build**: `bun run build`
- **Backend deps**: `cd backend && source .venv/bin/activate && pip install -r requirements.txt`
