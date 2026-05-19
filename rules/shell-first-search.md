# Shell-first search and filesystem tools

These rules apply to **every** Cursor workspace on this machine.

## Why

The `Grep` and `Glob` tools have repeatedly hung for several minutes
on this Windows host (May 2026 sessions: two grep calls interrupted
after 4 and 7 minutes of zero output, blocking real work).
`grep`/`ls`/`find` shelled out via the `Shell` tool always return
in <2 s on the same queries. The native shell path is faster, more
predictable, and the user can see the command history.

## Rules

1. **Default to `Shell` for any text or filename search.** Use
   `grep -rn 'pattern' path/`, `ls path/`, `find path/ -name '…'`
   with `head` to bound output. Always quote paths that contain
   spaces. Prefer narrow `path/` arguments over searching the whole
   workspace.

2. **Do not call the `Grep` tool** unless a `Shell` `grep` has
   already failed for an identifiable reason (e.g., binary that
   shell `grep` chokes on). If you do call it, always include a
   small `head_limit` and a narrow `path` so a hang is bounded.

3. **Do not call the `Glob` tool** for routine file discovery. Use
   `Shell` with `ls`, `find … -name '…'`, or `find … -type f -path
   '*/foo/*'` instead. Same hang risk, same fix.

4. **`SemanticSearch` is allowed** — it is a different mechanism
   (LLM over an embedding index, not text grep) and is the right
   tool for "find by meaning" queries. Do not substitute Shell
   for SemanticSearch when the query is conceptual.

5. **`Read` is still the right tool for known file paths.** Don't
   shell out `cat`/`head`/`tail` to read files. The rule only
   covers _searching_ for files or text.

6. **If a `Shell` search itself appears to hang for >30 s**, kill
   the PID from the terminal file's header rather than waiting.
   Then retry with a narrower path or a smaller `head` cap.

## One-line reference

`Shell` for searching → `Read` for known files → `SemanticSearch`
for meaning. `Grep` and `Glob` are last resorts.
