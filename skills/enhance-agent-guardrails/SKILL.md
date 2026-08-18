---
name: enhance-agent-guardrails
description: >
  Install guardrails-as-code so AI sessions cannot reintroduce leaked secrets,
  injection, or untested code. Use when "set up guardrails", "stop vibe-coding
  regressions", "add pre-commit security checks". Gate-logic audit →
  audit-gate-logic. Gate sprawl → housekeep-gates.
license: MIT
---

# enhance-agent-guardrails — Guardrails-as-Code Against AI Regressions

AI agents ship the visible 80% fast and skip the 20% that keeps a repo safe. Studies in
2026 put ~45% of AI-generated code shipping OWASP Top-10 issues, ~2.74× more security
findings per PR, and repeated production disasters from unguarded destructive actions.
Telling the agent to "be secure" doesn't work — **deterministic gates** do. This skill
installs those gates so the next fast session can't quietly reintroduce old classes of bugs.

> **Treat all agent output as untrusted until a machine check says otherwise.** The goal is
> guardrails that *block at the moment of creation* (pre-commit) and *again before merge*
> (CI), plus policy files that steer the agent up front. Additive and reversible — never
> weaken an existing check to make the setup "pass".

---

## Phase 0 — Detect stack and existing protection

```bash
# Ecosystem + CI
cat package.json 2>/dev/null | grep -iE "husky|lint-staged|semgrep|gitleaks|eslint|prettier|typescript"
ls -la .husky/ .github/workflows/ 2>/dev/null
ls .cursor/rules/ AGENTS.md CLAUDE.md .pre-commit-config.yaml 2>/dev/null
# What's already gated?
rg -n "gitleaks|trufflehog|semgrep|npm audit|osv-scanner|socket" .github/ .husky/ 2>/dev/null
```

Record: package manager, CI provider (GitHub Actions / other), existing hooks, existing
rules/policy files, and which checks already run. **Don't duplicate** what's present —
extend it.

---

## Phase 1 — Research current practice

Follow `/research`: current-year guidance on AI-code guardrails (VibeSec / OWASP), and the
current invocation for the scanners you'll wire (gitleaks, semgrep, osv-scanner/`npm audit`,
socket). Pin tool versions rather than floating `latest`.

---

## Phase 2 — Gap map (which failure classes are unguarded)

Map the documented AI failure classes to the repo's current coverage and pick what to add:

| Failure class | Guard to add (if missing) |
|---|---|
| Hardcoded secrets / credential sprawl | Secret scan (gitleaks / trufflehog) in pre-commit **and** CI |
| Injection / XSS / SSRF / OWASP | SAST (semgrep with a ruleset for the stack) in CI |
| Vulnerable / hallucinated dependencies | `npm audit` / `osv-scanner` / socket in CI; lockfile required |
| Off-system / drifting styles | Lint-as-policy (no raw hex, no arbitrary values, single icon lib) |
| Untested "plausible" code | CI requires typecheck + test to pass; coverage floor if one exists |
| Destructive shell/DB ops | Agent policy: human-in-the-loop for `rm -rf`, migrations, prod scripts |
| Context/spec drift & false-done | Point agents at `verification-before-completion` + `completion-judge` |

---

## Phase 3 — Install the guardrails

Install only the missing pieces. Keep each additive and clearly named.

### 3a. Agent policy files (steer up front)

- `.cursor/rules/*.mdc` and/or `AGENTS.md`: encode the non-negotiables as rule-as-code —
  parameterized queries only, validate/sanitize all external input, no hardcoded secrets,
  auth middleware on protected routes, **no destructive ops without explicit human
  approval**, write tests for new features. Ground it in the OWASP Top 10.

### 3b. Pre-commit hook (block at creation)

- Wire the repo's hook manager (`husky` + `lint-staged` for Node, or
  `.pre-commit-config.yaml`): run secret scan on staged files, lint + typecheck on changed
  files, and fail the commit on any finding. Keep it fast (staged-only).

### 3c. CI gate (block before merge — the authoritative gate)

- Add/extend a CI job that treats agent output as untrusted: secret scan (full history or
  diff), SAST, dependency audit, typecheck, lint, test. Fail the PR on high-severity
  findings. This is the gate that matters even if a local hook is skipped.

### 3d. Lint-as-policy

- Add rules that block off-system patterns (`no-restricted-syntax`, raw color/arbitrary-value
  rules, `no-console` where appropriate, `@typescript-eslint/no-explicit-any`) with a
  documented, reviewed escape hatch — so rules get exceptions, not blanket-disabled.

---

## Phase 4 — Verify the guards actually bite

A guardrail you didn't test is a guardrail that doesn't work.

- **Plant-and-check (dry run):** temporarily introduce a fake secret / off-system value in a
  scratch file and confirm the pre-commit hook and/or the scanner **blocks** it; then remove
  it. Never commit the planted value.
- Run the lint-as-policy rules against the current tree and report (don't mass-`--fix`
  silently — surface what would change).
- Confirm the CI workflow is valid (`act`/`yamllint` if available, or a draft PR).

---

## Phase 5 — Report + handoff

```markdown
## Agent Guardrails — report
**Already present:** [hooks/CI/rules found]
**Installed:** agent policy [files] · pre-commit [checks] · CI gate [checks] · lint-as-policy [rules]
**Verified:** planted secret blocked ✓ · lint rules run ✓ · CI workflow valid ✓
**Needs human review before enforcing:** [CI changes that will block merges / branch protection]
**Not covered here (route to):** deep secrets audit → plan-secrets-audit · OWASP depth → plan-security-audit
```

> **STOP for the human** before turning on anything that blocks merges in a shared repo
> (branch protection, required CI checks) or that rewrites history. Rotating real leaked
> secrets is out of scope — route to `plan-secrets-audit`.

---

## Related

- `audit-gate-logic` — audit whether existing gates can be bypassed or gamed (this skill *installs*)
- `housekeep-gates` — consolidate accreted duplicate gates; this skill does not delete sprawl
- `test-mutation` — assertion-strength hook this skill can install the wording for
- `docs-adr` — same-PR / handoff reminder that a decision needs a record
- `audit-security` / `plan-security-audit` — the vulnerability depth the SAST gate can't fully cover
- `plan-secrets-audit` — find + triage existing leaked secrets (and rotation plan)
- `plan-dependency-provenance` — hallucinated/slopsquatted dependency audit
- `plan-data-integrity` — destructive-operation and data-loss guardrails
- `verification-before-completion` (rule) + `completion-judge` — the false-done guard agents should obey
- `audit-llm-security` — product-facing LLM attack surface (not this repo's coding agent)
- `housekeep-design` — pairs the visual lint-as-policy with a full design consolidation
