---
description: "Compact the current conversation into a handoff document for a fresh agent session"
argument-hint: "[what the next session will focus on]"
---

# /handoff

Follow the **`handoff`** skill: write a handoff document summarizing the current
conversation — state, ordered next steps, suggested skills, gotchas — so a fresh
agent can continue the work. Save to the OS temp directory (not the workspace),
redact secrets, reference existing artifacts by path instead of copying them,
and report verification state honestly per `verification-before-completion`.

If arguments were passed, treat them as the next session's focus.
