# /pr

> Pre-flight checks → commit → push → open PR with title and description.

This command is a thin entry point. The full PR lifecycle playbook lives in the **`workflow-pr`** skill at `~/.cursor/skills/workflow-pr/SKILL.md`, which covers validation, monitoring, bot-feedback handling, and merge criteria.

Use `/pr` when you want to explicitly create a PR. Otherwise, say "open a PR" or "create pull request" and the skill auto-fires.

Related: `workflow-git-commit` for commit hygiene, `audit-code-review` for pre-merge review, `babysit` (Cursor skill) for keeping the PR merge-ready after open.
