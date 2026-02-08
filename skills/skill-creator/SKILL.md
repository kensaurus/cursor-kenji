---
name: skill-creator
description: Guide for creating effective AI agent skills. Use when user wants to create, update, or improve a skill, or asks about SKILL.md format, skill structure, skill best practices, or how to extend AI capabilities with specialized knowledge.
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular, self-contained packages that extend Claude's capabilities by providing specialized knowledge, workflows, and tools. Think of them as "onboarding guides" for specific domains or tasks.

### What Skills Provide

1. Specialized workflows - Multi-step procedures for specific domains
2. Tool integrations - Instructions for working with specific file formats or APIs
3. Domain expertise - Company-specific knowledge, schemas, business logic
4. Bundled resources - Scripts, references, and assets for complex and repetitive tasks

## Core Principles

### Concise is Key

The context window is a public good. **Default assumption: Claude is already very smart.** Only add context Claude doesn't already have. Challenge each piece of information: "Does Claude really need this explanation?"

Prefer concise examples over verbose explanations.

### Set Appropriate Degrees of Freedom

Match the level of specificity to the task's fragility and variability:

**High freedom (text-based instructions)**: Use when multiple approaches are valid, decisions depend on context, or heuristics guide the approach.

**Medium freedom (pseudocode or scripts with parameters)**: Use when a preferred pattern exists, some variation is acceptable, or configuration affects behavior.

**Low freedom (specific scripts, few parameters)**: Use when operations are fragile and error-prone, consistency is critical, or a specific sequence must be followed.

### Anatomy of a Skill

Every skill consists of a required SKILL.md file and optional bundled resources:

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   │   ├── name: (required)
│   │   └── description: (required)
│   └── Markdown instructions (required)
└── Bundled Resources (optional)
    ├── scripts/          - Executable code (Python/Bash/etc.)
    ├── references/       - Documentation loaded into context as needed
    └── assets/           - Files used in output (templates, icons, fonts)
```

## SKILL.md Structure

### Frontmatter (Required)

```yaml
---
name: my-skill-name
description: What the skill does and WHEN to use it. Include specific triggers/contexts.
---
```

**Critical**: The `description` is the primary triggering mechanism. Include both what the Skill does AND specific triggers/contexts for when to use it.

### Body (Required)

Instructions and guidance for using the skill. Keep under 500 lines.

## Progressive Disclosure Design

Skills use a three-level loading system:

1. **Metadata (name + description)** - Always in context (~100 words)
2. **SKILL.md body** - When skill triggers (<5k words)
3. **Bundled resources** - As needed by Claude

**Key principle:** When a skill supports multiple variations, keep only the core workflow and selection guidance in SKILL.md. Move variant-specific details into separate reference files.

## Skill Creation Process

### Step 1: Understand with Concrete Examples

Ask questions to understand concrete use cases:
- "What functionality should this skill support?"
- "Can you give examples of how this skill would be used?"
- "What would a user say that should trigger this skill?"

### Step 2: Plan Reusable Contents

Analyze each example by:
1. Considering how to execute from scratch
2. Identifying what scripts, references, and assets would help

**Examples:**
- PDF rotation → `scripts/rotate_pdf.py`
- Frontend webapp → `assets/hello-world/` template
- BigQuery queries → `references/schema.md`

### Step 3: Initialize the Skill

Create the skill directory structure:

```bash
mkdir -p skill-name/{scripts,references,assets}
touch skill-name/SKILL.md
```

### Step 4: Edit the Skill

**Writing Guidelines:** Always use imperative/infinitive form.

**Frontmatter:**
- `name`: Lowercase, hyphens for spaces
- `description`: Include what the skill does AND when to use it

**Body:**
- Core instructions
- References to bundled resources
- Examples where helpful

### Step 5: Test the Skill

1. Place in `~/.cursor/skills/` or `.cursor/skills/`
2. Open Cursor Settings → Rules
3. Verify skill appears in "Agent Decides" section
4. Test with relevant prompts

### Step 6: Iterate

After testing:
1. Notice struggles or inefficiencies
2. Identify how to improve SKILL.md or resources
3. Implement changes and test again

## What NOT to Include

- README.md
- INSTALLATION_GUIDE.md
- CHANGELOG.md
- User-facing documentation
- Setup/testing procedures

The skill should only contain information needed for an AI agent to do the job.

## Example Skill

```markdown
---
name: api-documentation
description: Generate comprehensive API documentation from code. Use when asked to document APIs, create OpenAPI specs, or generate endpoint documentation.
---

# API Documentation Generator

Generate clear, comprehensive API documentation from source code.

## Process

1. Analyze endpoint files to identify routes
2. Extract request/response schemas
3. Generate OpenAPI 3.0 spec
4. Create human-readable markdown docs

## Output Format

- `docs/api/openapi.yaml` - OpenAPI spec
- `docs/api/README.md` - Human-readable docs
- `docs/api/endpoints/` - Per-endpoint details

## Conventions

- Use past tense for descriptions ("Retrieved", "Created")
- Include example requests/responses
- Document error codes
- Add authentication requirements
```

## Reference Files

For detailed patterns, see:
- `references/workflows.md` - Sequential workflows and conditional logic
- `references/output-patterns.md` - Template and example patterns
