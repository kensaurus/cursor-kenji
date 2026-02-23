# Plan Before Coding

## Purpose
Use Plan Mode to research, clarify requirements, and produce an approved implementation plan before writing a single line of code.

## Process

### 1. Activate Plan Mode
Press `Shift+Tab` in the agent input to toggle Plan Mode, or use the mode selector dropdown.

The agent will:
- Search the codebase for relevant files and context
- Ask clarifying questions about requirements
- Produce a detailed plan with file paths and code references
- Wait for approval before building

### 2. Review & Refine the Plan
Plans open as Markdown. Edit directly to:
- Remove unnecessary steps
- Adjust the approach or architecture
- Add context the agent missed
- Specify patterns, libraries, or constraints

**Save to workspace:** Click "Save to workspace" → stored at `.cursor/plans/`. Useful for:
- Team documentation
- Resuming interrupted work
- Context for future agents on the same feature

### 3. Approve & Execute
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
- [ ] Plan saved to `.cursor/plans/` if significant
- [ ] Plan approved before implementation starts

## When to Use
- New features touching multiple files
- Architectural decisions
- Unfamiliar areas of the codebase
- Any task where the wrong direction wastes significant time

## When to Skip
- Small, isolated changes you've done many times
- Bug fixes with an obvious root cause
- Single-file edits with clear requirements
