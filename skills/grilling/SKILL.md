---
name: grilling
description: >-
  Grill the user relentlessly about a plan, decision, or idea — one question at a
  time — until shared understanding is reached. Use when the user says "grill me",
  "stress-test this plan", "interview me about this", "poke holes in this",
  "challenge my thinking", or before committing to a non-trivial design.
license: MIT
---

# Grilling

> The most common failure mode in software work is misalignment: the agent builds
> what it *thinks* was asked. A grilling session closes that gap before any work
> starts. Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

Interview the user relentlessly about every aspect of the plan, decision, or idea
until you reach a shared understanding. Walk down each branch of the decision
tree, resolving dependencies between decisions one by one.

## Rules of the session

1. **One question at a time.** Ask a single question, then wait for the answer
   before continuing. Asking multiple questions at once is bewildering.
2. **Recommend an answer with every question.** State your recommended answer and
   why, so the user can accept it with a single word or push back.
3. **Facts are yours; decisions are theirs.** If a *fact* can be found by
   exploring the environment (filesystem, git history, docs, running commands),
   look it up instead of asking. *Decisions* belong to the user — put each one to
   them and wait.
4. **Resolve dependencies in order.** When one decision hinges on another,
   surface the upstream decision first.
5. **Challenge vague terms.** When the user uses an overloaded or fuzzy word,
   propose a precise one (see `domain-modeling` when the vocabulary itself needs
   fixing).
6. **Do not act until confirmed.** No edits, no scaffolding, no "getting a head
   start". The session ends when the user confirms shared understanding — then
   summarize the decisions made and hand off to the appropriate skill
   (`workflow-spec-tdd`, `design-prd`, `plan-*`).

## Output

Close the session with a compact decision log: each decision on one line, in the
user's confirmed vocabulary. This log is the input to the spec or plan that
follows — offer to carry it into `design-prd` or `/plan`.
