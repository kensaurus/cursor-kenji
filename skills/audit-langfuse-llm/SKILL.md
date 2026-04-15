---
name: audit-langfuse-llm
description: >
  PDCA quality audit for LLM/AI features via Langfuse CLI, Sentry MCP, Supabase MCP,
  Playwright browser MCP, and Firecrawl. Auto-detects Langfuse integration, researches
  current LLM observability best practices, audits traces/prompts/costs/evals via
  langfuse-cli, performs live verification by triggering AI features and confirming trace
  pipeline integrity, checks grounding/hallucination, and produces a structured report.
  Works with any project — not hardcoded to any specific app.
  Use when asked to: "audit LLM", "check Langfuse", "audit prompts", "check AI quality",
  "run LLM PDCA", "audit AI costs", "check traces", "audit eval scores",
  "verify AI pipeline", "check hallucination", "audit LLM observability",
  or "run Langfuse audit".
---

# Langfuse LLM Quality Audit

Automated PDCA audit for LLM/AI features: trace completeness, prompt quality, cost efficiency,
eval health, grounding accuracy, and end-to-end pipeline verification.
Works with **any project** — auto-detects Langfuse setup from the codebase.

## Critical Rules

> **NEVER skip the auto-detect phase.** Every project configures Langfuse differently.

> **Research before judging.** Use Firecrawl to find current LLM best practices so recommendations are evidence-based, not opinion.

> **Verify live, not just statically.** Trigger AI features via Playwright and confirm traces land in Langfuse — static code analysis alone misses runtime issues.

> **Use concrete numbers.** "Costs seem high" is not an audit finding. "GPT-4o used for intent classification at $0.03/call when GPT-4o-mini at $0.001/call achieves equivalent accuracy" is.

> **Always use the `browser-anti-stall` protocol** when using Playwright browser MCP tools.

---

## Phase 0: Auto-Detect Langfuse Integration

### 0a. Find Langfuse Configuration

Search for environment variables and config files (in order):

1. `.env`, `.env.local`, `.env.production` — look for `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_BASE_URL`, `LANGFUSE_HOST`
2. `langfuse.config.ts`, `langfuse.config.js` — dedicated config files
3. `instrumentation.ts` / `instrumentation.js` — Next.js instrumentation with Langfuse
4. Supabase Edge Functions — `Glob("**/supabase/functions/**/index.ts")` and search for `Langfuse` imports

```
Grep(pattern: "LANGFUSE_PUBLIC_KEY|LANGFUSE_SECRET_KEY|LANGFUSE_BASE_URL|LANGFUSE_HOST", glob: ".env*")
Grep(pattern: "langfuse|Langfuse|@langfuse", glob: "*.{ts,js,tsx,jsx,py,rb,go}")
```

Record:
- `LANGFUSE_HOST` (cloud or self-hosted URL)
- `LANGFUSE_PUBLIC_KEY` (identifies the project)
- Which source files import/use Langfuse
- Whether the CLI env vars are available (the Shell commands below require `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` in the environment)

### 0b. Detect LLM Framework and Provider

```
Grep(pattern: "openai|OpenAI|anthropic|Anthropic|@google/generative-ai|gemini|cohere|mistral|groq|together|replicate", glob: "*.{ts,js,py}")
Grep(pattern: "langchain|LangChain|@langchain|vercel/ai|ai/core|createOpenAI|createAnthropic", glob: "*.{ts,js,py}")
```

Record:
- LLM providers (OpenAI, Anthropic, Google, etc.)
- LLM frameworks (LangChain, Vercel AI SDK, direct API calls, etc.)
- Model names used (grep for model name strings like `gpt-4o`, `claude-3`, `gemini-pro`)

### 0c. Map AI Features

```
SemanticSearch(query: "Where are LLM/AI features called in the codebase?", target_directories: [])
```

Build a feature map:
| Feature | File(s) | Provider | Model | Traced? |
|---------|---------|----------|-------|---------|
| _e.g. Chat_ | `app/api/chat/route.ts` | OpenAI | gpt-4o | Yes |

### 0d. Detect Eval and Prompt Management Setup

```
Grep(pattern: "createScore|langfuse.score|annotation|eval|judge|dataset", glob: "*.{ts,js,py}")
Grep(pattern: "getPrompt|langfuse.prompt|fetchPrompt|compilePrompt", glob: "*.{ts,js,py}")
```

Record:
- Prompt management approach: Langfuse managed prompts vs hardcoded vs config file
- Eval setup: annotation queues, programmatic scoring, judge LLM, dataset runs
- Whether prompts are versioned and labeled

---

## Phase 1: Research LLM Best Practices

Before auditing, establish the current state of the art so findings are grounded in evidence.

### 1a. Firecrawl Research

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "LLM observability best practices production monitoring [current year]",
  "limit": 5
})
```

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "prompt engineering evaluation scoring hallucination detection [current year]",
  "limit": 5
})
```

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "LLM cost optimization token usage model selection production [current year]",
  "limit": 5
})
```

Scrape the top 2-3 most relevant results for detailed guidance:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<BEST_RESULT_URL>",
  "formats": ["markdown"]
})
```

### 1b. Langfuse Documentation

Research Langfuse-specific features relevant to the detected setup:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "site:langfuse.com docs tracing prompts evaluation scores",
  "limit": 5
})
```

If the project uses a specific LLM framework (LangChain, Vercel AI SDK, etc.), also fetch its Langfuse integration docs.

### 1c. Context7 for LLM Framework Docs

If detected in Phase 0b, fetch the framework-specific documentation:

```json
CallMcpTool(server: "context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "<DETECTED_FRAMEWORK e.g. langchain or vercel-ai>"
})
```

Then query for integration patterns:

```json
CallMcpTool(server: "context7", toolName: "query-docs", arguments: {
  "libraryId": "<RESOLVED_ID>",
  "query": "Langfuse integration tracing observability"
})
```

---

## Phase 2: Audit via Langfuse CLI

All commands below use the Langfuse CLI via the Shell tool. Ensure the environment has
`LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` set (from `.env` or exported).

### 2a. Trace Completeness

```bash
npx langfuse-cli api traces list --limit 50
```

For each AI feature identified in Phase 0c, verify:
- [ ] Trace exists with a matching name/metadata
- [ ] Trace has spans/generations (not just a top-level trace with no children)
- [ ] Trace includes input/output (not empty)
- [ ] Trace has proper metadata (userId, sessionId, tags)
- [ ] Latency is recorded

**Red flags:**
- AI feature exists in code but produces no traces → **missing instrumentation**
- Traces exist but have no generations → **incomplete tracing** (wrapper created but LLM call not captured)
- Traces with empty output → **output not being captured** (fire-and-forget pattern)

### 2b. Prompt Quality Audit

```bash
npx langfuse-cli api prompts list
```

For each prompt:

```bash
npx langfuse-cli api prompts get --name "<PROMPT_NAME>"
```

Evaluate:
- [ ] **Versioning**: Are prompts versioned (v1, v2, v3+) or stuck at v1?
- [ ] **Labels**: Is there a `production` label? Are there `staging`/`experiment` labels for A/B testing?
- [ ] **System message quality**: Clear role definition, constraints, output format instructions?
- [ ] **Few-shot examples**: Does the prompt include examples for complex tasks?
- [ ] **Guardrails**: Does the prompt include instructions to refuse off-topic/harmful requests?
- [ ] **Variables**: Are dynamic parts properly templated with `{{variables}}` not string concatenation?
- [ ] **Freshness**: When was the prompt last updated? Stale prompts may not leverage newer model capabilities.

If prompts are hardcoded in source code instead of managed via Langfuse:

```
Grep(pattern: "You are|system.*message|systemPrompt|SYSTEM_PROMPT", glob: "*.{ts,js,py}")
```

Flag hardcoded prompts as a finding — they should be migrated to Langfuse for versioning and A/B testing.

### 2c. Model and Cost Efficiency

From trace data, analyze:

```bash
npx langfuse-cli api traces list --limit 50
```

For each trace, check the generation details (model, usage tokens, latency, cost).

Build a cost table:
| Feature | Model | Avg Input Tokens | Avg Output Tokens | Avg Latency | Est. Cost/Call |
|---------|-------|------------------|-------------------|-------------|----------------|

**Red flags:**
- Expensive model (GPT-4o, Claude 3.5 Sonnet) used for simple classification/extraction → **recommend cheaper model**
- High input token counts → **check for unnecessary context stuffing**
- Output tokens much larger than needed → **add max_tokens or response format constraints**
- High latency on user-facing features → **consider streaming, caching, or smaller model**
- Same content sent repeatedly → **implement semantic caching**

### 2d. Eval Score Health

```bash
npx langfuse-cli api scores list --limit 50
```

Evaluate:
- [ ] **Score existence**: Are evals running at all?
- [ ] **Score types**: What's being measured (relevance, faithfulness, toxicity, custom)?
- [ ] **Score distribution**: Are scores clustered (all 1.0 = useless eval) or distributed?
- [ ] **Annotation queues**: Are humans reviewing AI outputs?
- [ ] **Judge LLM**: If using LLM-as-judge, which model? Is the judge prompt well-designed?

**Red flags:**
- No scores at all → **no quality feedback loop**
- Only manual scores, no automated → **quality is not continuously monitored**
- All scores are identical → **eval criteria too loose or rubric too vague**
- Scores declining over time → **model degradation or prompt drift**

### 2e. Session and User Attribution

```bash
npx langfuse-cli api sessions list --limit 20
```

Verify:
- [ ] Sessions group related interactions (multi-turn conversations have one session ID)
- [ ] User IDs are attributed (not all anonymous)
- [ ] Session metadata is useful (page, feature, user segment)

### 2f. Dataset Health

```bash
npx langfuse-cli api datasets list
```

Evaluate:
- [ ] **Datasets exist**: Are there regression test datasets?
- [ ] **Dataset freshness**: When were items last added?
- [ ] **Coverage**: Do datasets cover all AI features or just one?
- [ ] **Expected outputs**: Do dataset items have expected outputs for automated comparison?

---

## Phase 3: Live Verification

### 3a. Trigger AI Features via Playwright

For each AI feature identified in Phase 0c, use browser MCP tools to trigger it live.

**Important**: Apply the `browser-anti-stall` protocol — set 15-second timeouts, skip `browser_wait_for` on navigation, use `browser_snapshot` to detect ready state.

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<APP_URL>"
})
```

Navigate to the feature, interact with it (fill form, click button, send message), and capture:
- The AI-generated response (via `browser_snapshot`)
- Console messages (via `browser_console_messages`) — look for errors
- Network requests (via `browser_network_requests`) — look for failed API calls

### 3b. Verify Trace Pipeline

After triggering each feature, wait 5-10 seconds, then verify the trace landed:

```bash
npx langfuse-cli api traces list --limit 5
```

Check:
- [ ] New trace appeared with correct name
- [ ] Trace has generations with model and token data
- [ ] Trace latency matches observed UX latency
- [ ] Input/output captured correctly

If a trace is missing after triggering a feature → **pipeline break** (critical finding).

### 3c. Cross-Check with Sentry

```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG_SLUG>",
  "projectSlug": "<PROJECT_SLUG>",
  "query": "is:unresolved ai OR llm OR openai OR anthropic OR langfuse OR completion OR embedding"
})
```

Check for:
- LLM timeout errors
- Rate limiting (429) errors
- Token limit exceeded errors
- Langfuse SDK errors (failed to send trace)
- JSON parse errors on LLM responses

### 3d. Cross-Check with Supabase (if AI results stored in DB)

If the project stores AI outputs in the database:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "list_tables", arguments: {
  "project_id": "<PROJECT_ID>"
})
```

Find tables that store AI outputs and verify data landed:

```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "execute_sql", arguments: {
  "project_id": "<PROJECT_ID>",
  "query": "SELECT id, created_at, <ai_output_column> FROM <table> ORDER BY created_at DESC LIMIT 5"
})
```

### 3e. Grounding / Hallucination Check

For features where the AI should reference source data (RAG, summarization, data extraction):

1. Get the source data from the database (Supabase `execute_sql`)
2. Trigger the AI feature via Playwright
3. Compare the AI output against the source data

**Red flags:**
- AI mentions facts not in the source data → **hallucination**
- AI omits critical facts from the source data → **incomplete extraction**
- AI contradicts the source data → **grounding failure**
- AI generates plausible but wrong numbers → **numerical hallucination**

---

## Phase 4: Report

Generate a structured report with the following sections.

```
═══════════════════════════════════════════════════════
   LANGFUSE LLM QUALITY AUDIT REPORT
   Project: <PROJECT_NAME>
   Date: <DATE>
   Langfuse Host: <HOST_URL>
═══════════════════════════════════════════════════════

## 1. TRACE COVERAGE

| Feature | Traced? | Generations? | Input/Output? | Metadata? | Status |
|---------|---------|-------------|---------------|-----------|--------|
| ...     | ...     | ...         | ...           | ...       | ✅/❌  |

Coverage: X/Y features traced (Z%)
Missing instrumentation: [list features with no traces]

## 2. PROMPT QUALITY

| Prompt | Version | Label | System Msg | Few-Shot | Guardrails | Variables | Score |
|--------|---------|-------|------------|----------|------------|-----------|-------|
| ...    | ...     | ...   | ...        | ...      | ...        | ...       | A-F   |

Hardcoded prompts found: [list files with inline prompts]
Recommendations: [specific improvements per prompt]

## 3. COST EFFICIENCY

| Feature | Model | Avg Tokens (in/out) | Avg Latency | Est. Cost/Call | Recommendation |
|---------|-------|---------------------|-------------|----------------|----------------|
| ...     | ...   | ...                 | ...         | ...            | ...            |

Monthly estimate: $X (at current usage rate)
Savings opportunity: $Y (by implementing recommendations)

## 4. EVAL HEALTH

| Metric           | Status    | Details                          |
|------------------|-----------|----------------------------------|
| Automated evals  | ✅/❌    | [count and types]                |
| Manual reviews   | ✅/❌    | [annotation queue status]        |
| Score distribution| ✅/❌   | [healthy spread vs clustered]    |
| Datasets         | ✅/❌    | [count, freshness, coverage]     |
| Regression tests | ✅/❌    | [dataset run frequency]          |

## 5. PIPELINE INTEGRITY

| Step                    | Status | Evidence                            |
|-------------------------|--------|-------------------------------------|
| FE triggers AI feature  | ✅/❌ | [Playwright observation]            |
| API receives request    | ✅/❌ | [network request captured]          |
| LLM call executes       | ✅/❌ | [trace generation exists]           |
| Trace lands in Langfuse | ✅/❌ | [CLI verification]                  |
| Result stored in DB     | ✅/❌ | [Supabase query result]             |
| Result displayed in FE  | ✅/❌ | [Playwright snapshot]               |
| Eval score recorded     | ✅/❌ | [score attached to trace]           |

## 6. GROUNDING & HALLUCINATION

| Feature | Source Data | AI Output Match | Hallucinations | Score |
|---------|-------------|-----------------|----------------|-------|
| ...     | ...         | ...             | ...            | A-F   |

## 7. SENTRY LLM ERRORS

| Issue | Error Type | Events | Impact | Fix Needed |
|-------|------------|--------|--------|------------|
| ...   | ...        | ...    | ...    | ...        |

## 8. CRITICAL FINDINGS (Action Required)

P0 — Must fix immediately:
1. [finding with evidence]

P1 — Should fix this sprint:
1. [finding with evidence]

P2 — Improvement opportunity:
1. [finding with evidence]

## 9. RECOMMENDATIONS

| # | Category | Current State | Recommended State | Effort | Impact |
|---|----------|---------------|-------------------|--------|--------|
| 1 | ...      | ...           | ...               | S/M/L  | S/M/L  |

## 10. PDCA IMPROVEMENT RESULTS

| Prompt | Baseline Score | Iter 1 Score | Iter 2 Score | Iter 3 Score | Final Score | Action Taken |
|--------|---------------|-------------|-------------|-------------|-------------|--------------|
| ...    | ...           | ...         | ...         | ...         | ...         | Promoted / Rolled back / Needs manual |

### Improvement Details

**[Prompt Name] — Iteration 1:**
- Change: [what was changed and why]
- Result: Score [X] -> [Y] ([+/-Z%]), Latency [A]ms -> [B]ms, Cost $[C] -> $[D]
- Evidence: Langfuse trace ID [ID], Playwright screenshot [ref]

**[Prompt Name] — Iteration 2:**
- Change: [next improvement attempt]
- Result: ...

═══════════════════════════════════════════════════════
```

---

## Phase 5: Prompt Improvement Cycle (PDCA)

After the audit report identifies prompt weaknesses, run an iterative improvement cycle for each
flagged prompt. This is the **Do-Check-Act** loop that turns audit findings into measurable improvements.

> **Max 3 iterations per prompt.** If no improvement after 3 attempts, log as "needs manual prompt engineering" and move on.

> **Always capture baseline BEFORE making changes.** Without a baseline, you cannot measure improvement.

> **Never promote a prompt version that scores worse than baseline.** The goal is monotonic improvement.

### 5a. Capture Baseline

For each prompt flagged in Phase 2b (Prompt Quality Audit), record the current state:

```bash
npx langfuse-cli api prompts get --name "<PROMPT_NAME>"
```

Record:
- **Current version number** and **label** (e.g., v3, label: `production`)
- **Current eval scores** from Phase 2d (average score, score distribution)
- **Current cost metrics** from Phase 2c (model, avg tokens, avg latency, est. cost/call)
- **Specific weaknesses** identified in the audit (missing guardrails, no few-shot, vague instructions, etc.)

Build a baseline table:

| Prompt | Version | Avg Score | Avg Latency | Avg Cost | Weaknesses |
|--------|---------|-----------|-------------|----------|------------|
| ...    | ...     | ...       | ...         | ...      | ...        |

### 5b. DO: Improve the Prompt

For each flagged prompt, create an improved version based on the audit findings.

**Step 1: Research the specific improvement needed**

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<WEAKNESS_TYPE> prompt engineering best practices [current year]",
  "limit": 5
})
```

Example queries by weakness type:
- Missing guardrails: `"LLM safety guardrails system prompt best practices [current year]"`
- No few-shot: `"few-shot prompting examples for <TASK_TYPE> [current year]"`
- Vague instructions: `"structured output prompt engineering chain-of-thought [current year]"`
- Wrong model: `"<TASK_TYPE> model selection GPT-4o-mini vs GPT-4o vs Claude [current year]"`

Scrape the top 1-2 results for concrete patterns:

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_scrape", arguments: {
  "url": "<BEST_RESULT_URL>",
  "formats": ["markdown"],
  "onlyMainContent": true
})
```

**Step 2: Draft the improved prompt**

Apply the researched improvements. Common enhancement patterns:
- **Add role definition**: "You are a [specific role] with expertise in [domain]."
- **Add output format**: "Respond in JSON with the following schema: {...}"
- **Add guardrails**: "If the user asks about [off-topic], respond with [refusal]."
- **Add few-shot examples**: Include 2-3 input/output pairs for complex tasks
- **Add chain-of-thought**: "Think step by step before answering."
- **Constrain output length**: "Keep your response under [N] words/tokens."
- **Add grounding instructions**: "Only use information from the provided context. If unsure, say so."

**Step 3: Create the new version**

If prompts are managed in Langfuse:

```bash
npx langfuse-cli api prompts create --name "<PROMPT_NAME>" --prompt "<IMPROVED_PROMPT_TEXT>" --labels experiment
```

This creates a new version with the `experiment` label (not `production` — we test first).

If prompts are hardcoded in source code:
1. Read the file containing the prompt
2. Edit the prompt text using StrReplace
3. Record the file path and the change for potential rollback

### 5c. CHECK: Trigger and Verify via Playwright

**Important**: Apply the `browser-anti-stall` protocol for all browser interactions.

**Step 1: Trigger the AI feature**

```json
CallMcpTool(server: "user-playwright", toolName: "browser_navigate", arguments: {
  "url": "<APP_URL>"
})
```

Navigate to the feature that uses this prompt. Interact with it (fill form, click button, send message).

Capture:
- AI-generated response via `browser_snapshot`
- Console errors via `browser_console_messages`
- Network requests via `browser_network_requests`
- Screenshot via `browser_take_screenshot` (visual evidence for the report)

**Step 2: Repeat N=3 times minimum**

Trigger the feature at least 3 times with different inputs to get a representative sample.
Vary the inputs to test edge cases relevant to the improvement (e.g., if you added guardrails,
test with an off-topic input).

**Step 3: Verify traces landed in Langfuse**

Wait 5-10 seconds after each trigger, then:

```bash
npx langfuse-cli api traces list --limit 10
```

For each new trace, verify:
- [ ] Trace uses the new prompt version (check metadata or generation details)
- [ ] Input/output captured correctly
- [ ] Generation includes model, token usage, latency

### 5d. CHECK: Score Comparison

**Option A: If Langfuse datasets exist** (preferred — most rigorous)

Run the dataset experiment with the new prompt version vs the old:

```bash
npx langfuse-cli api datasets list
```

If a relevant dataset exists, use Langfuse's Experiment feature (via UI or SDK) to run both
prompt versions against the same dataset and compare scores side-by-side.

**Option B: If LLM-as-a-Judge evaluators are configured**

Check if automated eval scores have been generated for the new traces:

```bash
npx langfuse-cli api scores list --limit 20
```

Compare the scores attached to new traces (experiment version) vs old traces (production version).

**Option C: Live trace comparison (minimum viable)**

From the N=3+ triggers in Step 5c, compare the new traces against baseline:

| Metric | Baseline (avg) | New Version (avg) | Delta | Verdict |
|--------|---------------|-------------------|-------|---------|
| Eval score | ... | ... | +/-% | Better / Worse / Same |
| Latency | ...ms | ...ms | +/-% | Better / Worse / Same |
| Input tokens | ... | ... | +/-% | Better / Worse / Same |
| Output tokens | ... | ... | +/-% | Better / Worse / Same |
| Est. cost/call | $... | $... | +/-% | Better / Worse / Same |
| Grounding accuracy | ... | ... | +/-% | Better / Worse / Same |

### 5e. ACT: Promote or Rollback

Based on the score comparison:

**Score improved (any eval metric improved, no metric degraded):**
- If Langfuse-managed: promote the new version to `production` label
- If hardcoded: keep the source code change, commit it
- Log the improvement in the report

**Score unchanged (no significant difference):**
- Keep the new version as `staging` for further observation
- Document why the improvement didn't move the needle
- Try a different improvement strategy in the next iteration

**Score degraded (any eval metric worsened):**
- If Langfuse-managed: do NOT change labels — the `production` label stays on the old version
- If hardcoded: revert the source code change using StrReplace
- Document what went wrong and why

**Repeat the cycle** from Step 5b with a different strategy if the score target has not been met
and iterations remain (max 3).

### 5f. Iteration Log

Track all iterations in a structured log:

```
PDCA ITERATION LOG — [Prompt Name]

Baseline: v[N], score [X], latency [Y]ms, cost $[Z]/call

--- Iteration 1 ---
Strategy: [what was changed and why]
Changes: [specific edits to the prompt]
Result: score [X1], latency [Y1]ms, cost $[Z1]/call
Delta: score [+/-A%], latency [+/-B%], cost [+/-C%]
Verdict: [PROMOTE / CONTINUE / ROLLBACK]

--- Iteration 2 ---
Strategy: [different approach based on Iteration 1 results]
...

--- Iteration 3 (final) ---
...

FINAL OUTCOME: [Promoted vN+K to production / No improvement — needs manual engineering]
```
