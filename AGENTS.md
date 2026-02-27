## Cursor Cloud specific instructions

### Services overview

| Service | Port | How to start |
|---------|------|-------------|
| Frontend (Next.js) | 3000 | `bun run dev` from repo root |
| Backend (FastAPI) | 8000 | `cd backend && source .venv/bin/activate && DATABASE_URL="postgresql+psycopg://resumate:resumate@localhost:5432/resumate" uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` |
| PostgreSQL | 5432 | `sudo dockerd &>/tmp/dockerd.log &` then `sudo docker compose up -d db` from repo root |

### Gotchas

- **DATABASE_URL env var override**: The VM may have a `DATABASE_URL` environment variable pre-set that points to the Docker Compose internal hostname (`db`). When running the backend outside Docker, you **must** explicitly set `DATABASE_URL="postgresql+psycopg://resumate:resumate@localhost:5432/resumate"` or it will fail to connect.
- **Docker daemon**: Docker must be started manually with `sudo dockerd` before running `docker compose` commands. The VM uses `fuse-overlayfs` storage driver and `iptables-legacy`.
- **Backend venv**: The Python virtual environment lives at `backend/.venv`. Always activate it before running backend commands.
- **Backend auto-migrates on startup**: `Base.metadata.create_all()` runs in the FastAPI lifespan; no manual Alembic migration is needed for initial table creation.
- **Frontend env**: Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` when running the frontend to connect to the local backend.

### Commands reference

See `CLAUDE.md` for full development commands. Key ones:
- **Lint**: `bun run lint` / `bun run lint:fix`
- **Type-check**: `bun run type-check`
- **Build**: `bun run build`
- **Backend deps**: `cd backend && source .venv/bin/activate && pip install -r requirements.txt`
