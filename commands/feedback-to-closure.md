---
description: "Turn raw feedback (reports, Sentry, reviews, QA/audit findings) into deduplicated durable tickets and drive each to production-verified closure"
argument-hint: "[feedback source or batch]"
---

# Feedback → Closure

Turn raw feedback — bug reports, user complaints, review comments, Sentry
issues, QA/audit findings — into **deduplicated, durable, trackable tickets**
and drive each to production-verified closure.

Follow the **`workflow-feedback-to-closure`** skill end to end. In brief:

1. **Gather and normalize** every signal with its source (reports, Sentry, QA,
   audits, review comments, logs).
2. **Dedupe and cluster** — one defect = one ticket; search the tracker and
   `.cursor/` state before creating anything; route feature requests and
   by-design items out.
3. **Write reproducible tickets** with repro, expected/actual, suspected area,
   and observable acceptance; persist to `.cursor/feedback-closure-state.md`
   (and `gh issue create` when a tracker is used).
4. **Prioritize** by impact × severity ÷ effort.
5. **Fix through the right skill** — `workflow-fix-and-ship`,
   `complete-everything`, `debug-fe-be-integration`, or `workflow-green-repo`;
   add a regression test.
6. **Verify and close** only after the fix is confirmed where the user hit it;
   resolve linked Sentry/tracker issues. Closing before live verification is
   forbidden.

**A ticket is closed only when verified in production — not when a PR merges.**

The full playbook lives in the **`workflow-feedback-to-closure`** skill.

Related: `workflow-fix-and-ship`, `iterate-post-launch`,
`workflow-ship-and-observe`, `debug-sentry-monitor`.
