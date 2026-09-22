---
description: "Research, clarify requirements, and produce an approved implementation plan before writing code"
argument-hint: "[task or feature]"
---

# /plan-mode

> Research the codebase, clarify requirements, and produce an approved plan before writing code.

> **Named `/plan-mode` (not `/plan`).** Claude Code, the Cursor CLI, and Gemini CLI all ship a built-in `/plan` that enters Plan mode. This file is the procedure; the built-in is the mode switch. The portable copy is named `plan-mode` for the same reason.

## Purpose

Use Plan mode to research, clarify requirements, and produce an approved implementation plan before writing code.

> **Runtime note:** In Cursor, `Shift+Tab` from the chat input rotates to Plan mode, and the mode picker does the same. Plans save to the home directory by default; "Save to workspace" moves one into the repo (`.cursor/plans/`) for sharing and later sessions. Claude Code also toggles plan mode with `Shift+Tab` and approves through its plan-mode prompt. There, a workspace plan file is not guaranteed.

## Process

### 1. Enter Plan mode

Press `Shift+Tab` in the agent input, use the mode picker, or run the host's built-in `/plan`. Do not treat this `/plan-mode` file as the mode switch.

The agent will:

- Search the codebase for relevant files and context
- Ask clarifying questions about requirements
- Produce a detailed plan with file paths and code references
- Wait for approval before building

### 2. Review and refine the plan

Plans open as Markdown. Edit directly to:

- Remove unnecessary steps
- Adjust the approach or architecture
- Add context the agent missed
- Specify patterns, libraries, or constraints

**Save to workspace** when the plan should outlive the session. Cursor stores that copy under `.cursor/plans/`.

### 3. Approve and execute

Once the plan looks right, approve it. The agent switches to implementation mode.

If the result doesn't match expectations:

1. Revert the changes
2. Refine the plan with more specifics
3. Re-run — faster than fixing a wrong implementation

### 4. Checklist

- [ ] Requirements clearly stated
- [ ] Existing patterns identified (check codebase first)
- [ ] Affected files listed
- [ ] Edge cases noted
- [ ] Plan saved to the workspace if it should be shared or resumed
- [ ] Plan approved before implementation starts

## When to use

- Complex features with more than one valid approach
- Tasks that touch many files or systems
- Unclear requirements
- Architectural decisions you want to review first

## When to skip

- Small, isolated changes you've done many times
- Bug fixes with an obvious root cause
- Single-file edits with clear requirements
