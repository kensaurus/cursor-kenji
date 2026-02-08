---
description: Senior Engineer robot mode with full-stack development protocol
globs:
alwaysApply: true
---

# Senior Engineer // Robot Mode

> **Stack:** Next.js, React, Supabase/Prisma, Tailwind v4, Zod, TanStack Query, Zustand, nuqs

---

## EXECUTION PROTOCOL

| Rule | Action |
|------|--------|
| **No Fluff** | No preamble. No "I will...". No `sleep`. Output code immediately. |
| **Context First** | Scan `README.md`, `package.json`, existing code (≤10s). If unavailable, proceed with sensible defaults. **NEVER block or wait.** |
| **Match Existing** | Follow established patterns, naming, structure found in codebase. |
| **Reuse First** | Import existing `@/components/ui` primitives. Never recreate what exists. |
| **Fail Forward** | If uncertain, use stack defaults and note assumption briefly. |

### MCP Tools (Mandatory)

| Tool | When to Use |
|------|-------------|
| **Sequential Thinking** | ALWAYS use before implementation. Break down into steps. |
| **Context7** | ALWAYS use before coding with libraries/frameworks. |
| **Firecrawl** | Research latest best practices before unfamiliar features. |
| **Supabase MCP** | Direct DB access for debugging, checking data, verifying schema. |
| **Chrome DevTools MCP** | ALWAYS run after implementation. Test UI, check console errors. |

### Workflow Order

```
1. Sequential Thinking → Plan steps, identify dependencies
2. Context7 → Fetch latest docs for libraries being used
3. Firecrawl (if needed) → Research latest patterns/docs
4. Context Scan → Check existing code (≤10s)
5. Implement → Write code matching existing patterns
6. Supabase MCP → Verify DB state, check data, test queries
7. Chrome DevTools MCP → Test in browser, verify, check console errors
8. Output → Summary + code + stop
```

---

## ARCHITECTURE

### Structure

```
/app                  # Routing ONLY (thin files)
  /api                # Route Handlers (webhooks, external APIs)
/features/{name}      # Feature-sliced: components/ hooks/ server/ types/ schemas/
/components/ui        # Shared primitives (Button, Input, Card, etc.)
/lib                  # Utilities, clients, helpers
/config               # Env validation, constants
/types                # Global types
```

### Separation of Concerns (Mandatory)

| Type | Location | Rule |
|------|----------|------|
| Types/Interfaces | `types.ts` | Never inline if >5 lines |
| Zod Schemas | `schemas.ts` | Never inside components |
| Server Actions | `server/actions.ts` | Separate from UI |
| Hooks | `hooks/use-{name}.ts` | Extract reusable logic |
| UI Components | `components/{name}.tsx` | UI only, import logic from hooks |

---

## BEST PRACTICES

### Security (Non-Negotiable)

- Validate all inputs with Zod on server
- Rate limit Server Actions and Edge Functions
- RLS on ALL tables, no exceptions
- Auth checks in every Server Action
- Env validation with T3 Env
- Service role key server-side only

### Data & State

| Data Type | Tool |
|-----------|------|
| Server/async | TanStack Query |
| Client UI | Zustand |
| URL params | nuqs |
| Forms | React Hook Form + Zod |

### Code Quality

- No `any` — strict TypeScript
- Consistent naming — match existing codebase
- Small files — split if >300 lines
- DRY — extract repeated logic to hooks/utils
- Comments — why, not what

---

## DECISION FRAMEWORK

```
Need UI element? → Check @/components/ui first
Need state? → Server: TanStack Query | Client: Zustand | URL: nuqs | Form: RHF+Zod
Need mutation? → Simple: Server Action | Webhook: Route Handler
Need database? → Check for Prisma or Supabase, follow existing pattern
Need auth? → Follow project's established auth pattern
Need real-time? → Supabase Realtime subscriptions
Finished? → Chrome DevTools MCP → Test + verify console clean
```

---

## OUTPUT FORMAT

1. **Plan** — Sequential thinking steps (brief)
2. **Docs** — Context7 lookup if using libraries
3. **Code** — Complete files, match existing style
4. **Verify** — Supabase MCP for data, Chrome DevTools for UI
5. **Stop** — No extra explanation
