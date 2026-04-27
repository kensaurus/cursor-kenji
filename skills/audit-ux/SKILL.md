---
name: audit-ux
description: >
  Audit user experience quality using research-backed frameworks: Nielsen Norman Group's
  10 usability heuristics, Intuit Content Design System for microcopy/UX writing, Google's
  HEART metrics, and Laws of UX (Fitts's, Hick's, Miller's, Jakob's Law, cognitive load).
  Evaluates information architecture, user flows, error recovery, onboarding, content clarity,
  interaction patterns, and cognitive load. Uses browser MCP for live walkthrough, Firecrawl
  for current NN/g and UX research, and Sequential Thinking for complex flow analysis.
  Generic — works with any webapp regardless of tech stack. Use when evaluating usability,
  reviewing user flows, auditing microcopy, checking UX heuristics, assessing cognitive load,
  reviewing onboarding, or when the user mentions UX audit, usability review, heuristic
  evaluation, content audit, interaction design review, user flow analysis, or UX quality.
  This skill focuses on EXPERIENCE — for visual design system compliance (tokens, components,
  dark mode), use the audit-ui-design-system skill instead.
---

# UX Audit Skill

Research-driven user experience evaluation grounded in NN/g heuristics, Laws of UX,
Intuit Content Design principles, and Google HEART metrics.

**Before ANY browser interaction, read the `browser-anti-stall` skill and apply its rules
to every step.** That skill lives at `~/.cursor/skills/protocol-browser-anti-stall/SKILL.md`.

## CRITICAL: Context-First, Human-Centric Approach

UX recommendations that don't understand the WHY behind the product are surface-level
checkbox audits. Before evaluating ANY heuristic or pattern, you MUST deeply understand:

1. **Who is the human?** Not "users" — real people with frustrations, time pressure,
   emotional states, and goals beyond the screen. A tired parent filing taxes at 11pm
   needs different UX than a power-user analyst building dashboards at work.
2. **What's the full journey?** The page you're looking at is one moment in a longer
   story. Understand what happened before (how they arrived, what they already know)
   and what happens after (what they do with the result, where they go next).
3. **What's the data pipeline?** Trace data from human input → API → database → back to
   screen. UX breaks when this pipeline has latency, errors, or mismatch between what
   the human expects and what the system returns.
4. **What's the emotional arc?** Every product interaction has an emotional shape:
   confusion → understanding → action → confirmation → satisfaction (or frustration).
   Map where the product currently creates anxiety, confusion, or dead ends.

Do NOT skip Step 0. A shallow understanding produces shallow recommendations.

---

## Step 0: Deep Product and Pipeline Understanding

### 0a. Understand the Business and Human Context

Read README, landing page, marketing copy, and any onboarding flows to answer:

- **What problem does this solve?** (Not features — the human pain it alleviates)
- **Who is the primary human?** (Demographics, technical skill, emotional state when using)
- **What's the alternative?** (What do people do without this product? Spreadsheets? Phone calls? Nothing?)
- **What's the success moment?** (The "aha" — when the human gets what they came for)
- **What's the trust model?** (Does the user trust this product with money? Health data? Business data?)

### 0b. Map the Full Data Pipeline

Trace how data flows through the system from the human's perspective:

```
Glob: **/api/**                   → API routes
Glob: **/actions/**               → Server actions
Glob: **/hooks/use*               → Data-fetching hooks
Glob: **/lib/**                   → Core business logic
Grep: "fetch|axios|ky|useSWR|useQuery|trpc" glob "*.{ts,tsx}" output_mode "count"
```

Map the pipeline for each core task:

```
PIPELINE MAP (per core task):
1. Human input → [form / click / gesture]
2. Client-side validation → [schema / inline / none]
3. API call → [endpoint, method, payload]
4. Server processing → [validation, business logic, side effects]
5. Database operation → [create / read / update / delete]
6. Response → [shape, status codes, error format]
7. Client update → [optimistic / refetch / cache invalidation]
8. Human feedback → [toast / redirect / inline update / nothing]

Latency-sensitive points: [where slow responses hurt UX]
Error-prone points: [where failures are most likely]
Trust-sensitive points: [where wrong data erodes confidence]
```

### 0c. Map Routes and Information Architecture

```
Glob: **/app/**/page.tsx          → Next.js App Router pages
Glob: **/pages/**/*.tsx           → Next.js Pages Router
Glob: **/src/routes/**            → SvelteKit / Remix routes
Glob: **/router.*                 → Vue Router / React Router config
```

Build the information architecture mental model:

```
INFORMATION ARCHITECTURE:
- Navigation structure: [flat / hierarchical / hub-and-spoke]
- Depth: [max clicks from landing to deepest page]
- Cross-links: [can users jump between sections, or must they go back?]
- Dead ends: [pages with no forward navigation]
```

### 0d. Identify Emotional Touchpoints

Map the emotional arc of core user journeys:

```
EMOTIONAL MAP (per core flow):
- Entry emotion: [anxious / curious / frustrated / neutral]
- Friction points: [where confusion or anxiety spikes]
- Confidence builders: [where the product earns trust]
- Peak moment: [the most positive or negative experience]
- End emotion: [satisfied / relieved / confused / abandoned]
```

### 0e. Record Full Discovery

```
PRODUCT CONTEXT:
- Type: [SaaS / e-commerce / dashboard / etc.]
- Human problem solved: [the pain, not the feature]
- Primary human: [description including emotional context]
- Core tasks: [list top 3-5]
- Success moment: [what "done" looks like to the human]
- Trust level: [what's at stake — money / data / time / reputation]
- Page count: [N]
- Auth required: [YES/NO — pattern]
- Locale/i18n: [YES — languages / NO]
- Pipeline health: [known latency or error-prone points]
```

---

## Step 1: Research Current UX Standards

### 1a. NN/g — Usability Heuristics and Methods

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "site:nngroup.com heuristic evaluation checklist [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

### 1b. Intuit Content Design — Microcopy Principles

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "site:contentdesign.intuit.com UX writing principles",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Scrape the most relevant result for detailed writing guidelines.

### 1c. Laws of UX — Interaction Psychology

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "https://lawsofux.com",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

### 1d. Domain-Specific UX Research

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<PRODUCT_TYPE> UX best practices usability patterns [current year]",
  "limit": 5,
  "sources": [{ "type": "web" }]
})
```

Scrape the best result for domain-specific UX patterns.

---

## Step 2: Nielsen's 10 Usability Heuristics (Deep Evaluation)

For each heuristic, perform both **code analysis** and **live browser verification**.

### H1: Visibility of System Status

The system should keep users informed through timely feedback.

**What to find in code:**

```
Grep: "loading|isLoading|isPending|skeleton|Skeleton|spinner|Spinner" glob "*.tsx" output_mode "count"
Grep: "progress|Progress|step.*of|currentStep" glob "*.tsx" output_mode "count"
Grep: "toast|Toast|notification|Notification|snackbar" glob "*.tsx" output_mode "count"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Loading states | Skeleton/spinner visible during data fetch | Blank screen or frozen UI |
| Form submission | Button shows loading, success/error feedback | No feedback, user clicks again |
| Progress indication | Multi-step flows show step count | User doesn't know where they are |
| Active navigation | Current page/section highlighted | No indication of current location |
| Real-time updates | Optimistic UI or polling feedback | Stale data, no refresh indication |

### H2: Match Between System and Real World

Use language and concepts familiar to users, not internal jargon.

**What to find in code:**

```
Grep: "TODO.*wording|TODO.*copy|TODO.*label|TODO.*text" glob "*.tsx" -i
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Labels and terminology | Domain-appropriate language users expect | Technical jargon, internal codenames |
| Icons | Universally recognized or labeled | Ambiguous icons without text labels |
| Data format | Dates, currency, numbers in user's locale | ISO dates, raw numbers, wrong currency |
| Logical grouping | Information organized by user mental model | Organized by database schema or dev convenience |
| Metaphors | Real-world analogies aid understanding | Forced metaphors that confuse |

### H3: User Control and Freedom

Emergency exits, undo, cancel — users make mistakes.

**What to find in code:**

```
Grep: "onCancel|handleCancel|onClose|handleClose|onDismiss" glob "*.tsx" output_mode "count"
Grep: "undo|Undo|revert|Revert" glob "*.tsx" output_mode "count"
Grep: "confirm.*delete|confirm.*remove|AlertDialog|ConfirmDialog" glob "*.tsx" output_mode "count"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Modal escape | Close button + Escape key + backdrop click | No way to close, trapped |
| Form abandonment | Back button works, drafts saved | Data lost on navigation |
| Destructive actions | Confirmation dialog with clear consequences | One-click delete, no undo |
| Multi-step flows | Back/previous step without data loss | Can only go forward |
| Undo | Undo available after significant actions | Irreversible changes without warning |

### H4: Consistency and Standards

Same thing = same treatment. Follow platform conventions.

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Button hierarchy | Primary/secondary/ghost used consistently | Random button styles |
| Terminology | Same action = same label everywhere | "Save" / "Submit" / "Confirm" / "Apply" for same action |
| Layout patterns | Consistent page structure across views | Each page has different layout logic |
| Interaction patterns | Same gesture = same result | Click sometimes navigates, sometimes opens modal |
| Platform conventions | Follows web conventions (links underlined, form patterns) | Custom patterns that break expectations |

### H5: Error Prevention

Prevent problems before they happen.

**What to find in code:**

```
Grep: "disabled.*(!|=.*false)|isDisabled|isInvalid" glob "*.tsx" output_mode "count"
Grep: "required|min.*length|max.*length|pattern=" glob "*.tsx" output_mode "count"
Grep: "zod|yup|joi|superstruct|valibot" glob "package.json"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Input constraints | Date pickers (not free text), dropdowns for known options | Free text for structured data |
| Inline validation | Validation on blur/change, before submit | Only validates on submit |
| Destructive guards | Requires confirmation, type-to-confirm for critical actions | One-click irreversible actions |
| Defaults | Smart defaults reduce input needed | All fields blank, user guesses |
| Disabled states | Buttons disabled when form invalid, with explanation | Enabled but silently fails |

### H6: Recognition Over Recall

Make options visible. Don't force users to memorize.

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Navigation | All major sections visible in nav | Features hidden in deep menus |
| Search | Search available for large data sets | User must scroll/browse to find |
| Breadcrumbs | Breadcrumbs in hierarchical content | User loses context in deep pages |
| Recent items | Recently accessed items surfaced | Must remember and navigate from scratch |
| Contextual help | Tooltips, placeholders explain fields | Labels without context |

### H7: Flexibility and Efficiency of Use

Accelerators for experts, simplicity for novices.

**What to find in code:**

```
Grep: "keyboard|shortcut|hotkey|useHotkeys|Cmd\+|Ctrl\+" glob "*.tsx" output_mode "count"
Grep: "bulk|batch|selectAll|multiSelect" glob "*.tsx" output_mode "count"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Keyboard shortcuts | Power-user shortcuts available | Mouse-only interaction |
| Bulk actions | Multi-select, batch operations | One-at-a-time only |
| Filters and sort | Filter/sort on data-heavy pages | Must scan manually |
| Customization | Users can configure views/preferences | One-size-fits-all |
| Quick actions | Common tasks reachable in 1-2 clicks | Core tasks buried in menus |

### H8: Aesthetic and Minimalist Design

Every element competes for attention. Show only what's needed.

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Information density | Progressive disclosure, expand-on-demand | Everything visible at once |
| Visual hierarchy | Clear primary/secondary/tertiary content | Everything same visual weight |
| Whitespace | Breathing room between sections | Cramped, dense layout |
| CTAs | 1 primary action per view, clearly distinguished | Multiple competing CTAs |
| Content priority | Most important content first/prominent | Critical info buried below fold |

### H9: Help Users Recognize, Diagnose, and Recover from Errors

Error messages in plain language, with solutions.

**What to find in code:**

```
Grep: "error.*message|errorMessage|Error.*:.*'" glob "*.tsx" output_mode "count"
Grep: "try.*catch|\.catch\(|onError" glob "*.tsx" output_mode "count"
Grep: "fallback|ErrorBoundary|error\.tsx" glob "*.tsx" output_mode "files_with_matches"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Error language | Plain language, no codes | "Error 500", "ECONNREFUSED", raw stack trace |
| Specificity | Says exactly what went wrong | "Something went wrong" |
| Recovery action | Suggests what user can do next | Dead end, user must guess |
| Inline errors | Field-level errors near the input | Single error at top of form |
| Empty states | Helpful empty states with next action | Blank page, "No data" |

### H10: Help and Documentation

Easy to search, task-focused, concise.

**What to find in code:**

```
Grep: "Tooltip|tooltip|HelpCircle|InfoIcon|help.*text|aria-describedby" glob "*.tsx" output_mode "count"
Grep: "onboarding|tour|walkthrough|guide|Onboarding" glob "*.tsx" output_mode "count"
```

**What to verify in browser:**

| Signal | Pass | Fail |
|--------|------|------|
| Contextual help | Tooltips on complex fields/features | No explanation, user must guess |
| Onboarding | First-time user guidance available | Dropped into complex UI cold |
| Documentation | Help accessible from within the app | Must search external docs |
| Input guidance | Placeholders, hint text, format examples | Bare input fields |

---

## Step 3: Laws of UX Evaluation

Evaluate against key psychological principles from lawsofux.com.
For each law, check BOTH the current state AND recommend specific improvements.

| Law | Principle | What to Check | How to Fix Violations |
|-----|-----------|---------------|----------------------|
| **Jakob's Law** | Users expect your site to work like other sites | Navigation, form patterns, checkout flows follow platform conventions | Research 3 competitors via Firecrawl, adopt their common patterns |
| **Fitts's Law** | Larger, closer targets are faster to click | Primary CTAs large enough, not in corners. Touch targets ≥44px | Increase CTA size, move primary actions to natural thumb zones on mobile |
| **Hick's Law** | More choices = longer decisions | Menus ≤7 items, option lists not overwhelming, progressive disclosure | Group options, add search/filter, hide advanced options behind "More" |
| **Miller's Law** | Working memory holds ~7 items | Groups of >7 chunked. Nav items ≤7 per level | Chunk long lists, add category headers, paginate |
| **Cognitive Load** | Minimize mental effort | No unnecessary fields, no memory burden between steps | Remove optional fields from default view, show only what's needed now |
| **Aesthetic-Usability** | Beautiful = perceived as easier | First impression inspires confidence | Visual polish on landing + key flows. Personality, not just correctness |
| **Tesler's Law** | Complexity can't be eliminated, only moved | Complex tasks simplified for the user, not pushed to them | Smart defaults, auto-detection, progressive disclosure of complexity |
| **Doherty Threshold** | Productivity rises when response <400ms | Do interactions feel instant? | Optimistic UI, skeleton screens, prefetching, perceived performance tricks |
| **Postel's Law** | Be liberal in what you accept | Flexible input parsing (phone, date, case) | Accept multiple input formats, auto-format, don't reject valid variations |
| **Peak-End Rule** | People judge by peaks and endings | Success moment satisfying? Error moments handled gracefully? | Celebrate completions (confetti, clear confirmation). Soften errors |

---

## Step 4: Content and Microcopy Audit (Intuit Content Design Principles)

Evaluate all user-facing text against Intuit's content design standards.

### 4a. Voice and Tone

| Principle | Pass | Fail |
|-----------|------|------|
| Conversational | Reads like talking to a friend | Reads like a legal document or robot |
| Active voice | "We saved your changes" | "Your changes have been saved by the system" |
| Second person | "You" for the user, "We" for the product | Third person, passive constructions |
| Contractions | Natural contractions used ("don't", "we'll") | Stilted formal language ("do not", "we will") |

### 4b. Clarity and Precision

| Principle | Pass | Fail |
|-----------|------|------|
| Specific language | "We can't connect to Square right now" | "Something went wrong. Try again later" |
| Consistent terms | Same word for same concept throughout | "Save" / "Submit" / "Confirm" / "Apply" used interchangeably |
| Simple verbs | Present/past/future simple tense | Progressive, perfect, complex tenses |
| Short sentences | ≤20 words per sentence | Run-on sentences with multiple clauses |

### 4c. Microcopy Quality

**Check these locations in the browser:**

| Location | What to Evaluate |
|----------|-----------------|
| Button labels | Action-oriented, specific ("Save invoice" not just "Submit") |
| Error messages | Plain language, specific cause, recovery action |
| Empty states | Helpful, guides next action, not just "No data" |
| Confirmations | Clear consequence ("Delete this invoice? This can't be undone") |
| Tooltips | Concise, answers one question, not paragraphs |
| Placeholders | Format hints ("e.g., john@example.com"), not labels |
| Loading text | Informative when possible ("Loading your invoices...") |
| Success messages | Confirms what happened ("Invoice sent to John") |

### 4d. Internationalization Readiness

| Check | Pass | Fail |
|-------|------|------|
| Hardcoded strings | All strings in i18n files | Strings inline in components |
| Cultural idioms | Neutral metaphors | Culture-specific slang or humor |
| Text expansion | UI handles 40% longer translated text | Layout breaks with longer strings |
| RTL readiness | Logical properties (`margin-inline-start`) | Physical properties (`margin-left`) |

**Find violations:**

```
Grep: ">([\w\s]{3,})<" glob "*.tsx" — hardcoded visible text (potential i18n miss)
```

---

## Step 5: Emotional Design and Human-Centric Evaluation

This step evaluates the FEELING of using the product — the layer most audits miss.

### 5a. First Impression Test (5-Second Test)

Navigate to the landing/home page. In the first 5 seconds of the screenshot:

| Question | Evidence |
|----------|----------|
| Can you tell what this product does? | [yes/no — what's communicated] |
| Do you trust it? | [visual polish, credibility signals, brand presence] |
| Do you know what to do first? | [clear CTA, obvious starting point] |
| Does it feel like a real product or a template? | [personality, craft, vs generic bootstrap] |

### 5b. Emotional Friction Map

Walk through each core flow and note where emotions shift:

| Moment | Expected Emotion | Actual Emotion | Cause |
|--------|-----------------|----------------|-------|
| Landing | Curiosity, hope | [observed] | [what the UI communicates] |
| First input | Confidence | [observed] | [guidance quality, field clarity] |
| Waiting (loading) | Patience | [observed] | [feedback quality during wait] |
| Error | Understanding | [observed] | [error message tone, recovery path] |
| Success | Satisfaction | [observed] | [celebration quality, next action clarity] |
| Return visit | Recognition | [observed] | [remembered state, personalization] |

### 5c. Trust Signal Audit

| Signal | Present? | Quality |
|--------|----------|---------|
| Consistent branding | [y/n] | [logo, colors, voice consistent across pages] |
| Professional microcopy | [y/n] | [no typos, no placeholder text, no dev jargon] |
| Data safety indicators | [y/n] | [HTTPS badge, privacy note near sensitive inputs] |
| Social proof | [y/n] | [testimonials, user count, recognizable clients] |
| Error grace | [y/n] | [errors don't blame the user, offer help] |
| Completion feedback | [y/n] | [user knows their action succeeded and what's next] |

### 5d. Delight and Surprise Moments

Products that feel human have moments of unexpected care:

| Pattern | Example | Present? |
|---------|---------|----------|
| Contextual encouragement | "Almost there!" on step 3/4 | [y/n] |
| Smart defaults | Pre-filling from context (timezone, currency, name) | [y/n] |
| Celebrating milestones | First invoice sent, 100th customer added | [y/n] |
| Recovering gracefully | "We saved your draft" after accidental navigation | [y/n] |
| Personality in empty states | Friendly illustration + helpful copy, not just "No data" | [y/n] |
| Predictive help | Suggesting next action based on user behavior | [y/n] |

---

## Step 6: User Flow Analysis

### 6a. Core Flow Walkthrough

For each core task identified in Step 0, walk through in the browser:

```
1. Start point → Where does the user begin?
2. Steps → How many clicks/interactions to complete?
3. Friction points → Where do users get stuck or confused?
4. Success → How does the user know they succeeded?
5. Error recovery → What happens when something goes wrong?
```

### 6b. Flow Quality Criteria

| Criteria | Excellent | Poor |
|----------|-----------|------|
| Task completion | 1-3 steps for common tasks | 5+ steps, multiple page loads |
| Orientation | User always knows where they are and what's next | Lost in multi-step flow |
| Data persistence | Form data survives navigation, refresh | Data lost on back button or refresh |
| Error recovery | Inline errors, field-level, preserves input | Page-level error, form cleared |
| Success confirmation | Clear confirmation with next suggested action | No feedback, dumped to homepage |

### 6c. Edge Case Flows

Test these scenarios in browser:

- **Empty state:** First-time user with no data
- **Error state:** Network failure, validation failure, 404
- **Loading state:** Slow network, large data set
- **Boundary values:** Very long text, special characters, max items
- **Interrupted flow:** Navigate away mid-form, back button, refresh

---

## Step 7: Accessibility UX (Beyond WCAG Compliance)

This step evaluates the *experience* of accessibility, not just technical compliance.

| Aspect | What to Evaluate |
|--------|-----------------|
| Keyboard flow | Tab order follows visual flow, logical focus movement |
| Screen reader experience | Announcements make sense without visual context |
| Focus management | Focus moves to new content (modals, toasts), returns after dismissal |
| Skip navigation | Skip-to-content link for keyboard users |
| Error announcement | Errors announced to screen readers via `aria-live` or focus |
| Touch targets | ≥44px on mobile, sufficient spacing between targets |
| Motion sensitivity | Animations respect `prefers-reduced-motion` |

**Verify via browser:**

```
browser_snapshot → check tab order
browser_click → tab through interactive elements
browser_snapshot → verify focus indicator visible
```

---

## Step 8: HEART Metrics Assessment

Rate each dimension qualitatively based on audit findings.

| Dimension | What It Measures | Audit Proxy |
|-----------|-----------------|-------------|
| **Happiness** | User satisfaction, trust, confidence | Tone of microcopy, error handling grace, visual polish |
| **Engagement** | Depth of interaction, feature discovery | Progressive disclosure, clear navigation, feature visibility |
| **Adoption** | New user onboarding success | Onboarding flow quality, empty states, first-run guidance |
| **Retention** | Reasons users would return | Task completion satisfaction, notification value, habit loops |
| **Task Success** | Core task completion rate and efficiency | Steps to complete, error recovery, flow friction |

---

## Output Template

```markdown
## UX Audit Report

**Date:** [date]
**Product:** [name]
**Type:** [SaaS / e-commerce / dashboard / etc.]
**Pages Audited:** [count]
**Core Flows Tested:** [count]
**Issues Found:** [count]

---

### Nielsen's 10 Heuristics Assessment

| # | Heuristic | Score (1-5) | Key Finding |
|---|-----------|-------------|-------------|
| 1 | System status visibility | [1-5] | [finding] |
| 2 | Real world match | [1-5] | [finding] |
| 3 | User control and freedom | [1-5] | [finding] |
| 4 | Consistency and standards | [1-5] | [finding] |
| 5 | Error prevention | [1-5] | [finding] |
| 6 | Recognition over recall | [1-5] | [finding] |
| 7 | Flexibility and efficiency | [1-5] | [finding] |
| 8 | Aesthetic and minimal design | [1-5] | [finding] |
| 9 | Error recovery | [1-5] | [finding] |
| 10 | Help and documentation | [1-5] | [finding] |

**Overall Heuristic Score:** [average]/5

---

### Laws of UX Findings

| Law | Status | Evidence |
|-----|--------|----------|
| Jakob's Law | [pass/warn/fail] | [finding] |
| Fitts's Law | [pass/warn/fail] | [finding] |
| Hick's Law | [pass/warn/fail] | [finding] |
| Miller's Law | [pass/warn/fail] | [finding] |
| Cognitive Load | [pass/warn/fail] | [finding] |
| Aesthetic-Usability | [pass/warn/fail] | [finding] |
| Peak-End Rule | [pass/warn/fail] | [finding] |

---

### Content & Microcopy Quality (Intuit Principles)

| Aspect | Score (1-5) | Issues |
|--------|-------------|--------|
| Voice consistency | [1-5] | [details] |
| Clarity and precision | [1-5] | [details] |
| Error message quality | [1-5] | [details] |
| Empty state helpfulness | [1-5] | [details] |
| Button/CTA clarity | [1-5] | [details] |
| i18n readiness | [1-5] | [details] |

---

### Emotional Design Assessment

| Aspect | Score (1-5) | Evidence |
|--------|-------------|----------|
| First impression (5-sec test) | [1-5] | [clarity, trust, personality] |
| Emotional friction points | [count] | [where anxiety/confusion spikes] |
| Trust signals | [1-5] | [branding, microcopy quality, data safety] |
| Delight moments | [count] | [smart defaults, celebrations, recovery grace] |
| Human feel vs template feel | [1-5] | [specific tells] |

---

### User Flow Analysis

| Flow | Steps | Friction Points | Error Recovery | Score |
|------|-------|-----------------|----------------|-------|
| [Core task 1] | [N] | [description] | [pass/fail] | [1-5] |
| [Core task 2] | [N] | [description] | [pass/fail] | [1-5] |
| [Core task 3] | [N] | [description] | [pass/fail] | [1-5] |

---

### Accessibility UX

| Aspect | Status | Issues |
|--------|--------|--------|
| Keyboard navigation | [pass/warn/fail] | [details] |
| Focus management | [pass/warn/fail] | [details] |
| Screen reader experience | [pass/warn/fail] | [details] |
| Touch targets | [pass/warn/fail] | [details] |
| Motion sensitivity | [pass/warn/fail] | [details] |

---

### HEART Assessment

| Dimension | Rating (1-5) | Evidence |
|-----------|-------------|----------|
| Happiness | [1-5] | [what drives or harms user satisfaction] |
| Engagement | [1-5] | [feature discovery, interaction depth] |
| Adoption | [1-5] | [onboarding quality, first-run experience] |
| Retention | [1-5] | [reasons to return or churn signals] |
| Task Success | [1-5] | [completion efficiency, error recovery] |

---

### Critical Issues (Must Fix)

#### 1. [Flow/Page] — [Issue]
- **Heuristic violated:** [H# — name]
- **Problem:** [description]
- **User impact:** [what the user experiences]
- **Fix:** [specific recommendation]

---

### Research Findings Applied
- [NN/g pattern]: [how it applies to this product]
- [Intuit principle]: [gap identified]
- [Law of UX]: [violation found]

---

### Next Steps (Priority Order)

1. [ ] Fix critical usability blockers: [list]
2. [ ] Improve error messages and empty states: [list]
3. [ ] Enhance onboarding flow: [details]
4. [ ] Add keyboard shortcuts / accelerators: [list]
5. [ ] Content audit — rewrite microcopy: [pages]
```
