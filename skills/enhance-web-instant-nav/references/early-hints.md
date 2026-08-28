# 103 Early Hints — per platform

Emit on **HTML** only. ≤ ~5 `Link` values. Never hint per-user URLs.

```
Link: </hero.avif>; rel=preload; as=image; fetchpriority=high
Link: <https://cdn.example>; rel=preconnect
```

## Verify

```bash
curl -sv https://example.com/ 2>&1 | grep -E "< HTTP/.* 103"
```

## Node / Next custom server

```js
res.writeEarlyHints({
  link: [
    '</hero.avif>; rel=preload; as=image; fetchpriority=high',
    '<https://cdn.example>; rel=preconnect',
  ],
});
```

## CDN

- **Cloudflare:** Early Hints toggle; reads origin `Link` headers
- **Fastly:** `http_status 103` + `Link` in VCL / Compute
- **Nginx:** `http2_push` is not 103; use a CDN or OpenResty module that emits 103

103 is wasted if the LCP image is still lazy or not in HTML.
