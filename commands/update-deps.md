---
description: "Audit outdated dependencies, research breaking changes, update one at a time, verify each, commit separately"
argument-hint: "[package]"
---

# /update-deps

> Audit outdated dependencies, research breaking changes, update one at a time, verify each, commit separately.

This command is a thin entry point. The full playbook lives in the **`workflow-housekeep`** skill (Phase 3 — Dependency Updates), which auto-detects package manager (npm/pnpm/yarn/bun/pip/poetry/cargo/go) and classifies updates by risk (patch/minor/major/security).

Use `/update-deps` when you want to explicitly trigger dependency review. Otherwise, say "update deps", "fix vulnerabilities", or "what's outdated" and the skill auto-fires.

**Next.js:** check the current support line and end-of-life before choosing a
target (`npm view next dist-tags`, https://endoflife.date/nextjs); do not assume
a version from memory. Ask: "is there a Next.js security release this month?"
and prefer `npx @next/codemod@canary upgrade latest` over a blind major bump.
`next lint` was removed in Next 16 — call ESLint directly.

Related: `audit-security` for vulnerability triage, `workflow-git-commit` for the commit-per-update pattern.
