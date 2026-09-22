# Agent notes — cursor-kenji

## Architecture in one breath

This repo **is** the playbook pack: skills + slash commands + agents +
rules. `npx @kensaurus/cursor-kenji --all` installs Cursor, Claude
Code, Codex CLI, and Gemini CLI; a bare `npx` stays Cursor-only.
`npx skills add` is skills-only.
Default install merges; `--clean` is opt-in. Descriptions cap at 320
chars. Do not submit the Official MCP Registry — we ship templates, not
a server.

`docs/AGENTS.template.md` is the constitution **copied into other
repos**. Do not treat it as this pack's own agent notes.

**Decision memory.** Before proposing a change to architecture, dependencies,
conventions, or distribution, read [`docs/adr/INDEX.md`](docs/adr/INDEX.md).
Do not contradict an Accepted ADR silently — surface it, cite the ADR,
and ask. A reversal produces a superseding ADR, by the human, on
purpose. New decisions that meet the bar in the index land as an ADR in
the same PR.

## Support

- **Support / publisher contact:** kensaurus@gmail.com
  (`.claude-plugin` marketplace email).
- Listings and "do not submit" tables: [docs/DISTRIBUTION.md](docs/DISTRIBUTION.md).
