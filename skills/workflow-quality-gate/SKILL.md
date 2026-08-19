---
name: workflow-quality-gate
description: >
  Pre-release quality gate that sequences test-red-team, audit-security,
  audit-bundle-size, audit-performance, and test-unit into a single sweep. Use when "is
  this ready to ship?", "quality gate", "pre-release checklist", or before production
  release. Gate soundness → audit-gate-logic.
license: MIT
---

# workflow-quality-gate — Pre-Release Go/No-Go

Run before any production release. Each skill contributes a specific defect
class. The combined result is a single verdict.

---

## Gate sequence

```
0. EXPLORE    → test-exploratory (optional live probe: guest vs logged-in wander + diff)
1. RED-TEAM   → test-red-team    (adversarial: UX + pipeline + security + perf)
2. SECURITY   → audit-security   (static code review: OWASP, auth, RLS, secrets)
3. BUNDLE     → audit-bundle-size (JS payload: lazy loading, tree-shaking, chunks)
4. PERFORMANCE→ audit-performance (Core Web Vitals, LCP, CLS, INP)
5. UNIT TESTS → test-unit        (coverage gaps, regression suite green?)
```

Gate 0 is optional and does **not** replace Gate 1. Use it when the user asked to
wander / monkey-test / compare guest vs logged-in first. Run gates in order —
earlier gates often surface issues that make later gates redundant or change
their scope.

**Plan-only fork:** if the user asked for a burndown and no code changes,
replace Gate 2 with `plan-security-audit` (and `plan-rls-audit` /
`plan-secrets-audit` when those are the symptom). `audit-security` may
fix inline; do not use it when the user said plan-only.

---

## Gate 1: Red team (read test-red-team)

> Read the `test-red-team` skill and follow it.

Output: coverage matrix + severity-ranked defect list.

**Blocker for gates 2–5:** if any Critical defect is found in Gate 1, pause
and ask the user whether to fix it now or continue with the remaining gates.
Critical defects must be resolved before the verdict can be GO.

---

## Gate 2: Security audit (read audit-security)

> Read the `audit-security` skill and follow it.

Focus on static code patterns missed by the live red team:
- Secrets hardcoded in source
- RLS policies absent or misconfigured
- Input validation missing on server-side handlers
- Auth guards missing on API routes

---

## Gate 3: Bundle size (read audit-bundle-size)

> Read the `audit-bundle-size` skill and follow it.

Threshold: first-load JS > 200 KB (gzip) is a Medium defect; > 400 KB is High.

---

## Gate 4: Performance (read audit-performance)

> Read the `audit-performance` skill and follow it.

Thresholds (Lighthouse mobile, simulated 4G):
- LCP > 4 s → High
- CLS > 0.25 → High  
- INP > 500 ms → Medium

---

## Gate 5: Unit tests (read test-unit)

> Read the `test-unit` skill and follow it.

Check: does the existing test suite pass? Are there obvious coverage gaps in
the code path that was changed for this release?

---

## Verdict format

```markdown
## Quality Gate Report — [App] — [Date]

### Verdict: GO / NO-GO / GO WITH CONDITIONS

### Blockers (must fix before release)
| # | Gate | Finding | Severity | File | Fix |
|---|------|---------|----------|------|-----|

### Recommended (fix soon, not blockers)
| # | Gate | Finding | Severity |
|---|------|---------|----------|

### Passed
- Gate 1 (Red team): [N] defects, [N] Critical, [N] High
- Gate 2 (Security): clean / [N issues]
- Gate 3 (Bundle): [X KB] first-load JS
- Gate 4 (Performance): LCP [X]s, CLS [X], INP [X]ms
- Gate 5 (Unit tests): [pass/fail], coverage [X%]
```

**GO** = no Critical or High blockers, all gates passed
**GO WITH CONDITIONS** = High defects present but agreed to fix post-release with a named owner + deadline
**NO-GO** = any Critical defect, or 2+ High defects without mitigation plan

This skill *runs* the sweep. Whether those gates can be silently bypassed or
gamed is `audit-gate-logic`.
