# Detection Taxonomy

Flag and classify each finding by **type**:

| Type | Signals |
|------|---------|
| **dead-btn** | `onClick`/`onPress` missing, `() => {}`, `console.log`, `// TODO`, `alert("coming soon")`, `href="#"`, `disabled` with no enable path, nav to non-existent route |
| **stub** | Handler returns hardcoded/mock, `throw new Error("not implemented")`, `return null` placeholder, empty `try/catch`, early `return` skipping real logic |
| **fake** | Static/mock/seed data in prod UI, hardcoded arrays, lorem, `mockData`, fixture imports in prod bundle, skeleton that never resolves |
| **unwired-data** | UI expects data but no fetch/query; form submits nowhere; mutation without backend; optimistic update with no server call |
| **dead-link** | Link/redirect to undefined route, 404 target, orphaned page with no inbound nav |
| **orphan** | Exported but never imported/mounted |
| **severed** | Supabase/Sentry/analytics referenced but client uninitialized, env missing, or disabled flag |

## Static grep patterns (adapt to stack)

```
Grep: "not implemented|NOT_IMPLEMENTED|coming soon|TODO:" glob "*.{ts,tsx,js,jsx}" -i
Grep: "onClick=\\{\\s*\\(\\)\\s*=>\\s*\\{\\s*\\}" glob "*.{tsx,jsx}"
Grep: "onClick=\\{console\\.log" glob "*.{tsx,jsx}"
Grep: "href=[\"']#[\"']" glob "*.{tsx,jsx}"
Grep: "mockData|MOCK_|fixture|lorem ipsum" glob "*.{ts,tsx}" -i
Grep: "catch\\s*\\(\\s*\\)\\s*\\{\\s*\\}" glob "*.{ts,tsx}"
Grep: "catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}" glob "*.{ts,tsx}"
```

## Integration wiring checks

| Integration | Verify |
|-------------|--------|
| **Supabase** | Client init (anon vs service_role — never service_role client-side); table/view exists; RLS on public tables; typed client; realtime respects RLS; errors not swallowed |
| **Sentry** | SDK initialized; empty catches aren't hiding failures; context/tags/breadcrumbs; release/env; source maps; no PII leakage |
| **API / server actions** | Endpoint exists; request/response contract; auth |
| **Analytics / flags / i18n** | Events reach real sink; flag-gated stubs have resolution path; i18n keys resolve |
