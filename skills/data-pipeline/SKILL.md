---
name: data-pipeline
description: Wire ETL, ingestion, cron, edge-function, and queue jobs correctly. Use for "build a pipeline", "sync X into Y", "nightly aggregation", "cron double-counts", "dedupe", "backfill", "the numbers are wrong after a retry". Bakes in idempotency, atomic writes, data contracts, dead-letter, and observability.
license: MIT
---

# Data Pipeline Correctness

> Pipelines fail silently: a retry double-counts, a partial write corrupts a table, a schema drift poisons a dashboard, and nobody notices until the numbers are wrong. This skill bakes correctness in at build time. It complements `sbc-qa-data-integrity-audit` (which *detects* these after the fact) and the Supabase plugin (DB/Edge Functions/RLS).

## When this fires
Any job that **moves, transforms, or aggregates** data: ingestion/ETL/ELT, scheduled aggregations, edge-function workers, `pg_cron` jobs, queue consumers, webhook processors, backfills, materialized-view refreshes.

## Non-negotiables (the 5 that prevent silent corruption)

1. **Idempotency** — running the same job twice must not change the result. Retries, at-least-once queues, and overlapping cron fires are guaranteed, not hypothetical.
 - Use `INSERT ... ON CONFLICT (natural_key) DO UPDATE` (upsert), not blind `INSERT`.
 - Derive a deterministic dedup key from the source event, not `now()` or a random id.
 - For aggregates: recompute-and-replace a window, or use idempotent deltas — never `count = count + 1` on a path that can retry.

2. **Atomicity** — a job either fully applies or not at all. No half-written batches.
 - Wrap multi-row writes in a transaction; stage to a temp/raw table then swap.
 - A function that writes to 3 tables must not leave 1 of them updated on failure.

3. **Data contracts** — validate shape at the boundary before trusting input.
 - Parse/validate (zod / pydantic / JSON schema) at ingestion; reject or quarantine bad rows, don't `any`-cast them downstream.
 - Pin expected columns/types; fail loudly on schema drift instead of silently coercing.

4. **Explicit delivery semantics** — know and document whether each stage is at-least-once, at-most-once, or exactly-once, and make the consumer match. Most queues/cron are at-least-once → consumers MUST be idempotent (see #1).

5. **Observability** — a pipeline you can't see is a pipeline that's already broken.
 - Emit per-run: rows in / out / rejected, duration, watermark, status. Persist it (a `pipeline_runs` table or logs), don't just `console.log`.
 - Alert on: zero rows when rows expected, reject-rate spike, run overran, run skipped.

## Staging architecture (default to 4 layers)
```
Raw → land source data unchanged, append-only, with ingested_at + source id
Staged → cleaned, typed, validated, deduped (1 row per natural key)
Curated → business entities, joined/enriched, the query surface
Aggregated→ rollups / metrics / materialized views for dashboards
```
Each layer is rebuildable from the one before it. Never transform-in-place on raw; never let dashboards read raw.

## Backfills
- Make jobs **parameterized by window** (`--from`, `--to` / date partition), not "everything since forever". The same code runs the nightly slice and the historical backfill.
- Backfills must be idempotent and chunked (partition by day/range) so a failure resumes, not restarts.
- Use a **watermark** (last-processed timestamp/id, persisted) for incremental runs; never re-scan the whole source each run.

## Failure handling
- **Dead-letter** bad/failed records to a quarantine table or DLQ with the error + payload; keep the main run moving. Silent `try/catch {}` that swallows errors is banned.
- Retries: bounded, with backoff; only retry transient errors (network/timeout), never validation failures (they'll just fail again).
- Make partial progress resumable via the watermark, not a full redo.

## Anti-patterns (reject on sight)
- **Monolithic DAG / mega-function** doing fetch+transform+load+notify in one untestable blob → split into testable stages.
- `count = count + 1` / `balance = balance + x` on a retryable path → not idempotent.
- `SELECT *` into a typed model without a contract → schema drift time bomb.
- N+1 writes in a loop instead of a batched upsert → slow + non-atomic.
- Cron with no overlap guard (job B starts before job A finishes) → double processing. Add a lock / `pg_try_advisory_lock` / "skip if running".
- Reading dashboards straight off raw ingestion tables.

## Supabase / edge-function specifics
- `pg_cron` is at-least-once and can overlap under load → make the SQL/function idempotent and guard with an advisory lock.
- Edge-function workers triggered by table inserts: dedupe on the row's natural key; the trigger can fire more than once.
- Heavy aggregation belongs in SQL / materialized views (refresh on a schedule), not in a function looping row-by-row.
- Deploy + verify the function, cron, and any new table/policy on the remote in the same turn — see `full-stack-ship-discipline`.

## Definition of done
- [ ] Re-running the job produces the identical result (idempotency proven, not assumed).
- [ ] A mid-run failure leaves no half-applied state (atomicity).
- [ ] Bad input is rejected/quarantined with a contract, not silently coerced.
- [ ] Incremental runs use a persisted watermark; backfill is windowed + chunked.
- [ ] Per-run metrics are emitted and an alert exists for zero-rows / reject-spike / overrun.
- [ ] No overlap hazard on scheduled jobs (lock or skip-if-running).

## Composes with
- `audit-db-schema` — the schema/constraints the pipeline writes into.
- `supabase-postgres-best-practices` — Postgres-level query/index tuning (official Supabase plugin).
- `full-stack-ship-discipline` — deploy + verify functions/cron/policies on the remote.
- `workflow-spec-workflow-spec-tdd` — spec the contract + test idempotency/edge cases before coding.
- `sbc-qa-data-integrity-audit` — post-hoc detection of the failures this prevents.
