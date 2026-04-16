---
name: doc-coauthoring
description: Guide users through structured workflow for co-authoring documentation. Use when user wants to write docs, proposals, technical specs, decision docs, PRDs, RFCs, ADRs, READMEs, or mentions "write a doc", "draft proposal", "help me document", "create spec", or "design document".
---

# Doc Co-Authoring Workflow

A structured workflow for guiding users through collaborative document creation. Act as an active guide through three stages: Context Gathering, Refinement & Structure, and Reader Testing.

## CRITICAL: Check Existing First

**Before creating ANY documentation, verify:**

1. **Check for existing docs:**
```bash
ls -la docs/ README.md CONTRIBUTING.md *.md 2>/dev/null
ls -la .github/*.md .github/ISSUE_TEMPLATE/ 2>/dev/null
```

2. **Check for doc templates:**
```bash
ls -la docs/templates/ .github/PULL_REQUEST_TEMPLATE.md 2>/dev/null
rg "## Template" docs/ 2>/dev/null
```

3. **Check existing doc conventions:**
- Look at existing README structure
- Check heading styles, formatting conventions
- Verify if ADR/RFC numbering exists

4. **Check for doc generation tools:**
```bash
cat package.json | grep -i "typedoc\|jsdoc\|storybook"
```

**Why:** Documentation should follow existing conventions and not duplicate content.

## When to Offer This Workflow

**Trigger conditions:**
- User mentions writing documentation: "write a doc", "draft a proposal", "create a spec"
- User mentions specific doc types: "PRD", "design doc", "decision doc", "RFC"
- User seems to be starting a substantial writing task

**Initial offer:**
Explain the three stages:
1. **Context Gathering**: User provides all relevant context while Claude asks clarifying questions
2. **Refinement & Structure**: Iteratively build each section through brainstorming and editing
3. **Reader Testing**: Test the doc with a fresh perspective to catch blind spots

## Stage 1: Context Gathering

**Goal:** Close the gap between what the user knows and what Claude knows.

### Initial Questions

1. What type of document is this? (technical spec, decision doc, proposal)
2. Who's the primary audience?
3. What's the desired impact when someone reads this?
4. Is there a template or specific format to follow?
5. Any other constraints or context to know?

### Info Dumping

Encourage the user to dump all context:
- Background on the project/problem
- Related team discussions or documents
- Why alternative solutions aren't being used
- Organizational context
- Timeline pressures or constraints
- Technical architecture or dependencies
- Stakeholder concerns

### Clarifying Questions

Generate 5-10 numbered questions based on gaps in the context. Allow shorthand answers.

**Exit condition:** Sufficient context when questions show understanding of edge cases and trade-offs.

## Stage 2: Refinement & Structure

**Goal:** Build the document section by section through brainstorming, curation, and iterative refinement.

### For Each Section

1. **Clarifying Questions**: Ask 5-10 questions about what to include
2. **Brainstorming**: Generate 5-20 options for content
3. **Curation**: User indicates what to keep/remove/combine
4. **Gap Check**: Ask if anything important is missing
5. **Drafting**: Write the section based on selections
6. **Iterative Refinement**: Make surgical edits based on feedback

### Section Ordering

Start with whichever section has the most unknowns:
- For decision docs: core proposal
- For specs: technical approach
- Summary sections: last

### Quality Checking

After 3 consecutive iterations with no substantial changes, ask if anything can be removed without losing important information.

## Stage 3: Reader Testing

**Goal:** Test the document to catch blind spots.

### Testing Steps

1. **Predict Reader Questions**: Generate 5-10 questions readers would realistically ask
2. **Test Each Question**: Verify the document answers them clearly
3. **Additional Checks**:
   - What might be ambiguous or unclear?
   - What knowledge does the doc assume readers have?
   - Are there internal contradictions?
4. **Iterate**: Fix any gaps found

### Exit Condition

When the document consistently answers questions correctly and doesn't surface new gaps.

## Final Review

When Reader Testing passes:
1. Recommend a final read-through by the user
2. Suggest double-checking facts, links, or technical details
3. Ask them to verify it achieves the desired impact

## Tips for Effective Guidance

**Tone:**
- Be direct and procedural
- Explain rationale briefly when it affects user behavior
- Don't try to "sell" the approach - just execute it

**Handling Deviations:**
- If user wants to skip a stage: accommodate and continue
- If user seems frustrated: acknowledge and suggest ways to move faster
- Always give user agency to adjust the process

**Quality over Speed:**
- Don't rush through stages
- Each iteration should make meaningful improvements
- The goal is a document that actually works for readers
