# MCP Server Configuration

Model Context Protocol (MCP) servers extend Cursor's AI with external tools and services.

## Templates

| File | Description |
|------|-------------|
| `mcp.json.template` | **Essential 5** — Core servers for most projects |
| `mcp-full.json.template` | **Full suite (16 servers)** — Everything including AWS, GitHub, Slack, Notion |

Copy your preferred template:

```bash
# Essential (recommended to start)
cp mcp/mcp.json.template ~/.cursor/mcp.json

# Full suite (pick what you need)
cp mcp/mcp-full.json.template ~/.cursor/mcp.json
```

Then edit `~/.cursor/mcp.json` and replace `YOUR_*` placeholders with real credentials.

---

## Server Reference

### Tier 1: Essential (Always On)

| Server | API Key? | What it Does |
|--------|----------|-------------|
| **Sequential Thinking** | No | Step-by-step reasoning for complex tasks |
| **Context7** | No | Live, up-to-date library documentation |
| **Firecrawl** | Yes | Web scraping for research ([firecrawl.dev](https://firecrawl.dev)) |
| **Supabase** | Yes | Direct DB access, auth, storage, migrations |
| **Chrome DevTools** | No* | Browser testing, console checks, screenshots |

*Requires Chrome with `--remote-debugging-port=9222`

### Tier 2: Development Power-Ups

| Server | API Key? | What it Does |
|--------|----------|-------------|
| **GitHub** | Yes (PAT) | Repos, issues, PRs, code search, reviews |
| **GitHub Official** | Yes (PAT) | Official Go-based server (Docker, more features) |
| **Playwright** | No | Browser automation, E2E testing, screenshots |
| **Postgres** | Yes (conn) | Direct PostgreSQL queries, schema inspection |
| **Memory** | No | Persistent memory across sessions |

### Tier 3: Cloud & Infrastructure

| Server | API Key? | What it Does |
|--------|----------|-------------|
| **AWS Lambda** | Yes (profile) | Lambda functions, deployments, logs |
| **AWS S3** | Yes (profile) | Bucket management, file operations |
| **AWS CloudWatch** | Yes (profile) | Log queries, metrics, alarms |
| **Redis** | Yes (URL) | Key-value store operations |

### Tier 4: Productivity

| Server | API Key? | What it Does |
|--------|----------|-------------|
| **Slack** | Yes (bot) | Read/send messages, manage channels |
| **Notion** | Yes | Search/manage pages, databases |

---

## Setup Guides

### GitHub MCP Server

The most useful addition after the essentials. Two options:

**Option A: npm-based (simpler)**
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
    }
  }
}
```

**Option B: Official Docker-based (more features)**
```json
{
  "github-official": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
    }
  }
}
```

**Get a token:** [github.com/settings/tokens](https://github.com/settings/tokens) → Fine-grained → Permissions: Repository (Contents, Issues, PRs, Admin), User (Read-only)

**What you can do:**
- "Search for all open issues labeled `bug` in my repo"
- "Create a PR from current branch with a summary"
- "What changed in the last 5 commits?"
- "Review PR #42 for security issues"

---

### AWS MCP Servers

Requires AWS CLI configured with credentials (`aws configure`).

```bash
# Install Python-based AWS MCP servers
pip install uvx  # or use pipx
```

```json
{
  "aws-lambda": {
    "command": "uvx",
    "args": ["awslabs.lambda-mcp-server@latest"],
    "env": {
      "AWS_PROFILE": "default",
      "AWS_REGION": "ap-northeast-1"
    }
  }
}
```

**What you can do:**
- "List all Lambda functions in my account"
- "Check CloudWatch logs for errors in the last hour"
- "Upload this file to my S3 bucket"
- "What's the invocation count for my API function?"

---

### Playwright MCP Server

Zero config — just add and go:

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

**What you can do:**
- "Open localhost:3000 and take a screenshot"
- "Fill in the login form and submit"
- "Check if the dashboard loads correctly"
- "Run accessibility checks on the signup page"

No need to launch Chrome separately (unlike Chrome DevTools MCP).

---

### Chrome DevTools MCP

Requires Chrome running with remote debugging:

```bash
# Linux
google-chrome --remote-debugging-port=9222

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222
```

Or use the shell alias:
```bash
source ~/cursor-kenji/shell-aliases/cursor-helpers.sh
cursor-dev  # Opens Chrome + Cursor together
```

---

### Memory MCP Server

Persistent memory that survives across sessions:

```json
{
  "memory": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-memory"]
  }
}
```

**What you can do:**
- AI remembers architecture decisions from past conversations
- Stores user preferences and project context
- Recalls past debugging sessions and solutions

---

## Recommended Configurations

### Solo Developer (Web App)
```
sequential-thinking + context7 + firecrawl + supabase + chrome-devtools + github + playwright
```

### Team / Full-Stack
```
All of above + postgres + memory + slack
```

### AWS Cloud Development
```
sequential-thinking + context7 + aws-lambda + aws-s3 + aws-cloudwatch + github
```

### Content / Product
```
sequential-thinking + context7 + github + notion + slack + memory
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Server not starting | Check `npx` is available: `which npx` |
| "Bad credentials" | Regenerate token, check permissions |
| Chrome DevTools fails | Ensure Chrome running with `--remote-debugging-port=9222` |
| AWS servers fail | Run `aws sts get-caller-identity` to verify credentials |
| Slow startup | Remove servers you don't use (each spawns a process) |

**Performance tip:** Only enable servers you actively use. Each server is a background process. The essential 5 is a good baseline; add others as needed.
