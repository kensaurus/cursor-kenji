---
name: audit-infra-cost
description: >
  Read-only audit of hosting, database, storage, egress, and serverless spend
  (Supabase, Vercel, S3/R2, edge). Use when "hosting bill is high", "cut infra
  costs", or a bill jumps. CI minutes → audit-cicd. Model tokens →
  plan-llm-cost-guardrails. Consumes test-load numbers.
license: MIT
---

# audit-infra-cost — Hosting spend without hurting reliability

**Degree of freedom: HIGH** — quantify and plan. Phase 2 stays plan-only
until approved. Never propose a cut that weakens backups (`plan-backup-dr`).

Read-only. Find where money leaks in the infra bill and plan cuts that do not
trade away reliability.

**For a solo operator, infra cost is runway.** A silent egress or storage leak
can double a bill nobody is watching.

> **Quantify and plan. Apply only on approval.** Never propose a cut that
> weakens backups (`plan-backup-dr`) or user experience.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-infra-cost** (this) | Compute, storage, bandwidth, platform fees |
| `audit-cicd` | GitHub Actions minutes / artifacts |
| `plan-llm-cost-guardrails` | Model tokens / quota abuse |
| `test-load` | Measured peak — right-size to this, not a guess |
| `audit-bundle-size` / `audit-performance` | Client payload (feeds egress) |
| `backend-db-performance` | The index that stops compute burn |

## How to reason

1. **Observe** — billed resource, pricing model, and (if exposed) the breakdown line
2. **Interpret** — is this utilization, a leak (egress/storage/zombies), or a tier mismatch?
3. **Classify** — safe quick win / medium / structural / do-not-cut (backup/UX)
4. **Severity** — by $ magnitude × reliability risk, not by how easy the cut looks

## Worked example

> **Observe:** object-storage bill is 40% of spend; logs prefix has no
> lifecycle; backups retained 90 days (DR requirement).
> **Interpret:** unbounded logs are the leak; backup retention is not a cut.
> **Classify:** safe quick win (expire temp logs) + do-not-cut (backups).
> **Severity:** major $; reliability risk low if only temp logs expire.
> **Finding:** logs | ~X% | lifecycle 7d | do not touch backup prefix

---

## Phase 0 — Map the spend surface  [HIGH freedom]

Enumerate billed resources and, if the provider exposes it, the breakdown:

- Compute (functions / servers / containers)
- Database (compute + storage + connections)
- Object storage (GB + operations)
- **Egress** (usually the sneaky line)
- CDN, per-seat / per-project fees

Note each pricing model (per-request, per-GB, per-hour, tiered) — that is
where the leak hides.

---

## Phase 1 — Waste  [HIGH freedom]

**Egress** — Large assets from origin every request? Unoptimized images?
Hotlinking / unthrottled public endpoints? Cross-check `audit-bundle-size`.

**Storage growth** — Unbounded uploads, logs, backups that never expire,
orphans after DB deletes. Lifecycle to cheaper tiers?

**Over-provisioning** — Sized for a rare peak, 24/7 low utilization. Pair
with `test-load`. Under-provision that forces expensive workarounds is also
a finding.

**Serverless** — Keep-warm waste, chatty N+1 invocations, long functions
that belong on a queue, cron too frequent.

**Database** — Full scans, missing indexes (`backend-db-performance`),
pool misconfig forcing a bigger instance, unbounded rows with no archive.

**Zombies** — Duplicate staging, unused region, leftover add-ons.

**Tier fit** — Next tier cheaper than overages? Paid add-on cheaper than
the current pattern?

---

## Phase 2 — Plan (approve before executing)  [HIGH freedom — plan only]

Estimate saving magnitude ("egress is ~X% of the bill; CDN cuts most of it")
and reliability risk.

- **Safe quick wins** — CDN/cache, image optimize, expire temp logs, delete
  zombies, add the missing index
- **Medium** — right-size to measured load, lifecycle-tier cold data, batch
  chatty calls, queue long work
- **Structural** — plan/tier change, architecture shift

Protect `plan-backup-dr` items. Do not expire backups to save cents.

---

## Definition of Done

- [ ] Billed resources + pricing model enumerated
- [ ] Egress / storage / compute / serverless / zombies / tier-fit scored
- [ ] Right-size vs real utilization or `test-load`
- [ ] Each finding has saving magnitude + reliability risk
- [ ] Nothing proposed that weakens backups or UX
- [ ] Plan approved before change

## Self-critique before reporting  [LOW freedom — do not skip]

1. **Quantified** — each finding has a saving magnitude, even if rough
2. **Backups protected** — no expire-backups-to-save-cents item
3. **Right-sized to evidence** — `test-load` or utilization, not a guess
4. **Right owner** — CI minutes → `audit-cicd`; tokens → `plan-llm-cost-guardrails`
5. **Nothing applied** until approved

## Output format

1. **Spend surface** — resource | model | rough share
2. **Findings** — leak | est. saving | fix | risk
3. **Fix plan** — safe-quick-win → structural
4. Read-only until approved

## Related

- `audit-cicd` — pipeline cost
- `plan-llm-cost-guardrails` — token spend
- `test-load` — capacity numbers
- `plan-backup-dr` — do not cut restore
- `audit-bundle-size` / `backend-db-performance` — technical levers
