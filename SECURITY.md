# Security Policy

## Supported Versions

`cursor-kenji` is a **configuration and prompt toolkit** — it ships Markdown skill files, shell scripts, and JSON config templates. There is no compiled binary, no server, and no npm package published to a registry.

| Component | Supported |
|:----------|:----------|
| `skills/` — Agent skill SKILL.md files | Always (latest `main`) |
| `install.sh` — Installer script | Always (latest `main`) |
| `mcp/*.json.template` — MCP config templates | Always (latest `main`) |
| Older commits / forks | Not supported |

---

## Reporting a Vulnerability

If you find a security issue — for example:

- `install.sh` downloading or executing untrusted content
- A skill file that leaks secrets or credentials when executed by an agent
- An MCP config template that exposes API keys or tokens insecurely

**Please do not open a public GitHub issue.**

Instead, use one of these private channels:

1. **GitHub private vulnerability reporting** (preferred) — [Report a vulnerability](https://github.com/kensaurus/cursor-kenji/security/advisories/new)
2. **Email** — contact the maintainer via the email on the GitHub profile

### What to include

- A description of the vulnerability and its potential impact
- Steps to reproduce (or a minimal example)
- Which file(s) are affected
- Any suggested fix (optional but appreciated)

---

## Response Timeline

| Action | Target |
|:-------|:-------|
| Acknowledge receipt | Within 48 hours |
| Initial triage | Within 5 business days |
| Fix or mitigation | Within 14 days for critical issues |
| Public disclosure | Coordinated with reporter |

---

## Secrets in Skills

Skills are agent instructions, not code. They **should never contain** real API keys, tokens, passwords, or other secrets. If you see a skill that references or echoes secrets, that is a bug — please report it.

MCP config **templates** use placeholder values like `YOUR_API_KEY_HERE`. Fill these in your local `~/.cursor/mcp.json` only — never commit real keys to this repository.
