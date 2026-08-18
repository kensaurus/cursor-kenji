---
name: docs-adr
description: >
  Create and maintain lightweight Architecture Decision Records as
  agent-readable decision memory — what was decided, why, and which
  alternatives were rejected. Use when "record this decision", "set up ADRs",
  "the agent keeps suggesting Y again". Docs vs code drift → plan-docs-sync.
  Session state → handoff.
license: MIT
---

# docs-adr — Decision memory the next session can load

Install and maintain the repo's decision memory. **Code shows what was
decided; nothing shows why, or what was rejected — so every new agent
session is free to "improve" its way back to an alternative you already
ruled out.** Re-litigated decisions are the slowest form of drift. An
ADR makes the decision durable and its reversal deliberate.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **docs-adr** (this) | Why we chose X; rejected alternatives; INDEX.md |
| `plan-docs-sync` | Docs vs *what the code is* — not why |
| `handoff` | Session state for the next chat — not permanent decisions |
| `docs-writer` | Tutorials / README prose |
| `enhance-arch-boundaries` | Mechanical layering; this records the model |
| `workflow-housekeep` | Periodic index / status sweep |

---

## Phase 0 — Set up the system (once per repo)

- `docs/adr/NNNN-short-title.md`, numbered sequentially, plus
  `docs/adr/INDEX.md` — one line per ADR
  (`NNNN | title | status | one-line decision`). The index is the
  agent-facing surface: small enough to load every session.
- Reference the index from agent rules: *"Before proposing a change to
  architecture, dependencies, conventions, or data models, read
  `docs/adr/INDEX.md`; do not contradict an Accepted ADR without flagging
  it explicitly to the user."*
- Statuses: **Proposed → Accepted → Superseded by NNNN / Deprecated**.
  Never edit an Accepted ADR's decision — supersede it with a new one
  that links back. History is the point.

---

## Phase 1 — The format (one page, hard cap)

```
# NNNN. <Decision as a verb phrase>
Status: Accepted            Date: YYYY-MM-DD
## Context
2–5 sentences: the forces. What problem, what constraints.
## Decision
1–3 sentences, imperative: "We use X for Y."
## Rejected alternatives
The load-bearing section for agents. Each alternative: one line — what
it was, WHY it lost. This is what stops re-proposal.
## Consequences
2–4 sentences: what this commits us to, what it makes harder, when to
revisit.
```

No restating documentation, no tutorials, no aspirational essays. If it
exceeds a page it is two decisions or it is documentation (route to
`docs-writer`). "We tried it and it failed because…" is the highest-value
content — failure memory is exactly what a fresh session lacks.

---

## Phase 2 — What gets an ADR (and what does not)

Write one for any decision an agent could plausibly reverse while
"helping":

- Stack and dependency choices (and the ones rejected), including
  versions pinned for a reason.
- Architecture and layering (`enhance-arch-boundaries` model is ADR #1
  material).
- Conventions with non-obvious rationale.
- Product / scope decisions that shape code ("no user accounts in v1 —
  deliberately").
- Reversals of past attempts — the "we already tried that" archive.

**Not** ADRs: routine implementation choices, anything the linter / gate
already enforces mechanically, TODOs, meeting notes. Over-recording kills
the system as surely as under-recording.

---

## Phase 3 — Backfill mode (existing repo)

Mine implicit decisions before they are lost:

- From the code: unusual choices that look wrong but are load-bearing
  (the thing every new agent "fixes" first).
- From git history / PR descriptions: reversions and migrations.
- From the user, one focused pass: "What has an agent (or a past you)
  tried to change that must stay, and why?" Write those first.

Cap the backfill at decisions that still bind (typically 5–15). This is
memory, not archaeology for its own sake.

---

## Phase 4 — Keep it alive

- New ADR in the same PR as the decision it records.
- `/handoff` / completion: any decision that meets the Phase-2 bar gets
  filed before closure (`enhance-agent-guardrails` can install the
  reminder).
- When an agent's proposal contradicts an Accepted ADR: **surface, cite,
  ask** — do not silently comply *or* silently override. Changing course
  produces a superseding ADR, on purpose, by the human.
- Periodic sweep (fits `workflow-housekeep`): statuses current, index
  matches files, superseded chains intact.

---

## Definition of Done

- [ ] `docs/adr/` + INDEX.md exist; numbering and statuses in place
- [ ] Agent rules load the index each session and forbid silent contradiction of Accepted ADRs
- [ ] Format enforced: one page, rejected-alternatives section present, supersede-not-edit
- [ ] Scope rules recorded (what does / does not get an ADR)
- [ ] Backfill done for still-binding decisions, "things agents keep trying to change" first
- [ ] Same-PR rule and handoff hook wired
- [ ] Index verified against files (no dangling numbers, no unindexed ADRs)

## Output format

1. **System files** — the directory, INDEX.md, agent-rule text added
2. **Backfilled ADRs** — each one page, rejected-alternatives filled
3. **Lifecycle wiring** — same-PR rule, handoff hook, housekeep sweep item

Present the backfill list for confirmation **before** writing the ADRs —
the decisions are theirs; the recording is yours.
