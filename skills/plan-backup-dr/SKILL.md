---
name: plan-backup-dr
description: >
  Audit whether a project can actually recover from data loss — not just whether
  backups exist — then emit a phased DR plan. Use when "can we recover if the DB
  dies", "audit our backups", "what's our RPO/RTO", or "disaster recovery". Plan
  only. Destructive-op gates stay on plan-data-integrity.
license: MIT
---

# plan-backup-dr — Recovery capability plan

**Role:** Platform / disaster-recovery engineer.

**Task:** Prove restore works, quantify RPO/RTO, emit `plan-backup-dr.md`.
**Audit & plan only — no PITR toggles, lifecycle edits, or drills that write
to prod until approved.**

**Backup existence is not recovery capability.** An untested backup is a hope.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **plan-backup-dr** (this) | Can you restore? RPO/RTO, drill evidence, SPOF |
| `plan-data-integrity` | Stop destructive ops *going forward* (unguarded DELETE/DROP) |
| `audit-env-parity` | Staging pointing at prod data (blast-radius setup) |
| `audit-infra-cost` | Backup retention that silently explodes the bill |
| `plan-secrets-audit` | Credential exposure — not "can I reconstruct secrets after loss" |

Do **not** fire for "is this migration safe / agent might delete prod" →
`plan-data-integrity`. That skill *prevents* wipe; this one *recovers* after one.

---

## Phase 0 — Map the recovery surface

For each stateful thing, find backup *and* restore:

- **Primary DB** (Supabase/Postgres): PITR? snapshots? retention? who restores?
- **Object storage:** versioning? lifecycle that *deletes*? backed up at all?
- **Secrets & config:** reconstructable if the account vanished?
- **Auth users:** identities recoverable, or only app rows?
- **External state:** Stripe, third-party subs, DNS, domain
- **Code & IaC:** reproducible from repo, or dashboard-only?

---

## Phase 1 — Audit recovery reality

**RPO** — Real gap between backups. Daily snapshot = up to 24h gone. PITR =
seconds. State the number, not the aspiration.

**RTO** — Walk the actual restore runbook. No runbook → RTO is unbounded.

**Restore drill** — Evidence a restore *succeeded* and was verified. None →
P0 is "run one end-to-end drill" (into an isolated env, never over prod).

**SPOF** — One provider/region/account. Billing/ToS/compromise suspends
everything? Off-provider export?

**Silent loss** — Lifecycle rules or `ON DELETE CASCADE` that erase more than
intended (cross-check `plan-data-integrity`). Backups that expire before anyone
would notice slow corruption.

**Bus-factor** — Restore credentials behind a login only one person has.

---

## Phase 2 — Phased DR plan (approve before executing)

- **P0** — no proven restore; any store with *no* backup; secrets unrecoverable; bus-factor-1
- **P1** — RPO worse than the data justifies; no written runbook; no off-provider export
- **P2** — RTO reduction, automated restore verify, drill cadence

Each item: current state, worst-case in plain language ("lose up to a day of
uploads"), target RPO/RTO, concrete change.

## Definition of Done

- [ ] Every stateful store has backup AND restore method
- [ ] RPO stated as a real number per store
- [ ] RTO estimated from the actual (or absent) runbook
- [ ] Restore-drill evidence found — or absence flagged P0
- [ ] Secrets/config reconstructable
- [ ] SPOF + off-provider export status known
- [ ] Recovery-access bus-factor assessed
- [ ] Plan approved before infra change

## Output format

1. **Recovery surface** — store | backup | restore | RPO | RTO | last drill
2. **Findings** — issue | worst-case | severity | evidence
3. **SPOF map** — shared account/region/provider
4. **Phased DR plan** — P0/P1/P2 with target RPO/RTO
5. Await approval. Test restore only into an isolated env.

## Related

- `plan-data-integrity` — prevent wipe; this proves restore
- `audit-env-parity` — staging vs prod data targeting
- `audit-infra-cost` — retention vs bill
- `plan-secrets-audit` — leaked keys, not reconstructability
- `workflow-environment-ready` — local runnability, not DR
