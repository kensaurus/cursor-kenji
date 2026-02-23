---
name: spec-writing
description: Write effective specs, plans, and briefs for AI agents. Use when planning a feature, writing a technical spec, creating an implementation brief, preparing context for an agent session, or when user mentions "write a spec", "plan this feature", "brief for agent", "design doc", "PRD", "technical spec", or "help me plan".
---

# Spec Writing for AI Agents

## Why Specs Matter
Vague prompts produce vague code. A good spec gives the agent:
- **What** to build (requirements, not solutions)
- **Why** it exists (constraints, context, tradeoffs)
- **How to verify** it's correct (acceptance criteria)
- **What not to do** (explicit constraints)

One well-written spec is worth 10 follow-up corrections.

## Spec Template

```markdown
## Goal
One sentence: what should exist after this is done that doesn't exist now?

## Background & Context
- Why is this needed?
- What problem does it solve?
- Any prior art or existing code to build on?
- Constraints (time, performance, backwards compatibility)?

## Requirements

### Must Have
- [ ] Requirement 1 (user-visible behaviour)
- [ ] Requirement 2

### Should Have
- [ ] Nice-to-have 1

### Must NOT Do
- Do not change X (existing users depend on it)
- Do not add a new DB table (use existing Y)

## Acceptance Criteria
How will we know it's done?
- [ ] User can do X and sees Y
- [ ] Error case Z shows message W
- [ ] Performance: page loads in <200ms
- [ ] Tests pass, no console errors

## Technical Notes
- Use existing `useAuth` hook for auth checks
- Matches pattern in `features/billing/` 
- Schema change: add `status` column to `orders` table
- New Zod schema needed for form validation

## Out of Scope
- Feature X (future iteration)
- Mobile optimisation (separate ticket)
```

## Writing Principles

### Be specific about behaviour, not implementation
```markdown
# Good — describes observable behaviour
"When the user submits an invalid email, show an inline error message below the field."

# Bad — prescribes implementation
"Add a useState for emailError and set it in the onChange handler."
```

### State constraints explicitly
```markdown
# Be explicit about what NOT to do
- Must work without JavaScript (no client-only state)
- Must not break existing `/api/users` endpoint
- Must use existing Button component from @/components/ui
```

### Include examples
```markdown
## Example Inputs/Outputs

Input: User uploads a 2MB JPEG
Expected: Image compressed to <500KB, stored in Supabase storage, URL returned

Input: User uploads a 10MB PDF  
Expected: Error toast "File too large. Maximum 5MB."
```

### Define edge cases
```markdown
## Edge Cases
- What if the user is not authenticated?
- What if the network request times out?
- What if two users submit simultaneously?
- What if the data is empty/null?
- What happens on mobile vs desktop?
```

## Spec Sizes

### Micro (1-2 files, <1 hour)
Just a few bullets:
```
Add a "Copy link" button to the share modal.
- Uses navigator.clipboard.writeText()
- Shows "Copied!" toast for 2s on success
- Falls back to prompt() if clipboard API unavailable
```

### Standard (1 feature, 1 day)
Use the full template above.

### Large (multi-feature, multi-day)
Break into multiple micro/standard specs. Each should be independently implementable.

## Saving Plans in Cursor
Use Plan Mode (`Shift+Tab`) to have the agent generate an implementation plan from your spec, then:
- Edit the plan directly to adjust approach
- Click "Save to workspace" → stored at `.cursor/plans/`
- Plans are reusable context for future sessions

## Red Flags in Specs
- "Make it better" → Specify what "better" means
- "Add AI to it" → Specify what the AI should do and when
- "Like X app" → Describe the specific behaviour you want
- No acceptance criteria → Can't know when it's done
- Acceptance criteria that test implementation → Test behaviour instead
