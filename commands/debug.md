# Debug Tricky Bug

## Purpose
Systematically investigate bugs using hypothesis-driven debugging with runtime evidence — not guessing.

## When to Use
- Bug you can reproduce but can't pinpoint
- Race conditions or timing issues
- Something that used to work (regression)
- Performance problems or memory leaks
- "It works on my machine" issues

## Process

### 1. Use Debug Mode
Select **Debug Mode** from the agent dropdown in Cursor. The agent will:
1. Generate multiple hypotheses about the root cause
2. Instrument your code with targeted logging
3. Ask you to reproduce the bug while collecting data
4. Analyse actual runtime behaviour
5. Make targeted fixes based on evidence

This produces better results than jumping straight to fixes.

### 2. If Debugging Manually

**Gather facts first — no assumptions:**
- Exact error message and stack trace
- Steps to reproduce (minimum reproducible case)
- When did it start? What changed?
- Which environments are affected?
- Is it consistent or intermittent?

**Form hypotheses (list 3-5):**
- What are the most likely root causes?
- Order by probability

**Instrument with logging:**
```typescript
// Add at key decision points
console.log('[debug:auth]', { userId, session, timestamp: Date.now() })

// For async issues — log entry and exit
console.log('[debug:start]', params)
// ... code ...
console.log('[debug:end]', result)
```

**Check real data:**
- Query DB directly via Supabase MCP to verify data state
- Check network tab for unexpected request/response shapes
- Verify env vars are set correctly in the running environment

### 3. Common Patterns

| Symptom | Check |
|---------|-------|
| Works locally, fails in prod | Env vars, build output, DB data differences |
| Intermittent failure | Race condition, missing `await`, shared mutable state |
| Wrong data displayed | Stale cache, wrong query key, missing revalidation |
| Infinite re-renders | Unstable dependency array, object/array literal in deps |
| Auth redirect loops | Middleware matching too broadly, session not refreshing |
| Type error at runtime | Zod schema mismatch, API returning unexpected shape |
| Hydration mismatch | Date formatting, `typeof window`, random values in SSR |

### 4. Fix & Verify
- Fix the root cause, not the symptom
- Remove all debug logging before committing
- Add a regression test so it can't silently reappear

### 5. Checklist
- [ ] Minimum reproducible case identified
- [ ] Root cause confirmed (not just a symptom)
- [ ] Fix targets root cause
- [ ] Debug logs removed
- [ ] Regression test added
- [ ] Fix verified in same environment where bug occurred
