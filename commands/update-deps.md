# /update-deps

> Audit outdated dependencies, research breaking changes, update one at a time, verify each, commit separately.

This command is a thin entry point. The full playbook lives in the **`workflow-housekeep`** skill at `~/.cursor/skills/workflow-housekeep/SKILL.md` (Phase 3 — Dependency Updates), which auto-detects package manager (npm/pnpm/yarn/bun/pip/poetry/cargo/go) and classifies updates by risk (patch/minor/major/security).

Use `/update-deps` when you want to explicitly trigger dependency review. Otherwise, say "update deps", "fix vulnerabilities", or "what's outdated" and the skill auto-fires.

Related: `audit-security` for vulnerability triage, `workflow-git-commit` for the commit-per-update pattern.
