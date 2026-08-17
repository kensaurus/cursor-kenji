# Shell-first search fallback (Windows hang history)

Cursor's dedicated `Grep` and `Glob` tools are the default for text and
filename search. Claude Code has its own search tools. This note is a
**fallback**, not a ban on native search.

1. Prefer native search tools (`Grep` / `Glob` in Cursor; Claude's Grep).
2. If a search tool hangs for **>30 s** on this Windows host, kill the PID
   from the terminal header and retry with a narrower `path` / `head_limit`.
3. Shell `grep -rn`, `ls`, and `find … | head` are the fallback when native
   search is stuck or unavailable. Quote paths that contain spaces.
4. `SemanticSearch` (meaning) and `Read` (known paths) stay the right tools
   for those jobs — do not replace them with Shell.
