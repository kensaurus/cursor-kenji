---
name: iterate-agent-harness
description: >
  Turn an agent failure—premature stop, false completion, gamed check,
  missed file, broken handoff—into a durable rule/skill/hook/CI guard
  plus regression test. Use when "the agent stopped early again", "it
  gamed the test", or "add a guard so this doesn't recur". App bugs →
  workflow-fix-and-ship.
license: MIT
---

# iterate-agent-harness — Failure → Durable Guard

**Degree of freedom: MIXED.** Failure-class and smallest fix `[HIGH freedom]`;
guard-fails-before-fix and the report shape `[LOW freedom — run exactly]`.

When an agent run ends wrong, the fix is not just to redo the task — it is to
change the harness so the whole class of failure cannot recur silently. This
skill converts a single failure into a durable guard plus a regression check.

> **A failure you cannot reproduce, you cannot prove you fixed.** Capture the
> failure mode, add a guard that fails on it, then make the guard pass with the
> smallest durable change.

## How to reason

1. **Observe** — happened vs should-have; transcript, state file, diff, CI
2. **Interpret** — routing miss, missing guard, or a gate that passed wrongly
3. **Classify** — premature stop / false completion / reward hacking / scope / handoff / context loss
4. **Guard** — add a guard that fails on the unfixed behavior, then the smallest durable fix

## Worked example

> **Observe:** agent said complete-everything was done; `.cursor/complete-everything-state.md` still has 12 unchecked items.
> **Interpret:** false completion — no harness stopped the claim.
> **Classify:** false completion; gap is an unwired or skippable completion gate.
> **Fix:** add a hook test that fails while unchecked items remain; confirm it fails on this tree; then wire the hook. Do not delete the open items to go green.

## Self-critique before reporting

- **Fail-then-pass** — the new guard failed on the unfixed tree
- **Class, not incident** — the same failure mode would now be caught
- **Guard not weakened** — passing did not mean deleting or narrowing the check
- **Right owner** — app bug → `workflow-fix-and-ship`; new SKILL.md from scratch → `meta-skill-creator`

## Phase 0 — Capture the failure precisely  [HIGH freedom]

1. State what happened vs. what should have happened, in one sentence each.
2. Classify the failure mode (borrow the taxonomy the toolkit already targets):
   - **premature stop** — quit with actionable work remaining
   - **false completion** — claimed done without evidence
   - **reward hacking** — satisfied the check, not the intent (skipped test,
     narrowed assertion, `@ts-ignore`, blanket snapshot update)
   - **scope boundary error** — treated the plan/visible list as the full scope
   - **broken handoff** — a skill/command/subagent pointed at a missing or
     wrong target, or a phase transition dropped work
   - **context loss** — forgot earlier state after compaction
3. Pull evidence from the agent transcript, `.cursor/*-state.md` files,
   `git diff`, and CI logs. Link the concrete artifacts.

## Phase 1 — Locate the harness gap  [HIGH freedom]

Find where the harness *should* have caught it:

- Was there a skill/rule that covered this, and it was not followed or not
  triggered? → the description/routing or wording is the gap.
- Was there no guard at all? → a new rule, hook, subagent check, or
  verification script is warranted.
- Did an enforcement gate exist but pass anyway (like a count check with
  incomplete coverage)? → the gate's coverage is the gap.

Name the single smallest change that closes the class, not just this instance.
Prefer strengthening an existing skill/rule/hook over adding a new one; only
add a new component when no existing one owns the concern.

## Phase 2 — Add a regression guard first  [LOW freedom — fail before fix]

Before fixing, add something that fails on the captured failure:

- an executable check (a script under `scripts/`, a hook test like
  `scripts/test-completion-gate.mjs`, a validation rule) — preferred; or
- a documented, repeatable scenario with an explicit expected outcome when the
  failure is judgment-based and not mechanically checkable.

Confirm the guard actually fails against the current (unfixed) behavior — a
guard that passes before the fix proves nothing.

## Phase 3 — Make the smallest durable fix  [HIGH freedom]

Apply the minimal change that makes the guard pass by satisfying intent:

- tighten a skill/rule's wording or trigger; resolve a policy conflict;
- fix or add a hook / subagent / verification script;
- repair a broken skill/command/subagent reference or handoff.

Do not weaken the guard to pass, and do not delete working behavior. Keep the
public behavior of unrelated skills unchanged.

## Phase 4 — Validate and record the lesson  [LOW freedom — do not skip]

1. Re-run the guard: it now passes for the right reason. Run the repo's full
   check suite (`npm test` or equivalent) so the new guard is wired in.
2. Record a concise lesson: the failure mode, the trigger, the guard, and the
   fix — in `CHANGELOG.md` and/or a durable lessons note, so the same mistake
   surfaces a reference next time.
3. If the failure recurred despite an existing guard, note why the guard was
   insufficient and strengthen it rather than duplicating it.

## Phase 5 — Report  [LOW freedom — this shape]

```md
## Harness Iteration — <date>
Failure mode: <class> — <one-sentence description>
Root gap: <missing/weak guard or conflicting rule>
Guard added: <script/test/rule> — failed before, passes after
Durable fix: <smallest change>
Validation: <check suite> → green
Lesson recorded: <where>
```

## Guardrails

- Improve the harness for the **class**, not just the one incident.
- A new guard must fail before the fix and pass after — never the reverse.
- Never satisfy a guard by weakening it; that repeats the reward-hacking
  failure this skill exists to prevent.
- Prefer editing an existing skill/rule/hook to adding a new one.

## Related

- `verification-before-completion` — the evidence discipline guards enforce
- `completion-judge` — independent verdict that catches false completion
- `complete-everything` / `burndown-full` — the closure loops guards protect
- `create-skill` / `create-rule` / `create-hook` — build the new guard
- `meta-skill-creator` — author or refine a skill correctly
