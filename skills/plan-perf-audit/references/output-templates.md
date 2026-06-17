# Output Templates

## Measured baselines

| Layer | Metric | Tool | Current | Target | `[NEEDS PROFILING]` |
|-------|--------|------|---------|--------|---------------------|
| Web CWV | LCP / CLS / INP | Lighthouse/RUM | … | … | |
| Bundle | initial JS KB | analyzer | … | budget | |
| RN | cold start ms | profiler | … | <2000 | |
| API | p95 ms | Sentry/logs | … | … | |
| DB | slow queries | EXPLAIN/advisors | … | … | |

## Burndown

| Layer | Issue | Metric/Evidence | Current | Target | Fix | Severity | Effort | Risk | Path/Query |

P0 = user jank / >Xs load / N+1 on hot path · P3 = micro-opt

## Phased optimization plan

1. Measured P0 hot-path wins (N+1, oversized bundle, main-thread block)
2. Structural (code-split, indexing, caching, async I/O)
3. Polish (images, micro-memo)

Each fix: expected gain + "what must keep working"

## Guardrails checklist

- [ ] Lighthouse CI performance budgets
- [ ] RUM / web-vitals pipeline
- [ ] Bundle size budget in CI
- [ ] Re-measure gate on perf PRs
