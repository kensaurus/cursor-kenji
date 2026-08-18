---
name: audit-llm-security
description: >
  Read-only OWASP LLM Top 10 audit of app-facing AI features: prompt injection,
  data leak, supply chain, poisoning, unsafe output, excessive agency, system-prompt
  leak, RAG/embedding risks, misinformation, unbounded consumption. Use when "audit
  LLM security", "prompt injection", "jailbreak my chatbot", "is my AI safe".
license: MIT
---

# audit-llm-security — OWASP LLM Top 10

Read-only. You verify that **user-facing** LLM features cannot be hijacked, leak
secrets, or spend without a bound. **Quality/cost traces belong to
`audit-langfuse-llm`; coding-agent policy belongs to `enhance-agent-guardrails`.**

**The failure mode is silent:** a chatbot that looks helpful in demo will follow a
pasted instruction, dump the system prompt, or call a privileged tool.

> **Present findings. Do not patch until the user approves.** Never paste secret
> values, full system prompts, or live API keys into the report.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **audit-llm-security** (this) | App-facing LLM attack surface (OWASP LLM Top 10) |
| `audit-langfuse-llm` | Trace quality, evals, hallucination, cost observability |
| `plan-llm-cost-guardrails` | Token budgets, circuit breakers, quota abuse |
| `plan-input-validation` | Non-LLM trust boundaries (forms, XSS, webhooks) |
| `enhance-agent-guardrails` | Repo guardrails for the *coding* agent, not the product LLM |
| `test-red-team` | Full-app adversarial sweep; hand LLM-specific defects here |

Do **not** fire for "audit my prompts / Langfuse / AI quality" → `audit-langfuse-llm`.
Do **not** fire for "cap my AI bill" → `plan-llm-cost-guardrails`.

---

## Phase 0 — Detect the stack (do not assume)

Record:

- **Surfaces:** chat, RAG, agents/tools, image/voice, batch jobs, MCP-to-model bridges
- **Providers:** OpenAI / Anthropic / Gemini / local / gateway
- **Orchestration:** LangChain / Vercel AI SDK / custom / edge function
- **Memory / RAG:** vector store, embeddings, document ingest path
- **Tools:** which functions the model may call, and with whose credentials
- **Observability:** Langfuse / Sentry — do not duplicate their quality audit

---

## Phase 1 — OWASP LLM Top 10 (2025)

For each applicable class, cite `file:line` and severity (Critical if a
demonstrated leak or unscoped tool).

| ID | Class | What to prove |
|---|---|---|
| LLM01 | Prompt injection | User/retrieved content cannot override system policy or tool policy |
| LLM02 | Sensitive disclosure | Secrets, PII, other users' data cannot be elicited from context or tools |
| LLM03 | Supply chain | Model/SDK/plugin pins; no hallucinated packages; untrusted tool servers |
| LLM04 | Poisoning | Ingest/fine-tune/RAG corpus is trusted or sanitized; write-back is gated |
| LLM05 | Improper output | Model output is never `eval`'d, never raw HTML/SQL/shell without encode |
| LLM06 | Excessive agency | Tools are least-privilege; irreversible actions need a human confirm |
| LLM07 | System-prompt leak | Prompt/policy text is not trivially extractable; treat it as sensitive |
| LLM08 | Vector / embedding | Tenant isolation on vectors; no cross-user retrieval; poisoned docs |
| LLM09 | Misinformation | Ungrounded answers labeled; high-stakes domains need citation/refusal |
| LLM10 | Unbounded consumption | Per-user/request caps, max tokens, timeouts — else hand to `plan-llm-cost-guardrails` |

**Injection probes (describe, do not dump a working jailbreak kit):**
untrusted content in the same window as instructions (web pages, PDFs, emails,
other users' messages). Direct vs indirect. Tool-argument injection.

**Agency:** list every tool. Who can invoke it? What blast radius if the model
is hijacked? Payment, email-send, DB write, and secret-read tools are Critical
if unsandboxed.

---

## Phase 2 — Live check (optional, scoped)

If the app runs and the user wants a live pass:

1. Read `protocol-browser-anti-stall`. Use `$PW -s=llm-sec`.
2. Exercise the happy path once.
3. Try *benign* policy probes ("ignore previous instructions and …") and
   document whether the model complies. Stop at evidence; do not escalate
   into a weaponized jailbreak chain.
4. Confirm traces land without raw secrets (`audit-langfuse-llm` for depth).

---

## Definition of Done

- [ ] Surfaces, providers, tools, and RAG stores inventoried
- [ ] Each applicable LLM01–10 marked Implemented / Partial / Missing / N-A with `file:line`
- [ ] Unscoped tools and unsanitized output sinks listed
- [ ] Consumption bounds present or handed to `plan-llm-cost-guardrails`
- [ ] No secret values or full system prompts in the report
- [ ] Fix plan proposed; nothing patched

## Output format

1. **Surface map** — feature | model | tools | data in context
2. **Findings** — LLM-id | severity | evidence | fix shape | execute-via skill
3. **Agency table** — tool | privilege | confirm required?
4. **Handoff** — cost → `plan-llm-cost-guardrails`; input → `plan-input-validation`; quality → `audit-langfuse-llm`

## Related

- `audit-langfuse-llm` — quality, evals, traces
- `plan-llm-cost-guardrails` — spend / quota
- `plan-input-validation` — non-LLM trust boundaries
- `enhance-agent-guardrails` — coding-agent policy
- `test-red-team` — full-app adversarial
- `audit-security` — classic OWASP web
