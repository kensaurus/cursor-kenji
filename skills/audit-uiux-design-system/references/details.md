### Microinteraction Coverage

| Element | Hover | Focus | Active | Loading | Disabled | Status |
|---------|-------|-------|--------|---------|----------|--------|
| Buttons | [y/n] | [y/n] | [y/n] | [y/n] | [y/n] | [pass/warn/fail] |
| Links | [y/n] | [y/n] | [y/n] | — | — | [pass/warn/fail] |
| Cards | [y/n] | [y/n] | [y/n] | — | — | [pass/warn/fail] |
| Inputs | — | [y/n] | — | — | [y/n] | [pass/warn/fail] |
| Modals | enter | exit | — | — | — | [pass/warn/fail] |
| Toasts | enter | — | dismiss | auto | — | [pass/warn/fail] |

---

### Visual Personality Assessment

| Trait | Score (1-5) | Evidence |
|-------|-------------|----------|
| Typography personality | [1-5] | [serif/sans contrast, weight variety, scale jumps] |
| Layout variety | [1-5] | [different section layouts vs repeated grids] |
| Color restraint | [1-5] | [accent used sparingly vs painted everywhere] |
| Spacing rhythm | [1-5] | [intentional variation vs mechanical uniformity] |
| Border radius intention | [1-5] | [varied by context vs same everywhere] |
| Shadow depth hierarchy | [1-5] | [multiple levels vs flat/uniform] |
| **AI-Generated Feel?** | [YES/NO] | [specific tells found] |

---

### Dark Mode & Animation

| Category | Status | Issues |
|----------|--------|--------|
| Token switching | [pass/warn/fail] | [details] |
| Hardcoded colors | [pass/warn/fail] | [count] violations |
| Reduced motion | [pass/warn/fail] | [details] |
| Easing variety | [pass/warn/fail] | [all same vs appropriate per context] |
| Duration variety | [pass/warn/fail] | [appropriate per interaction type] |
| Stagger animations | [pass/warn/fail] | [lists/grids animate with stagger?] |

---

### Page-by-Page Summary

| Page | Tokens | Components | Visual A11y | Dark Mode | Overall |
|------|--------|------------|-------------|-----------|---------|
| / | pass | pass | warn | pass | Good |
| /dashboard | warn | fail | fail | warn | Needs Work |

---

### Research Findings Applied
- [Pattern from research]: [how it applies]

---

### Critical Issues (Must Fix)

#### 1. [Component/Page] — [Issue]
- **Problem:** [description]
- **Impact:** [visual consistency / a11y / dark mode]
- **Fix:** [specific code change]

---

### Next Steps

1. [ ] Replace raw HTML with shared components: [list]
2. [ ] Remove arbitrary token values: [list]
3. [ ] Fix dark mode violations: [list]
4. [ ] Add reduced motion support: [list]
```
