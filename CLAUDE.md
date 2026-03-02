# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ResuMate** is an AI-powered resume builder with a Next.js frontend and FastAPI backend. Users sign up, optionally go through an onboarding flow (upload + AI analysis of existing resume), then use a live editor to build resumes.

## Development Commands

**Frontend (Bun — NOT npm):**
```bash
bun install          # Install dependencies
bun run dev          # Dev server on :3000
bun run build        # Production build
bun run lint         # ESLint (flat config, ESLint 9)
bun run lint:fix     # Auto-fix lint issues
bun run type-check   # TypeScript type checking (tsc --noEmit)
```

**Backend (Python venv):**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # Then fill in API keys
uvicorn app.main:app --reload   # Dev server on :8000
alembic upgrade head            # Run DB migrations
```

**Docker (full stack):**
```bash
docker compose up --build   # Postgres :5432 + Backend :8000 + Frontend :3000
```

**NEVER run `bun run dev` unless explicitly requested by the user.**

## Architecture

### Frontend (`src/`)

Next.js 16 with App Router, React 19, TypeScript 5, Tailwind CSS 4.

```
src/
├── app/
│   ├── page.tsx              # Redirects / → /home
│   ├── layout.tsx            # Root layout (Geist fonts, metadata)
│   ├── globals.css           # Global styles, custom animations, dark mode variant
│   ├── home/
│   │   ├── page.tsx          # Landing page
│   │   └── _components/      # Navbar, Hero, AuthModal, CTA, Footer, etc.
│   ├── dashboard/
│   │   ├── page.tsx          # Onboarding wizard + workspace
│   │   └── _components/      # OnboardingWizard, DashboardSidebar, constants, utils, types
│   └── editor/
│       ├── page.tsx          # Resume editor with live preview
│       └── _components/      # InputGroup, InputField, TemplatePreview, 4 preview templates
├── lib/
│   └── api.ts                # API client (apiRequest, token management, ApiError)
└── types/
    └── index.ts              # Shared TypeScript interfaces
```

**Note:** `src/hooks/` and `src/components/` directories do **not** exist. All components are route-scoped under `_components/`. All types/utilities are either in `src/types/`, `src/lib/`, or co-located in route `_components/` folders.

### Backend (`backend/app/`)

FastAPI with SQLAlchemy 2.0 ORM, PostgreSQL, Alembic migrations.

```
backend/app/
├── main.py                # App entry, CORS, lifespan
├── core/config.py         # Pydantic settings (env-driven)
├── api/
│   ├── router.py          # Aggregates v1 routers
│   ├── deps.py            # get_db, get_current_user dependencies
│   └── v1/                # auth, onboarding, dashboard, resumes endpoints
├── models/                # SQLAlchemy models (users, auth_sessions, onboarding_progress, resumes)
├── schemas/               # Pydantic request/response schemas
├── services/              # Business logic (resume analysis, data extraction, template fill via VLM providers)
└── utils/security.py      # Password hashing (PBKDF2-SHA256), token utilities
```

### API Routes (prefix: `/api/v1`)

- **Auth:** `POST /auth/signup`, `POST /auth/signin`, `GET /auth/me`, `POST /auth/signout`
- **Onboarding:** `GET|POST /onboarding/*` (choose path, upload resume, analyze, step actions, skip)
- **Dashboard:** `GET /dashboard`
- **Resumes:** `POST /resumes/upload`, `GET /resumes/{id}/thumbnail`, `POST /resumes/{id}/analyze`, `GET /resumes/{id}/extracted-data`, `POST /resumes/{id}/fill-template`

### Auth Flow

Custom session tokens (not JWT). Raw token (`secrets.token_urlsafe(48)`) returned to client, SHA-256 hash stored in DB. Frontend stores token in localStorage (`resumate_access_token`) and sends as `Authorization: Bearer <token>`.

### AI Resume Analysis

Two VLM providers (configured via `RESUME_IMAGE_PROCESSING_PROVIDER` env):
- **Nebius** (default): `google/gemma-3-27b-it-fast`
- **Chutes**: `Qwen/Qwen3-VL-235B-A22B-Instruct`

Both use the OpenAI-compatible SDK. PDFs → images (pypdfium2) → VLM analysis.

### Resume Data Extraction & Template Fill

When a resume is analyzed (onboarding or library), two VLM calls run **in parallel** via `ThreadPoolExecutor`:
1. **ATS Analysis** — scores, strengths, gaps, improved bullets (stored in `analysis_payload`)
2. **Data Extraction** — structured content: personal info, all experiences with bullet descriptions, education, skills by category, certifications, projects, etc. (stored in `extracted_data` JSON column)

Extraction failure is non-fatal — analysis still succeeds. The `extracted_data` column on the `resumes` table stores the raw extracted JSON.

**Template Fill** (`POST /resumes/{id}/fill-template`): A text-only LLM call maps `extracted_data` → the frontend `ResumeData` schema (personal, experience[], education[], skills[]). This enables auto-populating the editor.

### Editor Auto-Fill

The editor (`/editor?resume_id=<id>`) reads `resume_id` from query params. On mount, it calls `POST /api/v1/resumes/{id}/fill-template` to fetch structured data and populate the form. Falls back to an empty template on error or when no `resume_id` is provided.

All 4 templates (Modern, Classic, Creative, Minimal) render complete data: full summary, ALL experience entries with descriptions, ALL education, ALL skills.

## Frontend API Client

`src/lib/api.ts` provides `apiRequest<T>(path, options)` — a typed fetch wrapper that:
- Prepends `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)
- Handles JSON and FormData bodies
- Attaches Bearer token from options
- Throws `ApiError` with status and detail on non-OK responses

Token helpers: `getStoredAccessToken()`, `setStoredAccessToken(token)`, `clearStoredAccessToken()`

## Key Conventions

### Code Organization
- **`_components/`** (underscore prefix): Route-private, not exposed as URL paths
- Each `_components/` folder has an `index.ts` barrel export — import from the barrel, not deep paths
- Route-specific types/constants/utils live alongside components in `_components/`
- Shared types go in `src/types/index.ts`

### Component Patterns
- `'use client'` directive on all interactive components
- Named exports only (no default exports)
- TypeScript interfaces for all props (no `any`)
- PascalCase for components, camelCase for hooks/utils

### Import Aliases
```tsx
import { apiRequest } from '@/lib/api';
import type { SomeType } from '@/types';
import { OnboardingWizard } from './_components';  // Route-local
```

## Styling

### Fonts
- **Root layout:** Geist Sans + Geist Mono (CSS variables)
- **Page-level:** Fraunces (serif, headings) + DM Sans (sans, body) — loaded per-page via `next/font`

### Color Palettes
Brand colors are applied via **inline styles** (not Tailwind theme tokens).

**Warm palette** (Home, Editor, onboarding): cream `#faf7f2` background, terracotta `#c96442` accent, forest green `#2d5a3d`, tan `#8b7355` muted text, dark `#2c1810` text.

**Dashboard workspace** (cooler): gray `#f3f4f6` background, orange `#ff8b2f` accent, dark `#1b1d21` text, muted `#7a818d` secondary.

### Custom Animations (defined in `globals.css`)
`animate-fade-in-up`, `animate-fade-in`, `animate-bounce-subtle`, `animate-pulse-slow`, `animate-gradient`, `animate-float`, `animate-confetti`, `animate-shimmer`, `animate-scale-in`, `animate-bounce-x`, `animate-pulse-border`, `animate-slide-up-fade`

Also: `.perspective-1000` utility, `prefers-reduced-motion` support.

### Dark Mode
Configured via `@custom-variant dark` in `globals.css` but all routes currently use **light-only** custom palettes.

## Git & Branching

- **Default remote branch:** `optimization` (not `main`)
- PRs should typically target `optimization`
- Local branches: `main`, `optimization`, `sso-optimized-ui`

## Environment Variables

**Frontend:** `NEXT_PUBLIC_API_BASE_URL` (defaults to `http://localhost:8000`)

**Backend:** See `backend/.env.example` — requires at minimum `DATABASE_URL` and one VLM API key (`NEBIUS_API_KEY` or `CHUTES_API_TOKEN`).

## No Tests

No test framework is configured. No test files exist.
