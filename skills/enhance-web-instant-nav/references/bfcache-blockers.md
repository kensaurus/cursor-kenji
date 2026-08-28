# bfcache blockers

Test: DevTools → Application → Back/forward cache → Test.

| Reason (typical) | Fix |
|------------------|-----|
| `unload` listener | Use `pagehide` / `pageshow` |
| `Cache-Control: no-store` on HTML | Drop from HTML; keep on APIs |
| Open WebSocket | Close in `pagehide`; reopen on `pageshow` if `event.persisted` |
| Open IndexedDB transaction | Commit/abort before leave |
| `beforeunload` always on | Only while unsaved input exists |
| Busy service worker (some cases) | See `enhance-pwa` — don't claim the page if SW holds it |

```js
window.addEventListener('pagehide', (e) => {
  socket?.close();
});
window.addEventListener('pageshow', (e) => {
  if (e.persisted) reconnect();
});
```

Never add `unload`. A green DevTools test is required before claiming bfcache.
