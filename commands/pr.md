---
description: "Validate and open or manage a PR from an already-committed branch"
argument-hint: "[title]"
---

# /pr

> Validate and open or manage a PR from an already-committed branch.

This command is a thin entry point. The full PR lifecycle playbook lives in the **`workflow-pr`** skill, which covers validation, monitoring, bot-feedback handling, and merge criteria.

Use `/pr` when you want to create or manage a PR from an already-committed
branch. Otherwise, say "open a PR" or "manage this PR".

Related: `workflow-git-commit` for commit hygiene, `audit-code-review` for pre-merge review, `babysit` (Cursor skill) for keeping the PR merge-ready after open. Dirty working tree that still needs review + commit + a merge-ready PR is `/release-prep` (`workflow-release-prep`).
