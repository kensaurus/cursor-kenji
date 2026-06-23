# AGENTS.md — Project Constitution & Agentic-Engineering Discipline

> Copy to your **project repo root** as `AGENTS.md`. Cursor, Claude Code, Codex, and
> Antigravity read it; Cursor also uses `.cursor/rules/`. Fill the `<PLACEHOLDERS>`.
>
> This is the *constitution*: the always-on contract between you and any coding agent.
> The `plan-*` skills produce burndowns; this file governs how every change happens.
>
> Keep it short. A bloated constitution is cognitive debt. Cut rules that aren't earning
> their place.

---

## 1. Mission (the *why*)

- **What this is:** `<ONE SENTENCE — core function.>`
- **Who uses it:** `<PRIMARY USER + main task.>`
- **Non-negotiables:** `<e.g. user data never leaves region X, must work offline,
  solo-founder maintainable.>`

## 2. Tech stack (the *what*)

- **Frontend:** `<Next.js / React / Tailwind / Capacitor …>`
- **Backend:** `<Supabase / Postgres / Edge Functions …>`
- **Payments:** `<Stripe …>`  **Errors:** `<Sentry …>`  **LLM obs:** `<Langfuse …>`
- **Deploy:** `<Vercel / AWS …>`  **Mobile:** `<Capacitor iOS + Android …>`
- **AI dev tools:** Cursor + Claude Code. Plan with a strong reasoning model; execute
  approved plans with disciplined execution rules.

## 3. Roadmap (the *when*) — keep current

- **Now:** `<current phase / feature.>`
- **Next:** `<…>`
- **Later:** `<…>`

> **Drift rule:** when code changes, update this section and the relevant spec in the
> *same* change. Stale roadmap = cognitive debt. Re-run `plan-docs-sync` if it slips.

---

## 4. Mode discipline — vibe vs spec

Two modes. Know which you're in; switch as stakes rise.

- **Vibe mode** — exploration, spikes, throwaway prototypes, one-off scripts. Fast,
  freeform, accept-and-iterate. Fine when a wrong answer is cheap.
- **Spec mode** — anything touching **auth, money, user data, migrations, or code
  someone will maintain.** Spec first, then build. Non-negotiable for §1 non-negotiables.

**Convergent pattern:** vibe-code a spike → distill what worked into a spec →
spec-drive the production version. Don't ship a spike. Don't over-spec a Tetris.

**Transition signal (vibe → spec):** the agent *fixes one thing and breaks something it
didn't see* — stop vibing and write the spec. That's context drift; it compounds.

---

## 5. The build loop (every non-trivial change)

1. **Spec in.** Goal, constraints, acceptance criteria, **files in scope.** Keep the
   *initial* spec ~30–80 words; add detail in follow-ups, not upfront.
2. **Plan.** List files and changes *before* editing. For §1 non-negotiables, run the
   relevant `plan-*` skill first; get an approved burndown.
3. **Execute one slice.** One reviewable, independently testable unit — not the whole
   feature in one shot.
4. **Review the diff.** Always. Most AI code is not functionally correct out of the box.
5. **Verify.** Tests/acceptance criteria pass; behavior matches spec.
6. **Ship.** Conventional commit → PR. Update spec/roadmap in the same change.

**Iterate, don't regenerate.** Tell the agent what to fix; don't start over.

---

## 6. Context discipline (drift & cognitive debt)

- **Fresh context per phase.** New session/context for each plan phase; load what the
  current phase needs, drop the rest. Long threads summarize and lose fidelity.
- **Cognitive debt is real debt.** Stale `AGENTS.md`, unreviewed diffs, prompts that
  paper over architecture problems, dead context — pay it down like tech debt.
- **Prefer libraries over rebuilds.** Agents re-implement what libraries already do.
  Use vetted libraries — but **verify they exist first** (§7). Less code wins.
- **Use live docs.** Pull current docs (e.g. Context7) for specific library versions;
  agents skip this unless told.

---

## 7. Hard guardrails (always on)

Maps to `plan-*` skills for audit; execution rules for implementation.

| Rule | Skill |
|------|-------|
| Never embed/commit secrets; rotate if ever committed | `plan-secrets-audit` |
| Never install unverified packages (slopsquatting) | `plan-dependency-provenance` |
| RLS on every table; no client `service_role` | `plan-rls-audit` |
| Validate trust boundaries; verify webhook signatures | `plan-input-validation` |
| No autonomous prod destructive ops; backups off blast radius | `plan-data-integrity` |
| No swallowed errors; no PII in Sentry | `plan-error-handling` |
| LLM features: per-user quota, `max_tokens`, daily kill switch | `plan-llm-cost-guardrails` |
| Capacitor: Keychain/Keystore tokens; PKCE + App Links; no dev config in prod | `plan-capacitor-hardening` |
| Store submit: privacy manifest, Data Safety match | `plan-mobile-readiness` |

---

## 8. Definition of done

Done when: diff reviewed, acceptance criteria pass, no §7 regression, observability
shows the new path, spec/roadmap reflect reality. **"The agent stopped editing" is not done.**

---

## 9. Coding conventions (project-specific)

- `<TypeScript strict; Zod at boundaries; …>`
- `<Server Components by default; RLS mandatory; …>`
- `<Conventional commits; PRs ≤ 300 lines; …>`

---

## Using with cursor-kenji

Install skills: `npx skills add kensaurus/cursor-kenji`

Plan loops: [PLAN-LOOPS.md](https://github.com/kensaurus/cursor-kenji/blob/main/docs/PLAN-LOOPS.md)

This template ships with cursor-kenji at `docs/AGENTS.template.md`.
