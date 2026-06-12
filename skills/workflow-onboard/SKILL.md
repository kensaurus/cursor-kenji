---
name: workflow-onboard
description: >-
  First-contact orientation for an unfamiliar codebase. Reads package manifests,
  entry points, routing, data layer, auth, environment variables, and recent git
  history. Produces a concise briefing: what the app does, how it's structured,
  how to run it locally, and the top areas to understand first. Generic across
  web, mobile, and full-stack repos. Use when "I'm new to this repo", "orient
  me", "explain this codebase", "what does this do?", "onboard me", "first day
  on this project", or "catch me up on the codebase".
license: MIT
---

# workflow-onboard — Codebase Orientation

Orient to any repo in under 5 minutes. Read first, explain second.

---

## Step 1: Stack & entry points

Read (do not shell-grep unless necessary):

| File | What to extract |
|------|-----------------|
| `package.json` / `pyproject.toml` / `Cargo.toml` | Runtime, framework, key deps, scripts |
| `README.md` | Stated purpose, setup steps, architecture notes |
| `src/app/layout.tsx` / `pages/_app.tsx` / `App.tsx` | Root component, providers, global context |
| `src/app/**/page.tsx` / `src/routes/**` / `app/routes/**` | Route tree → feature map |
| `capacitor.config.*` / `app.json` / `app.config.*` | Mobile targets (Expo/RN/Capacitor) |
| `android/` / `ios/` presence | Native targets |

---

## Step 2: Data & auth layer

| File | What to extract |
|------|-----------------|
| `supabase/migrations/*.sql` (latest 3) | Schema, tables, relationships |
| `prisma/schema.prisma` / `drizzle/*.ts` | ORM model |
| `src/lib/supabase.*` / `src/lib/db.*` | Client init, auth helper |
| `.env.example` / `.env.local` (names only, never values) | Required env vars |
| `middleware.ts` / `auth.ts` / `src/lib/auth.*` | Auth guard pattern |

---

## Step 3: Recent context

```bash
git log --oneline -15          # recent work direction
git diff HEAD~5 --stat         # files changed recently
```

---

## Step 4: Orientation briefing

Produce a structured briefing covering:

1. **What it is** — one sentence on the product's purpose
2. **Tech stack** — framework + DB + auth + mobile targets
3. **Feature map** — top-level routes grouped by capability
4. **Data model** — key entities and relationships (3-5 tables max)
5. **Auth pattern** — how sessions work and who the roles are
6. **How to run** — exact commands from `package.json` scripts
7. **Environment** — required env vars (names only) and where to find values
8. **Top 3 to understand first** — the areas with the most business logic or complexity

Format as a scannable briefing, not a wall of text. Use short tables where helpful.

---

## Guardrails

- Never print `.env` values — names only
- If the codebase is a monorepo, scope the briefing to the specific app/package the user is working in (ask if unclear)
- If critical files are missing (no README, no schema), say so explicitly rather than guessing
