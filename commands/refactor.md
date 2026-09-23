---
description: "Systematic refactoring: analyze → split → extract → verify behavior, with no truncation or omitted lines"
argument-hint: "[file or module]"
disable-model-invocation: true
---

# /refactor

> Systematic refactoring: analyze → split → extract → verify behavior. Move code, do not retype it: edit surgically, keep every public API and behavior identical, and leave code the refactor does not touch untouched. A bug you find on the way is a follow-up, not part of the refactor.

This command is a thin entry point. The full playbook lives in the **`workflow-refactor`** skill, which covers safe incremental transformations, splitting large files, extracting components/hooks, and dependency-aware verification.

Use `/refactor` when you want to explicitly trigger refactoring. Otherwise, say "refactor this", "split this file", "extract a hook", or "clean up this module" and the skill auto-fires.

Related: `audit-code-quality` for spotting smells before refactoring, `audit-code-review` for verifying behavior preservation after.
