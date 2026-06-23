---
name: plan-data-integrity
description: >
  Audit a project for destructive-operation and migration safety gaps (the failure class
  that wipes production data), then produce a phased safeguard plan. Use when the user says
  "is my migration safe", "could I lose data", "check my backups", "destructive operations",
  "my agent might delete prod", "safe schema changes", "disaster recovery", or is hardening
  before launch. April 2026 PocketOS/Railway: AI agent deleted prod DB and backups in 9s —
  overprivileged tokens, shared blast radius, no env isolation, no destructive gate; prompt
  rules ignored. Audits unguarded delete/truncate/drop, column drops without backfill,
  backups in prod blast radius, over-scoped agent/CI tokens. Plan only until approved.
  Pairs with plan-rls-audit, audit-db-schema, db-migrator. Do NOT use for query perf or RLS.
license: MIT
---

# Data-Integrity & Destructive-Op Audit + Safeguard Plan

**Role:** Senior platform engineer + disaster-recovery specialist.

**Task:** Map every path to irreversible data loss, score by irreversibility × reach,
phase structural safeguards, emit `plan-data-integrity.md`. **Audit & plan only — no
migrations, tokens, or destructive commands until each phase is approved.**

**Find what could wipe prod. Gate it. Change nothing until approved.**

On April 25, 2026, an AI agent deleted PocketOS's entire production database — *and
every backup* — in nine seconds on Railway. Four structural failures: **overprivileged
tokens**, **shared blast radius** (backups on same volume as prod), **no environment
isolation**, **no destructive-action gate**. Written rules were ignored. Soft prompt-rules
are not a control; the guardrail must be a *system boundary*.

---

## When this fires

Trigger phrases: *"is this migration safe"*, *"could I lose data"*, *"check my
backups"*, *"destructive operations"*, *"my agent might nuke prod"*, *"safe
schema change"*, *"disaster recovery"*, *"pre-launch data safety"*.

Do **not** fire for: query speed (`backend-db-performance`), RLS access
(`plan-rls-audit`), or schema *design* quality (`audit-db-schema`). This skill
owns *irreversible data loss and migration safety* specifically.

---

## Why a dedicated skill

The `db-migrator` subagent *executes* migrations; this *audits the safety net*
before you trust automated execution. Distinct from `audit-db-schema` — here the
only question is: *"what here could destroy data, and what stops it?"*

---

## The audit

### A · Destructive operations in code & migrations
- **Unguarded `DELETE` / `UPDATE` without `WHERE`** — or WHERE that matches all.
- **`TRUNCATE`, `DROP TABLE`, `DROP COLUMN`** in migrations — confirm intent.
- **Column drops/renames without backfill** — silent data loss.
- **Cascade reach** — `ON DELETE CASCADE` further than intended.
- **Destructive verbs in agent/CI scope** — `drop`, `truncate`, `destroy`, `rm -rf`.

### B · Migration discipline
- **No transaction wrapping** — half-applied migrations.
- **No down/rollback path.**
- **Run straight against prod** — no staging dry-run.
- **Supabase specifics** — prod-linked CLI without branch/preview check.

### C · Backup blast radius (the PocketOS lesson)
- **Backups in same blast radius** as production — same credentials can delete both.
- **No immutable / air-gapped backup.**
- **Untested restore** — RPO/RTO undefined.
- **Stale-only fallback** — note if latest restorable backup is months old.

### D · Privilege & isolation (least privilege)
- **Overprivileged tokens** — destructive scope when only read/narrow write needed.
- **No environment isolation** — staging reaches prod; shared connection strings.
- **Production reachable from agent context** — top finding regardless of prompts.

### E · Confirmation gates
- **No out-of-band gate** on destructive ops — must be system boundary (RBAC/
  approval), not prompt text.
- **No kill switch / audit log** for agent operations.

---

## Procedure

1. **Inventory destructive surface.** Migrations, SQL, scripts, agent/CI scopes.
2. **Trace each to impact.** Reversible? gated? backed up outside blast radius?
3. **Score.** "Agent can delete prod, backups share volume" = Critical, top of list.
4. **Phase** — gates and blast-radius separation first.
5. **Emit `plan-data-integrity.md`. End the turn. Do not edit anything.**

---

## Guardrails

- **Plan only.** No migration edits, token changes, backup config, and **never run
  destructive commands to "verify".**
- **System boundaries over prompt-rules.** Recommend structural gates, not more
  agent instructions.
- **Least privilege is the cheapest win.**
- **Backups outside the blast radius or they don't count.**
- **Backfill before drop.** One-step column drops on populated data = data loss.

---

## Report template — `plan-data-integrity.md`

```markdown
# Data-Integrity & Destructive-Op Audit — <repo>

_Audit-only. No migration, token, or backup config changes until approved._
_No destructive command is run for any reason._

## Scope
- Audited: migrations ☐  SQL/scripts ☐  agent/CI token scopes ☐  backup config ☐
- Stack: Supabase ☐  Railway ☐  Vercel ☐  AWS ☐  | Assumptions: …

## Verdict
| Severity | Count | Worst case |
|----------|-------|-----------|
| Critical | n | irreversible prod loss, no gate, backups in blast radius |
| High     | n | unbackfilled drop, over-scoped token |
| Medium   | n | no rollback path, untested restore |

## Findings
| # | Operation / location | Data at risk | Reversible? | Gated? | Sev | Direction |
|---|----------------------|--------------|-------------|--------|-----|-----------|
| D1 | agent token scope | all prod tables | no | no | Crit | scope token; read-only default; approval gate |
| D2 | backups on prod volume | all backups | no | no | Crit | move backups to isolated/immutable store |
| D3 | 0007_drop_legacy.sql | users.legacy_id | no | no | High | backfill→verify→drop in separate migration |

## Phased burndown
- **Phase 1 — Gates & isolation** → infra/RBAC config — D1, D2 (make catastrophe impossible)
- **Phase 2 — Migration safety** → `db-migrator` — backfill steps, transactions, rollbacks
- **Phase 3 — Backup & restore proof** → infra — immutable backups, test a restore
- **Phase 4 — Least-privilege sweep** → infra + `plan-secrets-audit` — token scoping

## Execution handoff
Approve a phase to run it. Test restore into an isolated env (never overwrite
prod). Confirm the agent identity cannot delete backups.
```

---

## Chains with

- **Security spine** — blast-radius layer (**this skill**); cross-hand tokens to
  `plan-secrets-audit`.
- **Execution:** `db-migrator`, `backend-patterns`, infra config, `create-hook`.
- **Verify:** restore backup into isolated env; confirm agent token can't reach prod.

> Plan with a strong model; execute with `composer-2.5-execution.mdc` riding
> along. Highest-stakes plan in the set — the plan says *what* can destroy data;
> the rule forbids the agent from doing it autonomously.
