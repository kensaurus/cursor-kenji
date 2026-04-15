---
name: design-prd
description: >
  Generate Product Requirements Documents through structured conversation for any project.
  Auto-detects tech stack, existing features, and data model from the codebase. Uses Firecrawl
  to research competitor products and UX patterns, Context7 to check framework capabilities
  for feasibility, and Supabase MCP to verify data model feasibility. Produces actionable PRDs
  with technical feasibility sections informed by real codebase analysis. Use when starting a
  new feature, documenting requirements, creating specs before implementation, or needing
  clarity on scope and success criteria.
---

# Generate PRD Skill

Create detailed, actionable Product Requirements Documents through structured conversation,
informed by codebase analysis and competitive research.

---

## Step 0: Auto-Detect Project Context

Before writing any PRD, understand the project from its source code.

### 0a. Detect Tech Stack

Read `package.json` (or equivalent) to extract:

- **Framework**: Next.js, Remix, SvelteKit, Nuxt, Django, Rails, etc.
- **UI library**: React, Vue, Svelte, Angular
- **Database**: Supabase, Prisma, Drizzle, raw SQL
- **Auth**: Supabase Auth, NextAuth, Clerk, Auth0
- **State management**: TanStack Query, Zustand, Redux, Pinia
- **CSS**: Tailwind, CSS Modules, Styled Components

### 0b. Discover Existing Features

```
Glob: **/app/**/page.tsx              → Next.js routes (features)
Glob: **/features/*/                  → Feature directories
Glob: **/src/routes/**/*.tsx          → Route-based features
Grep: pattern "export default" glob "**/page.tsx" output_mode "files_with_matches"
```

Read feature READMEs if they exist:
```
Glob: **/*README*.md                  → Feature docs
Glob: **/docs/*.md                    → Documentation
```

### 0c. Discover Data Model

```
Glob: **/supabase/migrations/*.sql    → SQL migrations
Glob: **/prisma/schema.prisma         → Prisma schema
Glob: **/drizzle/schema.ts            → Drizzle schema
Glob: **/types/*.ts                   → TypeScript type definitions
```

### 0d. Check for Existing PRDs

```
Glob: **/tasks/prd-*.md              → Existing PRDs
Glob: **/docs/prd-*.md               → Existing PRDs (alt location)
Glob: **/specs/*.md                  → Spec documents
```

### 0e. Record Context

```
PROJECT CONTEXT:
- Framework: [name + version]
- Database: [type + ORM]
- Existing features: [list of routes/feature dirs]
- Existing PRDs: [list or none]
- Data entities: [list from schema]
- Auth system: [provider]
```

---

## Step 1: Research Before Writing

### 1a. Competitive Research (Firecrawl)

When the user describes a feature, research how others have solved it:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<FEATURE_TYPE> UX patterns best practices [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Additional searches based on feature type:

| Feature Type | Search Query |
|-------------|-------------|
| CRUD / data management | `<domain> management app UX best practices` |
| Dashboard / analytics | `dashboard design patterns data visualization best practices` |
| Authentication / onboarding | `user onboarding flow best practices [current year]` |
| E-commerce / payments | `e-commerce checkout UX optimization [current year]` |
| Social / community | `social features community engagement UX patterns` |
| Content / CMS | `content management UX editing experience best practices` |
| Search / filtering | `search and filter UX patterns faceted search` |
| Settings / preferences | `settings page UX patterns user preferences` |

Scrape the most relevant result for detailed patterns:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<BEST_RESULT_URL>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

### 1b. Technical Feasibility (Context7)

Check if the framework supports what the feature needs:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<FRAMEWORK>",
  "query": "<FEATURE_CAPABILITY> support"
})
```

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<RESOLVED_ID>",
  "query": "<FEATURE_CAPABILITY> implementation guide"
})
```

### 1c. Data Model Feasibility (Supabase MCP)

If the feature involves data, check the existing schema:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "list_tables", arguments: {
  "project_id": "<PROJECT_ID>",
  "schemas": ["public"],
  "verbose": true
})
```

Or for specific tables:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = '<RELEVANT_TABLE>' ORDER BY ordinal_position"
})
```

Determine:
- Can existing tables support this feature?
- What new tables/columns are needed?
- What relationships need to be added?
- Do RLS policies need updating?

---

## Step 2: Understand the Request

When the user describes a feature, **DO NOT** start writing immediately.

Identify what is clear vs unclear:
- Clear: problem statement, target user, basic functionality
- Unclear: scope boundaries, success metrics, edge cases, technical constraints

### Check for Similar Functionality

```
SemanticSearch: "How does the app currently handle <FEATURE_AREA>?" target: []
Grep: pattern "<FEATURE_KEYWORDS>" glob "*.{ts,tsx,js,jsx}"
```

If similar functionality already exists, the PRD should extend it rather than duplicate.

---

## Step 3: Ask Clarifying Questions

### Rules

1. **Limit to 3-5 questions** — only ask what is truly unclear
2. **Number all questions** (1, 2, 3...)
3. **Provide lettered options** (A, B, C, D) for easy response
4. **Make responding easy** — user can reply "1A, 2C, 3B"

### Question Categories

| Category | Ask When... |
|----------|-------------|
| Problem / Goal | The "why" is unclear |
| Core Functionality | The "what" is vague |
| Scope Boundaries | Request is broad |
| Target User | Multiple user types possible |
| Success Criteria | No clear definition of "done" |

### Example Format

```markdown
Before I write the PRD, a few questions:

1. What is the primary goal?
   A. Improve UX for existing workflow
   B. Add net-new capability
   C. Fix a pain point
   D. Performance improvement

2. Who is the target user?
   A. Power users (daily use)
   B. New users (onboarding)
   C. All users equally
   D. Internal / admin users

3. What is the expected scope?
   A. MVP (ship fast, iterate later)
   B. Complete feature with polish
   C. Foundation for larger system

Reply with selections (e.g., "1B, 2A, 3B")
```

---

## Step 4: Generate PRD

### Template

```markdown
# PRD: [Feature Name]

> **Status:** Draft
> **Created:** [Date]
> **Author:** [User] + AI co-author

---

## 1. Overview

[2-3 sentences: what this does and why it matters]

### Problem Statement
[Pain point or opportunity being addressed]

### Proposed Solution
[High-level description]

---

## 2. Goals

| Goal | Success Metric |
|------|----------------|
| [Goal 1] | [Measurable outcome] |
| [Goal 2] | [Measurable outcome] |

---

## 3. User Stories

### Primary Stories
1. As a [user], I want to [action] so that [benefit]
2. As a [user], I want to [action] so that [benefit]

### Edge Case Stories
3. As a [user], when [unusual condition], I expect [graceful behavior]

---

## 4. Functional Requirements

### Must Have (P0)
- [ ] FR-1: [Requirement]
- [ ] FR-2: [Requirement]

### Should Have (P1)
- [ ] FR-3: [Requirement]

### Nice to Have (P2)
- [ ] FR-4: [Requirement]

---

## 5. Non-Goals (Out of Scope)

- [Thing NOT doing and why]
- [Another thing NOT doing and why]

---

## 6. Technical Feasibility

### Existing Infrastructure
- **Framework:** [detected — supports feature because...]
- **Database:** [existing tables that support this: ...]
- **Auth:** [current auth supports required permissions: YES/NO]

### New Infrastructure Needed
- **Database changes:** [new tables, columns, or migrations]
- **API endpoints:** [new routes needed]
- **New dependencies:** [libraries to add, if any]

### Complexity Assessment
| Component | Complexity | Estimate | Notes |
|-----------|-----------|----------|-------|
| Frontend UI | [Low/Med/High] | [days] | [notes] |
| API layer | [Low/Med/High] | [days] | [notes] |
| Database | [Low/Med/High] | [days] | [notes] |
| Auth/permissions | [Low/Med/High] | [days] | [notes] |

---

## 7. Competitive Analysis

### How Others Solve This
[Summary from Firecrawl research]

| Product | Approach | Strength | Weakness |
|---------|----------|----------|----------|
| [Competitor A] | [how they do it] | [what works] | [what doesn't] |
| [Competitor B] | [how they do it] | [what works] | [what doesn't] |

### Our Differentiation
[What we will do differently and why]

---

## 8. UI/UX Considerations

### Key Screens
1. [Screen name] — [purpose]
2. [Screen name] — [purpose]

### UX Patterns Borrowed
- [Pattern from research] — adapted for [our context]

### Accessibility Requirements
- Keyboard navigable
- Screen reader compatible
- Color contrast WCAG AA

---

## 9. Data Model

### Existing Tables Used
| Table | Columns Used | Purpose |
|-------|-------------|---------|
| [table] | [columns] | [why needed] |

### New Tables / Changes
```sql
-- New table or ALTER TABLE
CREATE TABLE IF NOT EXISTS [table_name] (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  [columns...],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

### RLS Policies Needed
- [Policy description]

---

## 10. Open Questions

- [ ] Q1: [Unresolved question]
- [ ] Q2: [Unresolved question]
```

---

## Step 5: Iterate

After presenting the PRD:
1. Ask: "Does this capture what you had in mind?"
2. Incorporate edits
3. Resolve open questions
4. Confirm: "Is this PRD ready to save?"

---

## Step 6: Save

**Location:** `tasks/prd-[feature-name].md`

**Naming:**
- All lowercase
- Use hyphens for spaces
- Examples: `prd-dark-mode.md`, `prd-export-csv.md`, `prd-user-onboarding.md`

---

## Writing Guidelines

Target audience: a **junior developer** should understand this.

- Clear, simple language
- Define acronyms on first use
- Be explicit — no implied knowledge
- Every requirement is testable ("fast" is vague; "loads in under 200ms" is testable)
- Use tables for structured comparisons
- Include "Not doing" section to prevent scope creep

---

## Anti-Patterns

- Starting to code before asking questions
- Asking 10+ questions (keep to 3-5)
- Writing implementation details (PRD = WHAT/WHY, not HOW)
- Vague requirements ("should be fast" -> "response time under 200ms")
- Skipping competitive research (leads to reinventing the wheel)
- Skipping technical feasibility (leads to impossible requirements)
- Not checking existing codebase (leads to duplicate features)
