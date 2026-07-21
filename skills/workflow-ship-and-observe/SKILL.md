---
name: workflow-ship-and-observe
description: >-
  Take merged, repository-green code all the way to a verified, monitored
  production release for any app stack. Confirm the target and the exact source
  revision, deploy (or trigger the deploy pipeline), verify the intended
  revision is actually live, smoke-test critical flows against production, then
  watch error/latency signals through a defined stability window and either
  confirm stable or execute an explicit rollback/hotfix. Use when "ship it",
  "deploy to production", "release this", "go live", "roll this out", "promote
  to prod", or "cut a release" for a running application (not an npm package —
  use deploy-npm for that). Complements deploy-verify with the observe-and-roll-
  back tail.
license: MIT
---

# workflow-ship-and-observe — Release, Verify, Observe, Roll Back

Shipping is not merging. A release is done only when the **intended revision is
live on the confirmed target, production smoke checks pass, and a defined
monitoring window elapses without crossing rollback thresholds** — or a
rollback/hotfix has been executed.

> **Prove the deployed revision, then watch it.** A 200 from a URL is not proof
> that your code is live, and "it deployed" is not proof that it is healthy.

**Before any browser action, read `protocol-browser-anti-stall`.**

## Phase 0 — Pin the target and the revision

Never guess where or what you are shipping. Establish:

1. **Source revision** — the exact commit SHA to release. Confirm it is merged
   and that the repository is green (route to `workflow-green-repo` /
   `complete-everything` if not). Record the SHA.
2. **Target environment** — which environment and provider. Discover from the
   repo, do not assume: `vercel.json`, `netlify.toml`, `fly.toml`,
   `Dockerfile`, `render.yaml`, Kubernetes manifests, GitHub Actions deploy
   workflows, `app.json`/EAS, `supabase/config.toml`, Terraform. Confirm the
   environment (staging vs production) with the user once and reuse it.
3. **Deploy mechanism** — CI-on-merge, a manual pipeline trigger, or a CLI
   command. Identify the exact command/workflow and how to read its status.
4. **Backend dependencies** — migrations, edge functions, RLS, buckets,
   secrets, cron. Per `full-stack-ship-discipline`, these must deploy and be
   verified alongside the frontend. Non-destructive schema required by the
   approved release ships without re-asking on a confirmed target; destructive
   data operations always ask first.
5. **Rollback plan** — the concrete, executable way to revert this target
   (previous deployment promotion, image/tag rollback, revert-and-redeploy,
   migration down-path). If no rollback exists, say so before shipping.
6. **Signals** — where errors and latency are observed (Sentry, provider logs,
   Supabase logs/advisors, uptime checks) and the thresholds that mean "roll
   back."

Write `.cursor/ship-state.md`:

```md
# Ship & Observe: <app> → <environment>
Revision: <sha>
Target/provider: <name>
Deploy: <command/workflow>
Rollback: <exact procedure>
Monitor window: <duration> · thresholds: <error rate / latency / crash-free>

## Steps
- [ ] preflight: repo green + revision confirmed
- [ ] backend deps deployed + verified
- [ ] deploy triggered
- [ ] deployed revision matches <sha>
- [ ] production smoke: <critical flows>
- [ ] monitoring window elapsed within thresholds
- [ ] stable OR rollback/hotfix executed

## Evidence
- <step>: <command/result>
```

## Phase 1 — Preflight

- Confirm the release SHA is merged and green. Do not ship red or unmerged code.
- Deploy and verify backend dependencies first, so the frontend does not hit a
  missing table/function on first request. Verify objects exist as the role the
  client uses.
- Confirm the rollback procedure is real and, where possible, dry-run it.

## Phase 2 — Deploy

- Trigger the deploy via the identified mechanism. Never hand-edit production
  state outside the pipeline.
- Wait for the deploy to reach a terminal state; capture the build/deploy logs.
  A failed or partial deploy is a stop-and-fix, not a proceed.

## Phase 3 — Verify the revision is live

- Confirm the **deployed revision equals the intended SHA** — via the
  provider's deployment metadata, a `/version`/build-id endpoint, a build stamp,
  or asset hashes. A reachable URL alone is not proof.
- Run production smoke checks on the critical flows: real navigation, auth,
  a primary read and a primary write path. Capture console, network (2xx where
  expected), and screenshots as evidence. Keep artifacts under `.playwright-mcp/`.

## Phase 4 — Observe the stability window

- Watch the defined signals for the agreed window (scale it to release risk).
- Track error rate/new issues (Sentry), latency and 5xx (provider/Supabase
  logs), new ERROR advisors, and crash-free rate for mobile.
- **Crossing a threshold triggers Phase 5.** Not crossing it after the window
  elapses is the only path to a "stable" claim.

## Phase 5 — Roll back or hotfix (only if a threshold is crossed)

- If signals breach thresholds: execute the rollback procedure immediately,
  confirm the prior healthy revision is live, and re-verify smoke checks.
- If forward-fix is clearly faster and safer than rollback, ship a hotfix
  through the same pipeline and re-enter Phase 3. Record the decision and why.
- Never leave production in a known-bad state to "monitor more."

## Phase 6 — Report

```md
## Ship & Observe — report
Released: <sha> → <environment/provider>
### Result: STABLE | ROLLED BACK | HOTFIXED | BLOCKED
### Evidence
- deploy: <log/status>
- revision live: <how confirmed> = <sha>
- smoke: <flows> → <result + artifacts>
- monitoring: <window> → error rate <x>, latency <y>, crash-free <z>
### Rollback/hotfix (if any)
- trigger: <threshold crossed> → action: <what ran> → outcome
### Follow-ups
- none | <tracked item>
```

Completion level is **deployed-verified** after Phase 3 and **observed-stable**
only after Phase 4 passes. Do not claim stability from a single smoke test.

## Related

- `deploy-verify` — the post-deploy smoke methodology this skill builds on
- `deploy-npm` — for npm package releases (not app deployments)
- `full-stack-ship-discipline` — backend must deploy and be verified too
- `iterate-post-launch` — turn observed production signals into the next fixes
- `workflow-feedback-to-closure` — route rollback/incident findings into tickets
- `verification-before-completion` — deployed-verified vs observed-stable levels
