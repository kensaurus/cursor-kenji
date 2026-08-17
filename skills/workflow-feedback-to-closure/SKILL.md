---
name: workflow-feedback-to-closure
description: >
  Turn raw feedback — bug reports, user complaints, review comments, Sentry issues, QA
  findings, audit/red-team output — into deduplicated, durable, trackable tickets and
  drive each. Use when "triage this feedback", "turn these reports into tickets", "process
  the bug backlog", "handle these review comments", "close the.
license: MIT
---

# workflow-feedback-to-closure — Signal → Ticket → Verified Closure

Feedback dies in three ways: it is never captured, it is captured twice, or it
is "fixed" but never verified in production. This skill prevents all three by
forcing every signal through capture → dedupe → durable ticket → fix →
live-verified closure.

> **A ticket is closed only when the fix is verified where the user hit it —
> not when a PR merges.** No signal is dropped silently; each ends as done,
> deduped, tracked, or explicitly won't-fix with a reason.

## Phase 0 — Gather and normalize

Collect every incoming signal for this pass and record its source:

- user reports / support messages / app-store reviews
- Sentry issues and alerts (`search_issues`, `analyze_issue_with_seer`)
- QA and red-team findings (`test-qa`, `test-red-team`)
- audit outputs (`audit-*`, `plan-*` reports)
- PR review comments and bot findings
- production logs and advisors (`get_logs`, `get_advisors`)

Normalize each into a common shape: `{ source, raw, symptom, suspected area,
severity signal, first/last seen, evidence link }`. Do not fix anything yet.

## Phase 1 — Dedupe and cluster

1. Cluster signals that describe the same underlying defect (same stack trace,
   same flow, same root symptom). One defect = one ticket, with all reporting
   sources attached as evidence.
2. **Dedupe against what already exists** before creating anything: search the
   issue tracker (`gh issue list`/search), `.cursor/` state files, and existing
   Sentry issue links. Link duplicates to the canonical item; never open a
   second ticket for a known defect.
3. Separate genuine defects from feature requests and from "working as
   intended" — route the latter two out, with a note, rather than forcing them
   into the fix pipeline.

## Phase 2 — Write durable, reproducible tickets

For each unique defect, produce a ticket that a different engineer could act on:

```md
### <concise title>
Sources: <Sentry link, report ids, review, audit finding>
Severity: Critical | High | Medium | Low   Impact: <who/how many>
Environment: <where observed>
Repro:
1. <step>
Expected: <...>   Actual: <...>
Suspected area: <file/module/endpoint>
Acceptance: <observable proof the fix works>
```

Persist the batch to `.cursor/feedback-closure-state.md` and, when a tracker is
in use, create/label the corresponding issues (`gh issue create`). The state
file is the source of truth if context compacts.

```md
# Feedback → Closure: <batch/date>
Tracker: <gh repo / none>

## Tickets
- [ ] <id/title> — severity — status: open|in-progress|fixed|verified|wont-fix
      dedupe: <canonical or "unique"> — acceptance: <proof>

## Duplicates merged
- <signal> → <canonical id>

## Not a defect (routed out)
- <signal> — <feature request / by design> — <where routed>

## Evidence
- <ticket>: <fix + verification result>
```

## Phase 3 — Prioritize

Rank by impact × severity ÷ effort. Critical production crashes and data-loss
paths first, then broad UX breakage, then degraded experiences, then cosmetics.
Present the ranked list; for large batches confirm the cut line with the user.

## Phase 4 — Fix through the right skill

Drive each ticket to a fix using the matching workflow — do not improvise:

- reproducible bug from a report/Sentry → `workflow-fix-and-ship`
- a plan's connected deferrals / parked work → `complete-everything`
- FE/BE contract or 4xx/5xx mismatch → `debug-fe-be-integration`
- security/validation finding → the relevant `plan-*` remediation after approval
- whole-repo health debt → `workflow-green-repo`

Add a regression test that would have caught the defect. Update the ticket
status to `fixed` (not `verified`) when the code lands.

## Phase 5 — Verify and close

- Verify each fix **where the user hit it**: live flow via `test-playwright`,
  the failing query re-run, or the production signal confirmed gone after
  deploy (pair with `workflow-ship-and-observe` when a release is required).
- Only then set the ticket to `verified` and resolve the linked Sentry issue /
  close the tracker issue. Closing before live verification is forbidden.
- A defect that cannot be reproduced or verified is marked `needs-info` with the
  precise missing detail — not silently closed.

## Phase 6 — Report

```md
## Feedback → Closure — report (<date>)
Signals in: <n>  Unique defects: <n>  Duplicates merged: <n>
### Closed (verified live)
| Ticket | Severity | Fix (file) | Verified |
### In progress / deferred (tracked, with owner or reason)
### Routed out (feature request / by design)
### Won't-fix (justified)
```

Leave `.cursor/feedback-closure-state.md` as the audit trail unless asked to
remove it.

## Related

- `workflow-fix-and-ship` — the per-bug fix→verify→ship lifecycle
- `complete-everything` — close a plan's connected parked work
- `iterate-post-launch` — mine production signals proactively
- `workflow-ship-and-observe` — verify fixes live and watch stability
- `debug-sentry-monitor` — triage and resolve Sentry issues
- `verification-before-completion` — a ticket closes at verified, not merged
