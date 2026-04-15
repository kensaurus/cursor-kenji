---
name: docs-writer
description: Write clear, helpful documentation including READMEs, API docs, and code comments. Use when writing documentation, creating READMEs, documenting APIs, or when the user needs help with docs.
---

# Documentation Writer Skill

Create clear, useful documentation for developers.

## MANDATORY: Pre-Documentation Checks

**BEFORE writing any documentation, you MUST:**

### 1. Read Existing Documentation
```
README.md                               (project root)
docs/                                   (existing docs)
src/[domain]/@_[domain]-README.md       (feature-specific READMEs)
```

### 2. Check Documentation Patterns
Use `Glob` to find existing README files:
```
Glob: "**/*README.md" to find all READMEs
Glob: "**/*.md" in docs/ to find documentation patterns
```

### 3. Verify Code Matches Documentation
Read the actual code being documented to ensure accuracy:
- Check function signatures match documentation
- Verify example code actually works
- Confirm database schema matches any data documentation

### 4. Verification Statement (REQUIRED)
Before writing docs, state:
```
"Pre-documentation check:
- Existing docs read: [list]
- Documentation pattern identified: [pattern from existing READMEs]
- Code verified: [files read to ensure accuracy]"
```

---

## README Template

```markdown
# Project Name

Brief description of what this project does.

## Features

- Feature 1
- Feature 2
- Feature 3

## Quick Start

\`\`\`bash
# Install
npm install

# Run
npm start
\`\`\`

## Installation

### Prerequisites

- Node.js >= 18
- npm or pnpm

### Setup

\`\`\`bash
# Clone repository
git clone https://github.com/user/project.git
cd project

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev
\`\`\`

## Usage

### Basic Example

\`\`\`typescript
import { Widget } from 'project';

const widget = new Widget({ option: 'value' });
widget.render();
\`\`\`

### Advanced Configuration

See [Configuration Guide](./docs/configuration.md)

## API Reference

See [API Documentation](./docs/api.md)

## Contributing

See [Contributing Guide](./CONTRIBUTING.md)

## License

MIT
```

---

## Documentation Types

### 1. API Documentation

```markdown
## createUser

Create a new user account.

### Signature

\`\`\`typescript
function createUser(params: CreateUserParams): Promise<User>
\`\`\`

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | User's display name |
| email | string | Yes | Valid email address |
| role | 'admin' \| 'user' | No | User role (default: 'user') |

### Returns

`Promise<User>` - The created user object

### Example

\`\`\`typescript
const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'admin'
});
\`\`\`

### Errors

| Error | Cause |
|-------|-------|
| `ValidationError` | Invalid email format |
| `ConflictError` | Email already exists |
```

### 2. Code Comments

```typescript
/**
 * Calculate the total price including tax and discounts.
 * 
 * @param items - Array of cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 * @param discount - Optional discount code
 * @returns Total price in cents
 * 
 * @example
 * const total = calculateTotal(items, 0.1, 'SAVE10');
 */
function calculateTotal(
  items: CartItem[],
  taxRate: number,
  discount?: string
): number {
  // Sum up item prices
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  // Apply discount if valid
  const discountAmount = discount ? getDiscountAmount(discount, subtotal) : 0;
  
  // Calculate tax on discounted amount
  const taxableAmount = subtotal - discountAmount;
  const tax = Math.round(taxableAmount * taxRate);
  
  return taxableAmount + tax;
}
```

### 3. Architecture Documentation

```markdown
# Architecture Overview

## System Components

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│   API       │────▶│  Database   │
│   (React)   │     │   (Node)    │     │  (Postgres) │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Cache     │
                    │   (Redis)   │
                    └─────────────┘
\`\`\`

## Data Flow

1. Client sends request to API
2. API checks cache for data
3. If cache miss, query database
4. Store result in cache
5. Return response to client

## Key Decisions

### Why PostgreSQL?
- ACID compliance for financial data
- JSON support for flexible schemas
- Strong ecosystem

### Why Redis?
- Fast read performance
- Session storage
- Pub/sub for real-time features
```

---

## Writing Guidelines

### Be Concise

```markdown
# ❌ Too verbose
This function is responsible for taking an array of user objects
and filtering them based on the active status property, returning
only those users who have an active status of true.

# ✅ Concise
Filter users by active status.
```

### Use Examples

```markdown
# ❌ Abstract description
The function accepts configuration options.

# ✅ With example
Configure the logger:
\`\`\`typescript
const logger = createLogger({
  level: 'info',
  format: 'json',
  output: 'stdout'
});
\`\`\`
```

### Structure Information

```markdown
# ❌ Wall of text
To install the package you need to run npm install, then create
a .env file with your configuration, then run the migrations...

# ✅ Structured steps
## Setup

1. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

2. Configure environment
   \`\`\`bash
   cp .env.example .env
   \`\`\`

3. Run migrations
   \`\`\`bash
   npm run migrate
   \`\`\`
```

---

## Documentation Checklist

### README
- [ ] Clear project description
- [ ] Quick start (< 5 steps)
- [ ] Prerequisites listed
- [ ] Installation instructions
- [ ] Basic usage example
- [ ] Link to detailed docs

### API Docs
- [ ] All public functions documented
- [ ] Parameters and return types
- [ ] Usage examples
- [ ] Error cases documented

### Code Comments
- [ ] Complex logic explained
- [ ] "Why" not just "what"
- [ ] JSDoc for public APIs
- [ ] No obvious comments

### Architecture
- [ ] System overview diagram
- [ ] Component relationships
- [ ] Key decisions documented
- [ ] Data flow explained

---

## Helpful Diagrams

### Mermaid Flowchart

```markdown
\`\`\`mermaid
flowchart LR
    A[User] --> B[Frontend]
    B --> C[API]
    C --> D[Database]
    C --> E[Cache]
\`\`\`
```

### Sequence Diagram

```markdown
\`\`\`mermaid
sequenceDiagram
    User->>+API: POST /login
    API->>+DB: Verify credentials
    DB-->>-API: User data
    API-->>-User: JWT token
\`\`\`
```

---

## Keep Docs Updated

```markdown
# In PR template:
## Documentation
- [ ] README updated (if needed)
- [ ] API docs updated (if endpoints changed)
- [ ] Code comments added (for complex logic)
```
