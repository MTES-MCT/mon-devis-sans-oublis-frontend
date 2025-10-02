# AGENTS.md

This file provides guidance to coding assistant when working with code in this repository.

## Project Overview

"Mon Devis Sans Oublis" is a French government platform (beta.gouv.fr) for analyzing renovation quote compliance. It accelerates energy renovation by simplifying grant application processing.

**Stack:** Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4 + DSFR (French government design system)

**Backend:** Ruby on Rails API with PostgreSQL (separate repository)

**Package Manager:** pnpm (version 10.13.1) - use pnpm for all operations

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server (http://localhost:3000)
pnpm build                  # Production build
pnpm start                  # Start production server

# Code Quality
pnpm validate               # Run typecheck + lint + tests
pnpm ci                     # Full CI check (install + validate)
pnpm typecheck              # TypeScript type checking
pnpm lint                   # ESLint check
pnpm format                 # Format code with Prettier

# Testing
pnpm test                   # Run all tests
pnpm test:watch             # Watch mode
pnpm test:coverage          # With coverage report
pnpm test -- file.test.ts   # Run single test file

# Cache/Troubleshooting
pnpm clean                  # Remove .next cache and restart dev
pnpm fresh                  # Full reset (cache + node_modules)
```

## Architecture

### Directory Structure

```
src/
├── actions/           # Next.js Server Actions (API layer)
│   ├── quoteCheck.actions.ts      # Single quote operations
│   ├── quoteCase.actions.ts       # Multi-quote case operations
│   ├── feedback.actions.ts        # User feedback
│   └── stats.actions.ts           # Statistics
├── app/               # Next.js App Router pages
│   ├── [profile]/     # Dynamic profile routes (particulier/rge)
│   └── api/           # API routes (health checks)
├── components/        # Reusable React components
├── page-sections/     # Page-specific sections
├── lib/
│   ├── server/        # Server-only code (apiClient)
│   ├── client/        # Client-only code (apiWrapper)
│   ├── config/        # Environment config with Zod validation
│   └── utils/         # Shared utilities
├── types/             # TypeScript type definitions
├── utils/
│   └── mocks/         # Mock data system
└── wording/           # UI text and translations
```

### Server Actions Pattern

The app uses Next.js Server Actions (not API routes) for all backend communication:

- **Server Actions** (in `src/actions/`) handle API calls server-side with authentication
- Use `"use server"` directive at top of action files
- Actions call `apiClient` (src/lib/server/apiClient.ts) which adds auth headers
- Never call backend API directly from client components

Example pattern:
```typescript
// src/actions/example.actions.ts
"use server";
export async function getData(id: string) {
  return await apiClient.get(`/api/v1/resource/${id}`);
}

// In component
import { getData } from "@/actions/example.actions";
const data = await getData(id);
```

### Environment Configuration

Environment variables are centrally managed and validated with Zod in `src/lib/config/env.config.ts`:

**Three categories:**
1. **Server-only** (NEXT_PRIVATE_*): Auth tokens, sensitive data
2. **Client-only** (NEXT_PUBLIC_*): Matomo, Sentry, Crisp configs
3. **Shared** (NEXT_PUBLIC_*): API URL, APP_ENV (used server + client)

**Access pattern:**
```typescript
import { getServerEnv, getClientEnv, getSharedEnv } from "@/lib/config/env.config";

const { NEXT_PRIVATE_API_AUTH_TOKEN } = getServerEnv(); // Server only
const { NEXT_PUBLIC_API_URL } = getSharedEnv(); // Both
```

**Important:** Never leave empty env vars (`VARIABLE=`). Comment out or delete if unused.

**Environment types:**
- `local` / `docker`: Development (NODE_ENV=development)
- `staging`: Staging on Scalingo (NODE_ENV=production, NEXT_PUBLIC_APP_ENV=staging)
- `production`: Production on Scalingo (NODE_ENV=production, NEXT_PUBLIC_APP_ENV=production)

The `NEXT_PUBLIC_APP_ENV` distinction exists because Scalingo forces `NODE_ENV=production` everywhere.

### Mock System

Comprehensive mock system allows development without backend and demo URLs in production:

**Test URLs that auto-enable mocks:**
- `/result/test-devis-valide` - Valid quote
- `/result/test-devis-invalide` - Quote with errors
- `/dossier/test-dossier-valide` - Valid renovation case
- `/dossier/test-dossier-invalide` - Invalid case

**Configuration:**
```bash
NEXT_PUBLIC_ENABLE_MOCKS=true  # Enable all mocks in dev
NEXT_PUBLIC_MOCK_DELAY=300     # Simulate API delay
```

**In production:** Only test IDs (test-*) trigger mocks; real IDs use actual API.

**Mock structure:** `src/utils/mocks/` contains mock data organized by feature (quoteCheck, quoteCase, gestes)

## Key Patterns

### Path Aliases
Use `@/` for all imports: `import { Component } from "@/components/Component"`

### Type Safety
- Strict TypeScript enabled
- Zod validation for API responses and env vars
- 80% coverage threshold (jest.config.ts)

### Routing
- App Router with dynamic `[profile]` segment (particulier/rge)
- Middleware (src/middleware.ts) redirects old `/devis/` and `/dossier/` URLs to `/particulier/devis/` and `/particulier/dossier/`
- Server components by default, client components use `"use client"`

### Monitoring
- **Sentry:** Error tracking (configured in sentry.*.config.ts)
- **Matomo:** Privacy-friendly analytics
- **Crisp:** Customer support chat
- Custom logger in src/lib/logger.ts with Sentry integration

### Testing
- Jest + React Testing Library
- Files: `*.test.tsx` or `*.spec.tsx`
- Focus on behavioral tests, not implementation details
- Target: 80%+ coverage

## Important Notes

- **Never commit secrets** - check .env.local is in .gitignore
- **Server Actions body limit:** 50MB (configured in next.config.ts for PDF uploads)
- **Node version:** 22.x required (specified in package.json engines)
- **DSFR integration:** French government design system (@gouvfr/dsfr) - follow existing patterns in components/
- When adding new env vars, update `src/lib/config/env.config.ts` schemas AND `.env.example`
- All API calls must go through Server Actions, not direct fetch from client

## Troubleshooting

**Strange behavior / env vars disappearing:**
```bash
pnpm clean  # or pnpm fresh for full reset
```

**Type errors:**
```bash
pnpm typecheck
```

**Lint errors:**
```bash
pnpm lint
pnpm format
```
