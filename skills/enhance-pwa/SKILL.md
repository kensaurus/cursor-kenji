---
name: enhance-pwa
description: >-
  Add or upgrade PWA features to any web app: service worker, offline mode,
  install prompt, push notifications, and background sync. Detects existing
  manifest and service worker setup. Installs and configures the right tooling
  for the framework (Vite PWA plugin, next-pwa, Workbox). Runs a Playwright
  Lighthouse audit to measure the PWA score before and after. Compatible with
  Capacitor hybrid apps — bridges PWA web layer with native shell without
  conflicts. Generic across any web framework. Use when asked to "make it a
  PWA", "offline support", "install prompt", "push notifications", "service
  worker", "add to home screen", "background sync", "Lighthouse PWA score",
  "app-like experience", "installable", or "works offline".
license: MIT
---

# enhance-pwa — Make It Installable and Offline-Ready

**A PWA closes the gap between "website" and "app".** Users can install it to
their home screen, it loads instantly from cache, and it keeps working when the
network drops. This skill adds those capabilities to any existing web app without
breaking what already works.

---

## Phase 0: Audit what already exists

```
public/manifest.json or public/manifest.webmanifest  → existing manifest
public/sw.js or src/sw.ts                             → existing service worker
vite.config.*   → vite-plugin-pwa already configured?
next.config.*   → next-pwa already configured?
package.json    → workbox-*, vite-plugin-pwa, next-pwa, @vite-pwa/nuxt
```

Also check the current Lighthouse PWA score via:
```javascript
// browser_evaluate after browser_navigate
const pwaReady = {
  manifest: !!document.querySelector('link[rel="manifest"]'),
  sw: 'serviceWorker' in navigator,
  https: location.protocol === 'https:' || location.hostname === 'localhost',
};
```

---

## Phase 1: Research framework-specific PWA tooling

```json
CallMcpTool(server: "user-firecrawl", toolName: "firecrawl_search", arguments: {
  "query": "<framework> PWA service worker offline 2026 vite-plugin-pwa",
  "limit": 3,
  "sources": [{ "type": "web" }]
})
```

Fetch the official docs for the relevant PWA plugin via Context7:
```json
CallMcpTool(server: "plugin-context7-plugin-context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "vite-plugin-pwa"
})
```

---

## Phase 2: Web App Manifest

The manifest is what makes the app installable. Create or improve
`public/manifest.webmanifest`:

```json
{
  "name": "Full App Name",
  "short_name": "Short Name",
  "description": "One sentence about what the app does",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#6366f1",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable any" }
  ],
  "screenshots": [
    { "src": "/screenshots/home.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/screenshots/home-mobile.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

Reference the manifest in `<head>`:
```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#6366f1" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

**Icon requirements:**
- 192×192 and 512×512 minimum; add 180×180 for Apple Touch Icon
- PNG with transparent background OR maskable (safe zone = inner 80%)
- Generate from a single source SVG using `sharp` or `pwa-asset-generator`

---

## Phase 3: Service Worker — caching strategy

Use **Workbox** (via the framework plugin) rather than writing raw service
worker code. Choose the right caching strategy per asset type:

| Asset type | Strategy | Why |
|------------|----------|-----|
| App shell (HTML/JS/CSS) | CacheFirst + revision hash | Fast loads, updated on deploy |
| API data (list/detail) | NetworkFirst with 5s timeout | Fresh data, offline fallback |
| Images | CacheFirst, 30-day expiry | Rarely changes |
| Fonts | CacheFirst, 1-year expiry | Never changes |
| Analytics/telemetry | NetworkOnly | No value in caching |

### Vite (vite-plugin-pwa)

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\/api\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 5,
        },
      },
    ],
  },
  manifest: { /* inline or separate file */ },
})
```

### Next.js (next-pwa or built-in)

Next.js 15+ has experimental PWA support. For stable Workbox integration:
```bash
npm install @ducanh2912/next-pwa
```

```javascript
// next.config.mjs
import withPWA from '@ducanh2912/next-pwa';
export default withPWA({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
})({ /* rest of next config */ });
```

### Capacitor compatibility

If the app also ships as a Capacitor native app, the service worker must not
intercept Capacitor's bridge requests. Add to the service worker:

```javascript
// Do not cache Capacitor bridge calls
if (event.request.url.includes('capacitor://') ||
    event.request.url.includes('ionic://')) {
  return; // let it pass through
}
```

---

## Phase 4: Offline page and graceful degradation

When the network is unavailable and a cached response does not exist, show a
helpful offline page rather than a browser error:

```html
<!-- public/offline.html -->
<h1>You are offline</h1>
<p>Check your connection and try again. Pages you have visited recently will still load.</p>
<button onclick="location.reload()">Try again</button>
```

Register it as the fallback in Workbox:
```javascript
offlineFallback: true,
// or in workbox config:
navigationFallback: '/offline.html',
```

---

## Phase 5: Install prompt (optional but high-value)

Do not use the browser's default install prompt — it appears at the wrong time.
Instead, intercept `beforeinstallprompt` and show it when the user has
demonstrated value (e.g. after completing a core action):

```typescript
// hooks/useInstallPrompt.ts
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
});

export function triggerInstallPrompt() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
}
```

Show a custom banner with clear benefits ("Install for offline access and faster loads"),
not just "Add to Home Screen".

---

## Phase 6: Push notifications (if backend supports it)

Only implement push if the app has a genuine reason to send notifications
(not just to ask for permission on first load — users will deny that).

```typescript
async function subscribeToPush(userId: string) {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY!),
  });
  // Save subscription to backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({ userId, subscription }),
  });
}
```

For the backend, use `web-push` (Node.js) or your platform's push service.

---

## Phase 7: Verify with Lighthouse (Playwright)

```javascript
// Run Lighthouse via browser_evaluate
// (Playwright does not run Lighthouse natively — use Chrome DevTools Protocol)
const { lhr } = await page.evaluate(() => {
  return new Promise((resolve) => {
    // Trigger Lighthouse via CDP if available in the test environment
    // Otherwise, use the Lighthouse CLI:
    // npx lighthouse http://localhost:3000 --output json --output-path ./lh-report.json
  });
});
```

Or run Lighthouse via CLI and check the PWA category score:
```bash
npx lighthouse http://localhost:3000 \
  --output json --output-path .playwright-mcp/lh-report.json \
  --chrome-flags="--headless" 2>&1 | tail -5
```

Target PWA score: **≥ 90**. Key checks:
- [ ] Manifest present and installable
- [ ] Service worker registered
- [ ] Works offline (offline page or cached response)
- [ ] HTTPS (localhost counts)
- [ ] `viewport` meta tag present
- [ ] Icons correct size and format
- [ ] `start_url` loads while offline

---

## Guardrails

- **Service worker caching can break deployments** if old caches persist.
  Always use `registerType: 'autoUpdate'` (Workbox prompts the user to reload
  when a new version is available) rather than silent background updates that
  serve stale code.
- **Never cache auth tokens or sensitive API responses** in the service worker.
- **Test offline mode manually** via DevTools → Network → Offline before shipping.
- **Capacitor apps**: confirm the Capacitor bridge still works after adding the
  service worker by running `mobile-emulator-test`.
