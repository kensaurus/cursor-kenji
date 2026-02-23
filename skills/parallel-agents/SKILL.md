---
name: parallel-agents
description: Run multiple AI agents in parallel using git worktrees and cloud agents. Use when working on multiple tasks simultaneously, comparing approaches across models, delegating background work, or when user mentions "parallel agents", "worktrees", "background agent", "cloud agent", "run multiple agents", "compare solutions", or "delegate to agent".
---

# Parallel Agents & Worktrees

## Why Run Agents in Parallel?
- **Compare approaches**: Same prompt across 3 models → pick the best result
- **Isolate work**: Each agent edits its own files without conflicts
- **Delegate background tasks**: Offload bug fixes, tests, docs while you work on something else
- **Speed**: Multiple independent tasks done simultaneously

## Git Worktrees (Local Parallel Agents)

### How It Works
Cursor creates isolated git worktrees for each agent. Each has its own:
- File system (changes don't affect other agents)
- Build/test environment
- Branch

When an agent finishes, click **Apply** to merge changes back.

### Starting a Worktree Agent
1. Open the agent dropdown
2. Select the **worktree** option
3. Submit your prompt
4. While it runs, start another agent in a different worktree

### Best Use Cases
- Running the same hard problem across 3 models simultaneously
- Implementing 2 independent features at once
- Having one agent write tests while another writes implementation
- Trying 2 different architectural approaches before choosing

### After Agents Finish
- Review diffs side-by-side
- Cursor suggests which solution it recommends (multi-agent judging)
- Click **Apply** on the winner
- Discard the others

## Cloud Agents (Background Delegation)

### When to Use
Delegate tasks you'd otherwise put on a todo list:
- Bug fixes that came up while working on something else
- Writing tests for existing code
- Documentation updates
- Refactoring recent changes
- Dependency updates

### Starting a Cloud Agent
- From Cursor editor: agent dropdown → cloud option
- From web: [cursor.com/agents](https://cursor.com/agents)
- From phone: Cursor mobile app
- From Slack: `@Cursor <task description>`

### How Cloud Agents Work
1. Describe the task + relevant context
2. Agent clones your repo, creates a branch
3. Works autonomously (you can close your laptop)
4. Opens a PR when finished
5. You get notified (Slack, email, or web)
6. Review and merge

### Writing Good Delegation Prompts
```markdown
# Good delegation prompt
Fix the bug where users see a 500 error when they submit the onboarding form 
with a duplicate email. The error should show an inline message "Email already 
in use" instead of crashing. See `app/onboarding/actions.ts` for the server 
action and `app/onboarding/page.tsx` for the form.

# Bad delegation prompt
Fix the email bug
```

Include:
- Exact behaviour (current vs expected)
- File paths if known
- Acceptance criteria
- Any constraints ("don't change the API contract")

## Running Multiple Models on the Same Prompt
1. Open agent dropdown
2. Select multiple models
3. Submit prompt once
4. Cursor runs all models in parallel
5. Compare results; Cursor recommends the best

Best for:
- Architecturally significant decisions
- Hard bugs where different models take different approaches
- When you want to verify the solution is correct

## Notifications
When running many agents, configure:
- Settings → notifications → agent completion
- Sounds for agent completion (hear it finish across the room)
- Slack integration for cloud agents

## Patterns

### The Parallel Spike
Run 2-3 agents with different approaches to a hard problem:
- Agent A: "Use optimistic updates with TanStack Query"
- Agent B: "Use server-sent events for real-time sync"
- Agent C: "Use Supabase Realtime subscriptions"
Compare all three, pick the cleanest.

### The Background Test Writer
While implementing feature X locally:
- Cloud agent: "Write tests for the auth flow in `features/auth/`"
- You: implement feature X
- Merge both when done

### The Parallel Review
One agent reviews for security, another for performance:
- Agent A: "Review `app/api/` for security issues (auth, input validation, RLS)"
- Agent B: "Review `app/api/` for performance (N+1s, missing indexes, large payloads)"

## Worktree Tips
- Each worktree needs its own `node_modules` if deps differ
- Share `.env` by symlinking or copying to each worktree
- Worktrees share git history — easy to cherry-pick between them
- Clean up finished worktrees: `git worktree remove <path>`
