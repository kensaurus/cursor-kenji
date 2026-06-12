---
name: workflow-feature-flag
description: >-
  Plan and execute a disciplined feature-flag rollout for any app. Detects
  existing flag infrastructure (LaunchDarkly, Flagsmith, GrowthBook, Unleash,
  PostHog, or custom env-var gates). Designs flag taxonomy, targeting rules,
  and kill-switch path. Gates the feature behind the flag, monitors error rate
  and performance in Sentry during staged rollout, and either promotes to 100%
  or rolls back. Schedules flag cleanup once stable. Generic across any stack
  and flag vendor. Use when asked to "add a feature flag", "gradual rollout",
  "staged release", "kill switch", "dark launch", "flag cleanup", "canary
  release", "rollback plan", "safe feature release", or "deploy without
  switching on".
license: MIT
---

# workflow-feature-flag — Gate → Rollout → Monitor → Promote or Rollback

**Shipping code and switching it on are two separate acts.** A feature flag
lets you deploy on your schedule, enable for specific users or a percentage of
traffic, and kill it instantly if anything goes wrong — without a rollback
deploy. This skill gives that discipline to any feature.

---

## Phase 0: Detect existing flag infrastructure

```
package.json         → launchdarkly-node-server-sdk, @launchdarkly/js-client-sdk,
                       flagsmith, growthbook, unleash-client, posthog-js
.env.*               → LD_SDK_KEY, FLAGSMITH_ENV_KEY, GROWTHBOOK_API_HOST,
                       POSTHOG_KEY (reference by name only)
src/lib/flags.*      → custom feature-flag utility
src/config/flags.*   → env-var-based flags
```

| Detected platform | Approach |
|-------------------|----------|
| LaunchDarkly | Use LD SDK client; flags managed in LD dashboard |
| PostHog | Use PostHog feature flags API; tied to analytics context |
| GrowthBook | Open-source, self-hosted or cloud; SDK + feature API |
| Flagsmith | Open-source or cloud; REST API + SDK |
| None / custom | Simple env-var or database-backed flag (implement below) |

---

## Phase 1: Design the flag

Before writing any code, define the flag contract:

```
Flag name:    [kebab-case, descriptive, present-tense: "new-checkout-flow"]
Description:  [What this flag controls — plain English]
Type:         Boolean / String variant / JSON payload
Targeting:    [Who sees it first: internal users? 5% of traffic? specific org IDs?]
Rollout plan: 0% → internal only → 5% → 25% → 100%
Kill-switch:  If Sentry error rate on [metric] exceeds [threshold], roll back to 0%
Cleanup date: [When to remove the flag — typically 2 weeks after 100% stable]
```

**Naming rules:**
- `kebab-case`, present-tense action: `new-checkout-flow`, not `checkoutV2` or `feature123`
- Include the domain: `billing-usage-dashboard`, `auth-passkey-login`
- No generic names like `beta`, `v2`, `new-feature` — they become permanent accidents

---

## Phase 2: Implement the flag gate

### Option A: Simple env-var flag (no external service)

```typescript
// src/lib/flags.ts
export const FLAGS = {
  newCheckoutFlow: process.env.NEXT_PUBLIC_FLAG_NEW_CHECKOUT_FLOW === 'true',
  billingUsageDashboard: process.env.NEXT_PUBLIC_FLAG_BILLING_USAGE_DASHBOARD === 'true',
} as const;

export type FeatureFlag = keyof typeof FLAGS;
```

Usage:
```typescript
import { FLAGS } from '@/lib/flags';
if (FLAGS.newCheckoutFlow) {
  return <NewCheckoutFlow />;
}
return <LegacyCheckoutFlow />;
```

For server-side percentage rollout without a vendor, use a hash of the user ID:
```typescript
function isInRollout(userId: string, flagName: string, percentage: number): boolean {
  const hash = parseInt(
    require('crypto').createHash('md5')
      .update(`${userId}:${flagName}`)
      .digest('hex').slice(0, 8),
    16,
  );
  return (hash % 100) < percentage;
}
```

### Option B: PostHog flags (already in the stack)

```typescript
import { useFeatureFlagEnabled } from 'posthog-js/react';

function CheckoutPage() {
  const useNewFlow = useFeatureFlagEnabled('new-checkout-flow');
  if (useNewFlow) return <NewCheckoutFlow />;
  return <LegacyCheckoutFlow />;
}
```

Server-side (Next.js Server Component):
```typescript
import { PostHog } from 'posthog-node';
const client = new PostHog(process.env.POSTHOG_KEY!);
const isEnabled = await client.isFeatureEnabled('new-checkout-flow', userId);
```

### Option C: LaunchDarkly

```typescript
import { useFlags } from 'launchdarkly-react-client-sdk';
const { newCheckoutFlow } = useFlags();
```

---

## Phase 3: Stage the rollout

### Step 1: Internal only (0% of real users)

Set the flag enabled only for internal team accounts / test emails.
Verify the feature works end-to-end for the team.

Check for errors in Sentry immediately after enabling:
```json
CallMcpTool(server: "plugin-sentry-sentry", toolName: "search_issues", arguments: {
  "organizationSlug": "<ORG>",
  "naturalLanguageQuery": "new issues in the last 1 hour",
  "projectSlugOrId": "<PROJECT>",
  "regionUrl": "<REGION_URL>",
  "limit": 10
})
```

### Step 2: 5% rollout

Enable for 5% of real users (random cohort). Monitor for 24–48 hours.

Define the health gates before enabling:
- Error rate for the flagged feature path must stay < baseline + 0.5%
- P95 response time must stay < baseline + 200 ms
- No new Critical/High Sentry issues

Check Supabase logs for unexpected errors:
```json
CallMcpTool(server: "plugin-supabase-supabase", toolName: "get_logs", arguments: {
  "project_id": "<PROJECT_ID>",
  "service": "api"
})
```

### Step 3: 25% → 50% → 100%

Each step: enable, wait 24 h, check Sentry + Supabase + business metrics.
Only proceed when the health gates are green.

---

## Phase 4: Rollback procedure

If any health gate fails at any stage:

1. Set the flag to 0% immediately (no deploy needed — this is the whole point)
2. Capture the Sentry issue IDs and root-cause analysis:
   ```json
   CallMcpTool(server: "plugin-sentry-sentry", toolName: "analyze_issue_with_seer", arguments: {
     "organizationSlug": "<ORG>",
     "issueId": "<ISSUE_ID>",
     "regionUrl": "<REGION_URL>"
   })
   ```
3. Fix the root cause (do not re-enable until fixed and re-tested internally)
4. Document what happened in the flag's description

---

## Phase 5: Promote to 100% and clean up

Once the feature is stable at 100% for at least 1 week:

1. Remove the flag check from the code — ship the new path as the default
2. Delete the fallback code (old path)
3. Delete the flag from the flag platform (LaunchDarkly / PostHog / etc.)
4. Remove the env var from all environments
5. Delete the flag from `src/lib/flags.ts` (for the env-var approach)

**Why cleanup matters:** Stale flags become permanent conditions. Code that says
`if (FLAGS.newCheckoutFlow)` six months later is a landmine nobody dares touch.

```
CLEANUP CHECKLIST:
- [ ] Flag gate removed from source code
- [ ] Old fallback code deleted
- [ ] Flag deleted from the flag platform
- [ ] Env var removed from .env* and deployment config
- [ ] No more references to the flag name in the codebase
```

---

## Phase 6: Rollout report

```markdown
## Feature Flag Rollout — [flag-name] — [Date]

### Flag
- Name: [flag-name]
- Description: [what it controlled]
- Targeting: [who saw it, what percentage stages]

### Rollout timeline
| Date | Stage | Duration | Health status |
|------|-------|----------|---------------|
| ... | 0% → Internal | 2 days | ✅ Green |
| ... | Internal → 5% | 2 days | ✅ Green |
| ... | 5% → 100% | 3 days | ✅ Green |

### Health gate checks
- Sentry new issues at each stage: [count]
- P95 response time delta: [ms]
- Error rate delta: [%]

### Outcome
**Promoted to 100% / Rolled back** — [reason]

### Cleanup scheduled
[Date to remove the flag from code]
```
