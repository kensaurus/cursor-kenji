---
name: design-api
description: Design RESTful and GraphQL APIs following best practices. Use when designing APIs, creating endpoints, structuring responses, or planning API architecture.
license: MIT
---

# API Design Skill

Design clean, consistent, and developer-friendly APIs.

## MANDATORY: Pre-Design Checks

**BEFORE designing any API, you MUST:**

### 1. Check Existing API Documentation
```
http://localhost:8080/api-docs (if backend running)
http://localhost:8080/naming-conventions (naming standards)
src/api/_api-README.md (frontend API layer docs)
```

### 2. Verify Database Schema
Use Supabase MCP to understand existing data structure:
```sql
-- Check table schema
SELECT column_name, data_type, is_nullable
FROM information_schema.columns WHERE table_name = 'your_table';

-- Check enum values
SELECT enum_range(NULL::your_enum_name);

-- Check foreign keys
SELECT tc.constraint_name, kcu.column_name, ccu.table_name AS foreign_table
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'your_table' AND tc.constraint_type = 'FOREIGN KEY';
```

### 3. Check for Existing Endpoints
Use `Grep` to search for similar endpoints already implemented:
```
Grep: "router.get|router.post" to find existing route patterns
Grep: "useQuery|useMutation" to find existing frontend integrations
```

### 4. Verification Statement (REQUIRED)
Before designing, state:
```
"Pre-design check:
- Existing API docs reviewed: [YES/NO]
- Database schema verified: [tables/enums checked]
- Similar endpoints found: [list or none]
- Naming conventions confirmed: [YES/NO]"
```

---

## REST API Design

### URL Structure

```
GET /resources # List
GET /resources/:id # Get one
POST /resources # Create
PUT /resources/:id # Replace
PATCH /resources/:id # Update
DELETE /resources/:id # Delete
```

### Naming Conventions

| Do | Don't |
|----|-------|
| `/users` | `/getUsers`, `/user-list` |
| `/users/:id` | `/user/:id`, `/users/get/:id` |
| `/users/:id/orders` | `/getUserOrders` |
| Plural nouns | Verbs, singular |
| kebab-case | camelCase, snake_case |

### Examples

```
GET /users # List users
GET /users/123 # Get user 123
GET /users/123/orders # User's orders
GET /users/123/orders/456 # Specific order
POST /users/123/orders # Create order for user
```

---

## Request/Response Format

### Request Body

```json
{
 "name": "John Doe",
 "email": "john@example.com",
 "role": "admin"
}
```

### Successful Response

```json
{
 "data": {
 "id": "123",
 "name": "John Doe",
 "email": "john@example.com",
 "createdAt": "2024-01-15T10:30:00Z"
 }
}
```

### List Response (with pagination)

```json
{
 "data": [
 { "id": "1", "name": "John" },
 { "id": "2", "name": "Jane" }
 ],
 "meta": {
 "total": 100,
 "page": 1,
 "perPage": 20,
 "totalPages": 5
 }
}
```

### Error Response

```json
{
 "error": {
 "code": "VALIDATION_ERROR",
 "message": "Invalid input data",
 "details": [
 { "field": "email", "message": "Invalid email format" },
 { "field": "name", "message": "Name is required" }
 ]
 }
}
```

---

## HTTP Status Codes

### Success (2xx)

| Code | When to Use |
|------|-------------|
| `200 OK` | GET, PUT, PATCH success |
| `201 Created` | POST created new resource |
| `204 No Content` | DELETE success, no body |

### Client Errors (4xx)

| Code | When to Use |
|------|-------------|
| `400 Bad Request` | Invalid request body |
| `401 Unauthorized` | Not authenticated |
| `403 Forbidden` | Authenticated but not allowed |
| `404 Not Found` | Resource doesn't exist |
| `409 Conflict` | Resource conflict (duplicate) |
| `422 Unprocessable` | Validation failed |
| `429 Too Many` | Rate limited |

### Server Errors (5xx)

| Code | When to Use |
|------|-------------|
| `500 Internal Error` | Unexpected server error |
| `502 Bad Gateway` | Upstream service failed |
| `503 Unavailable` | Service temporarily down |

---

## Query Parameters

### Filtering

```
GET /users?role=admin
GET /users?role=admin&status=active
GET /orders?createdAfter=2024-01-01
```

### Sorting

```
GET /users?sort=name # Ascending
GET /users?sort=-createdAt # Descending (prefix with -)
GET /users?sort=role,-name # Multiple fields
```

### Pagination

```
GET /users?page=2&perPage=20
GET /users?offset=40&limit=20
GET /users?cursor=abc123 # Cursor-based
```

### Field Selection

```
GET /users?fields=id,name,email
GET /users?include=orders,profile
```

---

## Versioning

### URL Path (Recommended)

```
GET /v1/users
GET /v2/users
```

### Header

```
GET /users
Accept: application/vnd.api+json;version=2
```

---

## Authentication

### Bearer Token

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### API Key

```
X-API-Key: your-api-key
# or
?apiKey=your-api-key
```

---

## Common Patterns

### Bulk Operations

```
POST /users/bulk
{
 "create": [{ "name": "John" }, { "name": "Jane" }],
 "update": [{ "id": "1", "name": "Updated" }],
 "delete": ["2", "3"]
}
```

### Search

```
POST /users/search
{
 "query": "john",
 "filters": { "role": "admin" },
 "sort": { "field": "name", "order": "asc" }
}
```

### Actions (non-CRUD)

```
POST /orders/123/cancel
POST /users/123/verify-email
POST /payments/123/refund
```

---

## API Design Checklist

### Consistency
- [ ] Consistent naming conventions
- [ ] Consistent response format
- [ ] Consistent error format
- [ ] Consistent pagination

### Usability
- [ ] Intuitive URLs
- [ ] Clear documentation
- [ ] Meaningful error messages
- [ ] Sensible defaults

### Security
- [ ] Authentication required
- [ ] Authorization checked
- [ ] Input validation
- [ ] Rate limiting

### Performance
- [ ] Pagination for lists
- [ ] Field selection available
- [ ] Efficient queries
- [ ] Caching headers

---

## Documentation Template

```markdown
## Create User

Create a new user account.

**Endpoint:** `POST /users`

**Authentication:** Required (Bearer token)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | Valid email address |
| role | string | No | User role (default: "user") |

**Response:** `201 Created`
\`\`\`json
{
 "data": {
 "id": "123",
 "name": "John Doe",
 "email": "john@example.com",
 "role": "user",
 "createdAt": "2024-01-15T10:30:00Z"
 }
}
\`\`\`

**Errors:**
- `400` - Invalid request body
- `409` - Email already exists
- `422` - Validation failed
```
