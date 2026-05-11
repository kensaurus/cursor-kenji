# /commit

> Smart pre-commit pipeline: lint, Sentry pre-check, build verify, auto-detect scope, conventional commit, push.

This command is a thin entry point. The full playbook lives in the **`workflow-git-commit`** skill at `~/.cursor/skills/workflow-git-commit/SKILL.md`, which the agent loads automatically when this command is invoked or when commit-related intent is detected in chat.

Use `/commit` when you want to explicitly trigger the pipeline. Otherwise, just say "commit this" or "stage and commit" and the skill fires on its own.

Related: `workflow-pr` for full PR lifecycle, `audit-code-review` for pre-merge review.
