# CLAUDE.md - Project Intelligence

> This file provides context for AI assistants working on this codebase.

## Project Overview

**ResuMates** is an AI-powered resume builder application. This is the **frontend-only** implementation built with Next.js. Backend integration and API connections will be added later.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Bun | 1.x | Package manager & runtime (NOT npm) |
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Lucide React | Latest | Icon library |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── home/                   # Landing page route (/home)
│   │   ├── _components/        # Home-specific components (private)
│   │   │   ├── AuthModal.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── WhyResuMate.tsx
│   │   │   ├── ProductShowcase.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── CTA.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts        # Barrel export
│   │   └── page.tsx            # Landing page
│   ├── dashboard/              # Dashboard route (/dashboard)
│   │   ├── _components/       # Dashboard-specific components
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── dashboard-types.ts   # API types, onboarding types
│   │   │   ├── constants.ts        # Steps, templates, sidebar config
│   │   │   ├── utils.ts            # formatFileSize, resumeThumbnailSrc, etc.
│   │   │   └── index.ts
│   │   └── page.tsx            # Dashboard page (onboarding + workspace)
│   ├── editor/                 # Resume Editor route (/editor)
│   │   ├── _components/        # Editor-specific components
│   │   │   ├── InputGroup.tsx        # Collapsible form section
│   │   │   ├── InputField.tsx        # Form input component
│   │   │   ├── TemplatePreview.tsx   # Mini template previews
│   │   │   └── index.ts
│   │   └── page.tsx            # Full resume editor with live preview
│   ├── globals.css             # Global styles + custom animations
│   ├── layout.tsx              # Root layout (metadata, fonts)
│   └── page.tsx                # Root redirect to /home
│
├── components/                  # Shared/Global components
│   ├── ui/                      # Reusable UI primitives
│   │   ├── AuthModal.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   └── index.ts                 # Master barrel export
│
├── hooks/                       # Custom React hooks
│   ├── useScrollAnimation.ts   # Intersection observer for animations
│   ├── useTheme.ts             # Dark/light mode with localStorage
│   └── index.ts
│
├── lib/                         # Utility functions (future)
│
└── types/                       # TypeScript interfaces
    └── index.ts
```

## Key Conventions

### 1. Folder Organization
- **`_components/`** (with underscore): Private to the route, not exposed as URL paths
- **`components/`**: Shared across multiple routes
- Each folder has an `index.ts` for barrel exports

### 2. Component Patterns
```tsx
// Always use 'use client' for interactive components
'use client';

// Import types from @/types
import type { SomeProps } from '@/types';

// Export named exports (not default)
export const ComponentName = ({ prop }: SomeProps) => {
  // ...
};
```

### 3. Import Aliases
```tsx
// Use @ alias for absolute imports
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui';
import type { Theme } from '@/types';
```

### 4. Styling
- Use Tailwind CSS utility classes
- Dark mode: Use `dark:` variant (e.g., `dark:bg-slate-900`)
- Custom animations defined in `globals.css`
- Available animation classes:
  - `animate-fade-in-up`
  - `animate-bounce-subtle`
  - `animate-pulse-slow`
  - `animate-gradient`
  - `animate-float`
  - `animate-confetti`
  - `animate-shimmer`
  - `animate-scale-in`
  - `animate-bounce-x`
  - `animate-pulse-border`
  - `animate-slide-up-fade`

### 5. Theme System (Tailwind CSS v4)
- **IMPORTANT**: Tailwind v4 requires explicit dark mode configuration
- Dark mode is enabled via `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`
- Theme state managed in `useTheme` hook with proper SSR handling
- Persisted to `localStorage`
- The hook uses `applyTheme()` helper to add/remove `.dark` class on `<html>`
- Pass `theme` and `toggleTheme` props to components that need theme awareness

## Routes

| Path | Purpose |
|------|---------|
| `/` | Redirects to `/home` |
| `/home` | Landing page (marketing, auth) |
| `/dashboard` | User workspace (onboarding + resumes, templates, AI features) |
| `/editor` | Resume editor with live preview |

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Root route - redirects `/` to `/home` |
| `src/app/home/page.tsx` | Landing page - composes Hero, WhyResuMate, etc. |
| `src/app/dashboard/page.tsx` | Dashboard - onboarding flow + workspace |
| `src/app/editor/page.tsx` | Resume editor with live preview |
| `src/app/layout.tsx` | Root layout, metadata, fonts |
| `src/app/globals.css` | Global styles, CSS variables, animations |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/hooks/useTheme.ts` | Dark mode toggle logic |
| `src/app/home/_components/AuthModal.tsx` | Sign in/Sign up modal (home route) |

## Development Commands

**IMPORTANT: This project uses Bun, NOT npm. Always use `bun` commands.**

```bash
bun install          # Install dependencies
bun run dev          # Start development server (port 3000)
bun run build        # Production build
bun run start        # Start production server
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
bun run type-check   # TypeScript type checking
```

## When Adding New Features

### Adding a New Route
1. Create folder in `src/app/` (e.g., `src/app/dashboard/`)
2. Add `page.tsx` for the route entry
3. Add `_components/` folder for route-specific components
4. Add `_hooks/` or `_utils/` if needed for that route

### Adding a Shared Component
1. Create in `src/components/ui/` or appropriate subfolder
2. Export from the folder's `index.ts`
3. Add TypeScript interface in `src/types/index.ts`

### Adding a New Hook
1. Create in `src/hooks/`
2. Export from `src/hooks/index.ts`
3. Add `'use client'` directive at top

## State Management

Currently using React's built-in state (`useState`, `useEffect`). For future:
- Consider Zustand for global state if needed
- React Query/TanStack Query for server state when APIs are added

## Styling Guidelines

1. **Colors**: Use Tailwind's `slate` palette for neutrals, `blue`/`indigo` for primary
2. **Spacing**: Follow Tailwind's spacing scale
3. **Responsive**: Mobile-first (`sm:`, `md:`, `lg:` breakpoints)
4. **Transitions**: Use `transition-all` or specific `transition-colors`

## Notes for AI Assistants

1. **Use Bun, NOT npm** - This project uses Bun as package manager. Never use `npm` commands.
2. **Always check existing patterns** before adding new code
3. **Use barrel exports** - don't import from deep paths
4. **Mark client components** with `'use client'`
5. **Keep components focused** - split large components
6. **Type everything** - no `any` types unless absolutely necessary
7. **Follow existing naming** - PascalCase for components, camelCase for hooks/utils
8. **NEVER run `bun run dev`** - Do not start the dev server unless explicitly requested by the user
