---
description: "Review the local working tree, commit, push, open a PR, drive it merge-ready — do not merge"
argument-hint: "[optional title]"
---

# /release-prep

> Take the local working tree to a merge-ready PR against main. Do not merge.

This command is a thin entry point. The full playbook lives in the
**`workflow-release-prep`** skill.

Use `/release-prep` when the dirty tree (uncommitted + staged + untracked
+ unpushed) should become one reviewed, merge-ready PR. Existing-PR
lifecycle stays on `/pr` (`workflow-pr`). Product launch sweep stays on
`workflow-launch-ready`. Commit-message-only stays on `/commit`.
