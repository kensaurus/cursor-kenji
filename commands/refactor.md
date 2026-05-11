# /refactor

> Systematic refactoring: analyze → split → extract → verify behavior. No truncation, no omitted lines.

This command is a thin entry point. The full playbook lives in the **`workflow-refactor`** skill at `~/.cursor/skills/workflow-refactor/SKILL.md`, which covers safe incremental transformations, splitting large files, extracting components/hooks, and dependency-aware verification.

Use `/refactor` when you want to explicitly trigger refactoring. Otherwise, say "refactor this", "split this file", "extract a hook", or "clean up this module" and the skill auto-fires.

Related: `code-antipatterns` for spotting smells before refactoring, `audit-code-review` for verifying behavior preservation after.
