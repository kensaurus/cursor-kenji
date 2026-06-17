---
name: plan-uiux-unification
description: >
  Exhaustive, non-destructive UI/UX and design-system audit that produces a burndown and
  unification plan — no code changes in this pass. IA-first (hierarchy before layout),
  preservation contract (no feature removal, no fabricated content), full surface inventory,
  per-surface violation log, prioritized burndown with risk column, phased enhancement roadmap,
  and guardrails. Enhances the existing design system; does not replace it. Uses codebase
  reads + optional browser MCP for visual verification; Firecrawl for current-year best
  practices. Use when asked to "UI/UX unification plan", "design system audit plan", "UI
  burndown", "unify the design system", "plan UI overhaul", "design system consolidation",
  "IA audit before redesign", "audit UI without fixing", or "UI/UX unification".
license: MIT
---

# UI/UX & Design-System Audit + Unification Plan

**Role:** Senior frontend/mobile architect + design-systems engineer.

**Task:** Deep, exhaustive, *non-destructive* audit. Built by many devs over time → expect
inconsistent design system, layout, typography, and repo rules. Find every violation,
document it, produce a burndown + enhancement plan. **Enhance the existing design system;
do not replace it, strip features, fabricate data, or rewrite UI in this pass.**

## This skill vs neighbors

| Skill | Does |
|-------|------|
| **plan-uiux-unification** (this) | Plan only — full inventory, burndown, roadmap; no fixes |
| `audit-uiux-design-system` | Visual/token/component audit; may recommend or fix |
| `audit-ux` | Heuristics, flows, microcopy quality |
| `enhance-web-ui` / `enhance-web-ux` | Implement visual/UX improvements |
| `design-system` | Build or extend the design system itself |

**Chain:** `plan-uiux-unification` → user approval → `enhance-web-ux` / `enhance-web-ui` → `test-playwright`

---

## ⛔ Preservation Contract

Read `references/preservation-contract.md` in full before Phase 0.

**Acknowledge in output #1** — restate what you will NOT do:

- No feature/route/screen/state/prop/handler removal
- No fabricated data, content, copy, or API fields
- Every codebase claim cites a file path you read
- Preserve I/O boundaries + business logic unless explicitly proposed + approved
- No silent breaking changes to public APIs, props, or routes
- This pass **plans**; visual/UX changes are proposals only

---

## Phase flow (do not skip)

```
0. Context & IA (before any layout talk)
1. Design-system ground truth
2. Full surface inventory
3. Per-surface deep audit
4. Burndown (prioritized + risk)
5. Unification & enhancement plan
6. Best-practice research (cite current year)
```

Detailed instructions: `references/phase-workbook.md`  
Templates: `references/output-templates.md`

---

## Phase 0 — Context & IA FIRST

Before pixels: user goal, primary task, key action, IA map (primary/secondary/tertiary),
content relationships, progressive disclosure.

**Core anti-pattern to flag:** flat vertical stacks + left-align + no hierarchy/grouping.

**Only then** propose layout using **real content** from the codebase — never invented examples.

---

## Phase 1 — Design-system ground truth

Auto-detect (read actual files):

```
Glob: **/tailwind.config.*
Glob: **/globals.css **/tokens.* **/theme.*
Glob: **/components/ui/**
Grep: "STYLEGUIDE|CONTRIBUTING" glob "**/*.md"
```

Critique: enhance (missing semantic tokens, thin scales) vs enforce (violations of existing rules).
Multiple systems → name canonical vs legacy + collision points.

Output short **design-system spec** (current state + proposed enhancements).

---

## Phase 2 — Surface inventory

Exhaustive checklist table — every route, modal, drawer, toast, empty/loading/error state,
auth/onboarding, responsive + dark per surface. Mark audited only after Phase 3 review.

See inventory template in `references/output-templates.md`.

---

## Phase 3 — Per-surface audit

For each surface, log violations by category:

- IA & hierarchy · Tokens · Typography · Layout/spacing
- Content & tone (rewrites preserve meaning)
- AI-generic aesthetic tells
- Components (duplicates → consolidation *proposals*)
- Interaction/states · Accessibility (WCAG 2.2)
- Conflicting/deprecated systems · Tech debt (removal needs confirmation)

**Three buckets:** violates documented rule · subjective improvement · needs DS enhancement

**Token sweep (quantify for burndown):**

```
Grep: "#[0-9a-fA-F]{3,8}" glob "*.{tsx,jsx,vue,css}"
Grep: "style=\\{" glob "*.{tsx,jsx}" output_mode "count"
Grep: "className=.*\\b(p|m|gap|text|rounded)-\\[" glob "*.{tsx,jsx}" output_mode "count"
```

Optional visual verification: read `protocol-browser-anti-stall` and
`references/playwright-session-coordination.md` in that skill before browser MCP.
Plan-only — screenshots for evidence, not fixes.

---

## Phase 4 — Burndown

Table columns:

`Surface | Violation | Category | Severity (P0–P3) | Effort (S/M/L) | Risk (Low/Med/High) | Canonical fix | File path(s)`

P0 = broken/inaccessible/brand-breaking · P3 = cosmetic. Quantify where possible.

---

## Phase 5 — Unification plan

- Consolidate DS conflicts; deprecate loser + migration path
- High-traffic layouts driven by Phase 0 IA + real content
- Content/voice guideline (tone, errors, CTAs, jargon glossary)
- Token migration / codemod strategy (value-for-value)
- Primitive consolidation as proposals with dependency checks
- Guardrails: lint rules, no raw hex, visual regression, PR checklist
- Phased roadmap: quick wins → structural → polish (each revertible)

---

## Phase 6 — Research

Firecrawl / web for **current year** best practices; cite sources:

- Token architecture (semantic/layered, W3C DTCG)
- IA + visual hierarchy · UX writing · anti-AI-slop aesthetics · WCAG 2.2

Note where this app diverges from research.

---

## Required output (in order)

1. Preservation-contract acknowledgment
2. Context & IA summary (per area)
3. Design-system spec (current + enhancements)
4. Surface inventory checklist
5. Per-surface violation log
6. Burndown table (with risk column)
7. Unification + enhancement plan + phased roadmap (+ content/voice guide)
8. Guardrails / tooling recommendations
9. Research notes + citations
10. Open questions / `[NEEDS REAL CONTENT]` list

Deliver as a single markdown doc (or canvas for large repos). **Do not open PRs or edit UI code**
unless the user explicitly approves execution in a follow-up.

---

## Rules

- **Plan only — do not fix yet.** User approves before execution.
- **IA before layout. Hierarchy first, pixels second.**
- **Enhance, don't replace.** Preserve every feature + all real content/data.
- **Never fabricate.** Cite real paths/lines. Unverifiable → say so.
- Surface unreachable or token source missing → say so, don't guess.
- Before proposing any file change: one line on what must keep working there.

---

## MCP integration

| MCP | Use |
|-----|-----|
| Firecrawl | Phase 6 research, anti-AI-slop patterns, WCAG/token governance |
| Playwright browser | Optional Phase 3 visual evidence; shared session per `protocol-browser-anti-stall` |
| Context7 | Component library / Tailwind docs when naming canonical primitives |
| Sequential Thinking | Complex IA maps or multi-system collision analysis |
