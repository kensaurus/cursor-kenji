---
name: audit-i18n
description: >-
  Audit and fix internationalisation for any web or mobile app. Finds hardcoded
  user-facing strings, checks they are extracted to i18n keys, and reviews
  translation quality: natural tone that sounds like a real person wrote it,
  locale-appropriate phrasing (not literal translation), consistent voice,
  helpful error messages that guide rather than blame, and action labels that
  say what actually happens. Walks the live app in each locale via Playwright.
  Uses Firecrawl for i18n best practices, Context7 for library docs. Works with
  react-i18next, i18next, next-intl, vue-i18n, and any other library. Use when
  asked to "audit i18n", "fix translations", "add locale", "natural language",
  "translation quality", "hardcoded strings", "localisation", or "the Japanese
  feels like Google Translate".
license: MIT
---

# audit-i18n — Natural, Human-Sounding Translations

**Translations that read like machine output erode user trust** — especially in
the user's own language. A Japanese user reading stiff, over-literal English
translated to Japanese can feel it immediately. This skill finds every unnatural,
jargon-heavy, or technically-worded string and rewrites it to sound like a real
person in that locale.

> **The goal**: every string should sound like it was written by a native speaker
> who understands the user, not translated from English by a developer.

---

## Core principles for good copy

These apply to every string in every locale:

| Bad | Better | Why |
|-----|--------|-----|
| "Invalid email format" | "That email doesn't look right — check for typos" | Guides, doesn't blame |
| "An error occurred" | "Something went wrong. Try again, or contact us if it keeps happening" | Actionable |
| "Please enter a valid value" | "This field is required" or "Enter a number between 1 and 100" | Specific |
| "Authentication failed" | "Wrong email or password" | Plain language |
| "Submit" | "Save", "Send message", "Create account" | Says what actually happens |
| "OK" | "Got it", "Done", or the specific action | Less dismissive |
| "User" | "you", "your account" | Conversational |
| "The operation was successful" | "Done!" or "Saved" | Natural |
| "Do you want to proceed?" | "Are you sure? This can't be undone." | Honest and specific |

---

## Phase 0: Detect the i18n setup

```
package.json   → i18next, react-i18next, next-intl, vue-i18n, @angular/localize,
                 i18n-js, rosetta, lingui, typesafe-i18n
src/i18n/      → translation files
locales/       → JSON/YAML translation files
messages/      → next-intl message files
public/locales → common path for react-i18next
```

Identify:
- **Library**: react-i18next / next-intl / vue-i18n / lingui / custom
- **Active locales**: list of language codes (`en`, `ja`, `fr`, `de`, `zh`, etc.)
- **Translation file format**: JSON / YAML / TypeScript / PO files
- **Completeness**: are all locales present? Do non-English files have all keys?

Fetch library docs:
```json
CallMcpTool(server: "plugin-context7-plugin-context7", toolName: "resolve-library-id", arguments: {
  "libraryName": "react-i18next"
})
```

---

## Phase 1: Find hardcoded strings in source code

Look for user-facing text that bypasses the i18n system entirely.

Scan for:
- String literals in JSX/TSX: `<p>Welcome back</p>`, `<button>Save</button>`
- Template literals with user-visible content: `` `Hello ${name}` ``
- Alert/toast calls with hardcoded strings: `toast.error("Something failed")`
- Error message strings in API handlers returned to the client
- Placeholder text: `placeholder="Enter your email"`
- Aria labels: `aria-label="Close dialog"`
- `alt` text on meaningful images

Use shell to scan (the codebase search tools may be slow on large repos):
```bash
grep -rn 'placeholder="' src/ --include="*.tsx" --include="*.jsx" | head -30
grep -rn '"en":' src/ --include="*.ts" --include="*.tsx" | head -20
```

Build a list: file path, line number, string content, whether it has an i18n key already.

---

## Phase 2: Audit translation file completeness

For each locale, check that all keys from the base locale (usually `en`) exist:

```bash
# Example: compare en.json vs ja.json key counts
node -e "
const en = require('./public/locales/en/common.json');
const ja = require('./public/locales/ja/common.json');
const missing = Object.keys(en).filter(k => !ja[k]);
console.log('Missing in ja:', missing);
"
```

Or for next-intl format:
```bash
node -e "
const en = require('./messages/en.json');
const ja = require('./messages/ja.json');
function findMissing(base, target, path='') {
  for (const k of Object.keys(base)) {
    const kp = path ? path+'.'+k : k;
    if (!(k in target)) console.log('MISSING:', kp);
    else if (typeof base[k] === 'object') findMissing(base[k], target[k], kp);
  }
}
findMissing(en, ja);
"
```

---

## Phase 3: Review translation quality

This is the most important phase. For each locale, review every string
against the natural-language principles at the top of this skill.

### What to look for in each category

**Error messages** — must guide, not blame, and tell the user what to do:
```json
// Before
"errors.email_invalid": "Invalid email address"

// After
"errors.email_invalid": "That doesn't look like a valid email — check for typos and try again"
```

**Action buttons** — must describe the outcome, not just label the input:
```json
// Before
"buttons.submit": "Submit"
"buttons.confirm": "OK"

// After
"buttons.submit": "Save changes"  // or whatever the action actually does
"buttons.confirm": "Got it"       // or the specific action: "Delete account", "Send message"
```

**Empty states** — should explain and invite, not just state the absence:
```json
// Before
"empty.projects": "No projects"

// After
"empty.projects": "You haven't created any projects yet. Start one to get going."
```

**Success messages** — should feel warm and confirm the action clearly:
```json
// Before
"success.saved": "Data saved successfully"

// After
"success.saved": "Saved!"  // or "Your changes are saved"
```

**Loading states** — should be human:
```json
// Before
"loading.data": "Loading data..."

// After
"loading.data": "Getting things ready…"  // or just omit "Loading" entirely
```

### Locale-specific tone guidelines

| Locale | Tone notes |
|--------|-----------|
| `en` | Friendly, direct, conversational. Use contractions ("you've", "can't"). No formal passive voice. |
| `ja` | Use polite but natural keigo (〜ます/〜です form). Avoid literal translations of English idioms. Use short, clear sentences. Don't overuse katakana loanwords when Japanese alternatives exist. |
| `ko` | Polite 합쇼체 or 해요체 depending on the app's audience. Avoid Konglish where natural Korean exists. |
| `zh-TW` / `zh-CN` | Traditional vs simplified — do not mix. Natural, not literal. Check that date/number formats are locale-correct. |
| `fr` | Formal `vous` for most apps; `tu` only for clearly youth/casual products. Gender agreement must be correct — check nouns. |
| `de` | German compounds can get long — check for truncation. Formal `Sie` for business apps. |
| `es` | Check for `tú`/`usted`/`vosotros` consistency. Latin American vs Spain variants differ. |
| RTL (`ar`, `he`) | Mirror layout. Check that numbers are LTR within RTL text. Verify UI wraps correctly. |

---

## Phase 4: Walk the live app in each locale (Playwright)

For each active locale:

1. Navigate to the locale-specific URL or trigger the locale switcher
2. Walk the key flows: onboarding, core feature, error states, empty states, settings
3. Screenshot each screen for visual review

```javascript
// Set locale via URL or cookie depending on the app
await page.goto('http://localhost:3000/ja'); // or set cookie
await browser_snapshot(); // capture the state
```

Look for:
- Strings that are still in English (untranslated keys showing as key names like `common.save`)
- Text that overflows its container in longer languages (German, Finnish, Russian)
- Date/time formatting that doesn't match the locale (30/01/2026 vs Jan 30, 2026 vs 2026年1月30日)
- Currency symbols in the wrong position (`$10.00` vs `10,00 €` vs `¥1,000`)
- Numbers using the wrong decimal/thousands separator (1,234.56 vs 1.234,56)
- Plural forms: English has singular/plural; many languages have more forms

---

## Phase 5: Fix — priority order

### Fix 1: Extract all hardcoded strings

For every hardcoded string found in Phase 1, create an i18n key and replace it:

```typescript
// Before (react-i18next)
<p>Welcome back, {name}!</p>

// After
const { t } = useTranslation('common');
<p>{t('welcome_back', { name })}</p>
```

```json
// en/common.json
"welcome_back": "Welcome back, {{name}}!"

// ja/common.json
"welcome_back": "おかえりなさい、{{name}}さん！"
```

### Fix 2: Rewrite poor translations

Edit the translation files directly. Prioritise:
1. Error messages that blame or confuse users
2. Empty states that dead-end users
3. Action buttons that say "Submit" or "OK"
4. Any string a native speaker would read and say "that's not how we talk"

### Fix 3: Add missing locale keys

For any key missing in a non-English locale, add a natural translation.
If you don't have a native speaker for a locale, use a clearly-marked placeholder:
```json
"some_key": "[TODO: needs native Japanese review] {{count}} items selected"
```

### Fix 4: Fix number/date/currency formatting

Use the i18n library's format functions rather than manual formatting:

```typescript
// react-i18next with i18next-icu or i18next-intervalPlural
t('items_count', { count: 5 }) // handles plural forms automatically

// Intl API for dates and numbers (framework-agnostic)
new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(date);
new Intl.NumberFormat(locale, { style: 'currency', currency: 'JPY' }).format(1234);
```

---

## Phase 6: i18n audit report

```markdown
## i18n Audit Report — [App] — [Date]

### Active locales
[list with coverage % — keys present / total keys]

### Hardcoded strings found
| File | Line | String | Action |
|------|------|--------|--------|
| src/components/Foo.tsx | 42 | "Save" | Extracted to key `buttons.save` |

### Translation quality issues fixed
| Locale | Key | Before | After | Issue type |
|--------|-----|--------|-------|-----------|
| ja | errors.email_invalid | "無効なメールアドレス" | "メールアドレスが正しくないようです。入力内容をご確認ください。" | Too literal, not helpful |

### Missing keys added
[count per locale]

### Formatting fixes
[date/number/currency issues found and fixed]

### Still needs native review
[keys marked [TODO] that need a human native speaker]
```
