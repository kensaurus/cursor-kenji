---
description: "Take a shipped repo to market: plan → approve → measure → message → activate → be found → launch → weekly loop"
argument-hint: "[product url or repo path, optional 'phase N' to execute an approved phase]"
disable-model-invocation: true
---

# GTM

Run the **`workflow-gtm`** skill. Default to Step 1 (`plan-gtm`) unless an
approved `plan-gtm.md` already exists — then execute the named phase:

1. **Measure** → `audit-analytics`
2. **Message** → `enhance-web-conversion` (+ `enhance-readme` when the repo is the product)
3. **Activate** → `enhance-onboarding`
4. **Be found** → `enhance-web-seo`, `plan-aeo-readiness`
5. **Launch** → `docs-launch-kit`
6. **Loop** → `iterate-post-launch`

Nothing from Step 2 onward runs before its phase is approved. End with the
GTM scorecard (funnel before/after, skips named, next week's one fix).

The full playbook lives in the **`workflow-gtm`** skill.
