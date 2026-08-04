---
name: workflow-merge-conflicts
description: >-
  Resolve an in-progress git merge or rebase conflict by tracing each side back
  to its original intent. Use when the user says "resolve the conflicts", "fix
  this merge", "the rebase is stuck", or a pull/merge/rebase has left conflict
  markers in the tree.
license: MIT
---

# Resolving Merge Conflicts

> Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

1. **See the current state.** `git status` for the operation in progress
   (merge/rebase/cherry-pick) and the conflicting files; `git log --oneline
   --left-right HEAD...MERGE_HEAD` (or the rebase equivalent) for what each side
   contains.

2. **Find the primary sources for each conflict.** Understand deeply why each
   change was made and what the original intent was: read the commit messages,
   check the PRs, check the original issues or tickets. Never resolve a hunk on
   textual appearance alone.

3. **Resolve each hunk.** Preserve both intents where possible. Where they are
   incompatible, pick the one matching the merge's stated goal and note the
   trade-off. Do **not** invent new behavior. Always resolve; never `--abort`
   without the user's explicit instruction.

4. **Run the project's automated checks** — typecheck, then tests, then
   format/lint, using the repo's real scripts. Fix anything the merge broke;
   conflicts that merge cleanly at the text level can still conflict
   semantically.

5. **Finish the operation.** Stage everything and commit (or `git rebase
   --continue` until all commits are replayed). Confirm the tree is clean and
   checks are green before reporting done.

**Related:** `workflow-git-commit`, `workflow-pr`, `verification-before-completion`.
