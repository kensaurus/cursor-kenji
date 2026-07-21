---
description: "Take merged, green code to a verified, monitored production release — deploy, confirm the revision is live, smoke-test, observe, and roll back if needed"
argument-hint: "[environment]"
---

# Ship & Observe

Take merged, repository-green code all the way to a **verified, monitored**
production release for a running app. For npm package releases use
`/deploy-npm` instead.

Follow the **`workflow-ship-and-observe`** skill end to end. In brief:

1. **Pin the target and revision** — confirm the exact merged SHA and the
   environment/provider (discover from `vercel.json`, `fly.toml`, `Dockerfile`,
   CI deploy workflows, EAS, Terraform, etc.). Identify the deploy mechanism,
   backend dependencies, an executable rollback plan, and the signals +
   thresholds that mean "roll back".
2. **Preflight** — repo green, revision merged; deploy and verify backend
   dependencies first (migrations, functions, RLS, secrets).
3. **Deploy** via the real pipeline and wait for a terminal state.
4. **Verify the revision is live** — the deployed build must equal the intended
   SHA (deployment metadata / version endpoint / asset hash), not just a 200.
   Smoke-test critical flows against production with evidence.
5. **Observe** the defined stability window; crossing a threshold triggers
   rollback or hotfix.
6. **Report** STABLE / ROLLED BACK / HOTFIXED / BLOCKED with evidence.

**Shipping is not merging.** Deployed-verified needs a proven live revision;
observed-stable needs the monitoring window to pass.

The full playbook lives in the **`workflow-ship-and-observe`** skill.

Related: `deploy-verify`, `full-stack-ship-discipline`, `iterate-post-launch`,
`workflow-feedback-to-closure`.
