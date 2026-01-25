# CLAUDE.md - Project Intelligence

> This file provides context for AI assistants working on this codebase.

## Project Overview

**ResuMates** is an AI-powered resume builder application. This is the **frontend-only** implementation built with Next.js. Backend integration and API connections will be added later.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | React framework with App Router |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Lucide React | Latest | Icon library |
| Three.js | Latest | 3D background animations |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── _components/            # Homepage-specific components (private)
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Templates.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CTA.tsx
│   │   ├── ThreeBackground.tsx
│   │   └── index.ts            # Barrel export
│   ├── dashboard/              # Dashboard route
│   │   ├── _components/        # Dashboard-specific components
│   │   │   ├── views/          # Dashboard view components
│   │   │   │   ├── OverviewView.tsx
│   │   │   │   ├── ResumesView.tsx
│   │   │   │   ├── JobsView.tsx
│   │   │   │   ├── TemplatesView.tsx
│   │   │   │   └── index.ts
│   │   │   ├── DashboardBackground.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardTopbar.tsx
│   │   │   ├── UserProfileDropdown.tsx
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── DevToggle.tsx
│   │   │   ├── ResumeCard.tsx
│   │   │   ├── JobCard.tsx
│   │   │   ├── ATSScore.tsx
│   │   │   ├── ExtractContentModal.tsx
│   │   │   └── index.ts
│   │   └── page.tsx            # Dashboard page (with onboarding flow)
│   ├── editor/                 # Resume Editor route
│   │   ├── _components/        # Editor-specific components (TODO)
│   │   └── page.tsx            # Editor page (placeholder)
│   ├── globals.css             # Global styles + custom animations
│   ├── layout.tsx              # Root layout (metadata, fonts)
│   └── page.tsx                # Homepage
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

### 5. Theme System (Tailwind CSS v4)
- **IMPORTANT**: Tailwind v4 requires explicit dark mode configuration
- Dark mode is enabled via `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`
- Theme state managed in `useTheme` hook with proper SSR handling
- Persisted to `localStorage`
- The hook uses `applyTheme()` helper to add/remove `.dark` class on `<html>`
- Pass `theme` and `toggleTheme` props to components that need theme awareness

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage - composes all sections |
| `src/app/dashboard/page.tsx` | Dashboard - user's main workspace |
| `src/app/layout.tsx` | Root layout, metadata, fonts |
| `src/app/globals.css` | Global styles, CSS variables, animations |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/hooks/useTheme.ts` | Dark mode toggle logic |
| `src/components/ui/AuthModal.tsx` | Sign in/Sign up modal |

## Development Commands

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking
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

1. **Always check existing patterns** before adding new code
2. **Use barrel exports** - don't import from deep paths
3. **Mark client components** with `'use client'`
4. **Keep components focused** - split large components
5. **Type everything** - no `any` types unless absolutely necessary
6. **Follow existing naming** - PascalCase for components, camelCase for hooks/utils
7. **NEVER run `npm run dev`** - Do not start the dev server unless explicitly requested by the user

