---
description: "Create one conventional commit from an already-scoped change; never push"
argument-hint: "[message]"
---

# /commit

> Create one conventional commit from an already-scoped change. Never push.

This command is a thin entry point. The full deliberate-staging and
message-writing playbook lives in **`workflow-git-commit`**.

Use `/commit` when the files or hunks are already scoped and you need one
commit. It does not widen staging, push, or open a PR.

Related: `workflow-release-prep` for a whole dirty tree through merge-ready
PR; `workflow-pr` for an already-committed branch or open PR.
