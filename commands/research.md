---
description: "Research current best practices with Context7, Firecrawl, and built-in search before implementing anything non-trivial"
argument-hint: "[topic or question]"
---

# research

Follow the **`research`** skill end to end. This command is a thin
entry point; do not replace the skill with a shorter improvised workflow.

In brief:

1. Read the current repo first — manifests, the files under change, and
   explicit research questions.
2. Fetch official, version-matched docs (Context7 when available).
3. Run Firecrawl broad search → deep scrape → discovery (or WebSearch /
   WebFetch if Firecrawl is unavailable).
4. Produce a gap analysis and a file-mapped implementation plan.
5. Do not implement until the user asks or approves.

The full playbook lives in the **`research`** skill.

Related: `workflow-onboard` for first-contact orientation, `plan-*` for
audit-only burndowns, `docs-adr` once a decision is made.
