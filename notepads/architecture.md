# Architecture Notepad

Reference this with `@architecture` in any Cursor conversation to give the AI full context on your system.

## Instructions

Copy this file to your project and fill in the details. Then reference it in conversations:
- "Using @architecture as context, implement the new feature..."
- "@architecture — where should this new endpoint go?"

## Template

```markdown
# Project Architecture

## Stack
- **Frontend:** React 19 + Next.js 15 (App Router)
- **Styling:** Tailwind v4 + shadcn/ui
- **State:** TanStack Query (server), Zustand (client), nuqs (URL)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Vercel

## Directory Structure
/app                  — Routing (thin layout/page files)
/features/{name}/     — Feature modules (components, hooks, server, types)
/components/ui/       — Shared UI primitives
/lib/                 — Utilities, clients, helpers
/hooks/               — Shared hooks
/types/               — Global type definitions
/supabase/migrations/ — Database migrations

## Key Files
- `lib/supabase.ts` — Supabase client (server + browser)
- `lib/utils.ts` — cn() helper, shared utilities
- `app/layout.tsx` — Root layout with providers
- `middleware.ts` — Auth session refresh

## Database Tables
[List your tables and their relationships here]

## API Patterns
- Internal mutations → Server Actions
- External webhooks → Route Handlers (/app/api/)
- Real-time → Supabase Realtime subscriptions
- Background tasks → Edge Functions

## Auth Flow
- Supabase Auth with session cookies
- Middleware refreshes session on every request
- Protected routes check auth in layout/page
- RLS policies enforce data access at DB level

## Deployment
- Push to main → Vercel auto-deploys
- Preview deployments on PRs
- Supabase migrations applied via CI
```
