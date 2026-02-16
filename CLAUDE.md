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
- Pages use **inline styles** for brand colors (hex values) to ensure consistency
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

### 5. Style Theme (Home, Dashboard, Editor)

All three routes share **Fraunces** (serif) and **DM Sans** (sans) fonts. Apply via:
```tsx
const fraunces = Fraunces({ subsets: ['latin'], weight: ['700','800','900'], variable: '--font-fraunces', display: 'swap' });
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-dm-sans', display: 'swap' });
// Page: className={`${fraunces.variable} ${dmSans.variable} ...`}
// Headings: style={{ fontFamily: 'var(--font-fraunces), serif' }}
// Body: style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}
```

**Warm palette** (Home, Editor, Dashboard onboarding):
| Token | Hex | Usage |
|-------|-----|-------|
| Primary accent | `#c96442` | CTAs, buttons, highlights, underlines |
| Primary green | `#2d5a3d` | Secondary accent, success, badges, icons |
| Muted tan | `#8b7355` | Secondary text, labels, placeholders |
| Dark text | `#2c1810` | Headings, body text |
| Background | `#faf7f2` | Page background (cream) |
| Card/panel | `#fffaf4`, `#fff8f1` | Cards, modals, sidebars |
| Borders | `#eadfce`, `#e8e0d4`, `#e4d3be` | Borders, dividers |
| Blur accents | `#f0e6d8`, `#e6efe7` | Decorative blobs |

**Dashboard workspace** (cooler, app-like):
| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#f3f4f6` | Page background |
| Main content | `#fafafa` | Content area |
| Sidebar | `#f7f7f8` | Sidebar background |
| Borders | `#e3e5e8`, `#dce0e5` | Borders |
| Text | `#1b1d21`, `#2a2f3a` | Primary text |
| Muted text | `#7a818d`, `#8a909b` | Secondary text |
| Accent | `#ff8b2f`, `#ff9a38` | Buttons, highlights |

**Rounded corners**: `rounded-2xl`, `rounded-3xl`, `rounded-full` for buttons and cards.

### 6. Theme System (Tailwind CSS v4)
- Dark mode is configured via `@custom-variant dark (&:where(.dark, .dark *));` in `globals.css`
- Home, Dashboard, and Editor currently use **light-only** custom palettes (no dark mode)
- For shared components needing theme: use `useTheme` hook, pass `theme` and `toggleTheme` props

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

1. **Colors**: Use the brand palette above. Warm pages (Home, Editor, onboarding) use `#c96442`, `#2d5a3d`, `#8b7355`, `#2c1810`. Dashboard workspace uses cooler grays and `#ff8b2f` accent.
2. **Fonts**: Fraunces for headings, DM Sans for body. Apply via CSS variables.
3. **Spacing**: Follow Tailwind's spacing scale (`p-4`, `gap-4`, `mt-6`, etc.)
4. **Responsive**: Mobile-first (`sm:`, `md:`, `lg:`, `xl:` breakpoints)
5. **Transitions**: Use `transition-all` or `transition-colors` for hover states

## Notes for AI Assistants

1. **Use Bun, NOT npm** - This project uses Bun as package manager. Never use `npm` commands.
2. **Always check existing patterns** before adding new code
3. **Use barrel exports** - don't import from deep paths
4. **Mark client components** with `'use client'`
5. **Keep components focused** - split large components
6. **Type everything** - no `any` types unless absolutely necessary
7. **Follow existing naming** - PascalCase for components, camelCase for hooks/utils
8. **NEVER run `bun run dev`** - Do not start the dev server unless explicitly requested by the user
