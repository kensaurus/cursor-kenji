---
name: handoff
description: >-
  Compact the current conversation into a handoff document a fresh agent can pick
  up. User-invoked via /handoff; an optional argument describes what the next
  session will focus on.
disable-model-invocation: true
license: MIT
---

# Handoff

> Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

Write a handoff document summarizing the current conversation so a fresh agent
can continue the work. Save it to the OS temporary directory — **not** the
current workspace — and print the path.

## Contents

- **State**: what was attempted, what is done, what is verified vs merely edited.
- **Next steps**: the concrete remaining work, in order, with file paths.
- **Suggested skills**: which skills the next agent should invoke, and for what.
- **Pointers, not copies**: do not duplicate content already captured in other
  artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path
  or URL instead.
- **Gotchas**: anything non-obvious the next agent would otherwise rediscover the
  hard way (flaky tests, env quirks, decisions already ruled out).

## Rules

1. Redact sensitive information: API keys, passwords, tokens, PII.
2. If the user passed an argument, treat it as the next session's focus and
   tailor the document accordingly.
3. Be honest about verification state — use the ladder from
   `verification-before-completion`: implemented → scoped verified → repository
   green → PR green → deployed verified. Never upgrade a claim in a handoff.
4. Permanent decisions (stack, layering, rejected alternatives) belong in
   `docs-adr`, not in the handoff. Point at `docs/adr/INDEX.md` if it exists;
   do not re-copy those records here.
