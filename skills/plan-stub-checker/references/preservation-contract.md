# Preservation Contract

Applies to **every phase**. Read before auditing or proposing anything.

## Never do in this pass

- **Remove** features, routes, screens, handlers, or props. Dead-looking code → *proposal for approval*, never delete unilaterally. Handlers may be wired dynamically — run the false-positive pass first.
- **Fabricate** data, content, endpoints, env keys, or schema. No invented table names, columns, API routes, or DSNs. Unknown → `[NEEDS REAL TARGET]`, leave code untouched.
- **Guess** codebase facts. Ground every claim in a file you read; cite path + line. Can't verify → say so.
- **Change I/O or business logic** silently unless a wiring change is explicitly proposed + approved.
- **Break** public APIs, props, routes, or payload shapes without flagging as breaking + migration note.
- **Implement wiring** in this pass. Proposals only.

## Before any file change proposal

State in one line **what currently works there that must keep working**.

## Classification buckets

| Classification | Meaning |
|----------------|---------|
| **Confirmed stub/dead** | Evidence in code — empty handler, mock data in prod path, missing fetch |
| **Potentially unwired** | Likely stub but needs runtime or flag context |
| **Review required** | Dynamic invocation, registry, feature-flag — uncertain; conservative default |
