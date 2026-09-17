---
name: docs-launch-kit
description: >
  Versioned launch kit from the repo's real features: Show HN post, Product
  Hunt listing, Reddit / X / LinkedIn posts, article outline, release notes,
  calendar with UTM links. Use when "launch post", "Show HN", "Product Hunt
  listing", "announce this release", "launch copy". README visuals →
  enhance-readme.
license: MIT
---

# docs-launch-kit — Launch copy that survives the comments

**Degree of freedom: MIXED.** Angle and voice `[HIGH freedom]`; facts from
the repo, per-channel format rules, and the no-solicitation ban
`[LOW freedom — run exactly]`.

Apply-now. Produces `docs/launch/<version>.md` (or the path the repo already
uses) with one angle, per-channel copy, UTM links, and a calendar. A launch is
a **cadence** — every meaningful release gets a kit — so the file is versioned,
not overwritten.

## This skill vs neighbors

| Skill | Owns |
|---|---|
| **docs-launch-kit** (this) | Announcement copy per channel + calendar + UTMs |
| `enhance-readme` | README hero, screenshots, badges |
| `docs-writer` | Reference docs, changelog entries, long-form articles |
| `plan-antislop` | Voice audit when the copy reads generated |
| `enhance-web-seo` | Titles/meta for the pages the posts link to |
| `plan-gtm` | Which channels and which ICP — this skill writes for that decision |
| `deploy-npm` / `workflow-ship-and-observe` | The release itself |

Do **not** fire for "write the changelog" alone → `docs-writer`.

## How to reason

1. **Angle** — one problem the ICP recognizes, stated before the product name
2. **Evidence** — every claim maps to a file, a changelog line, or a number that can be checked
3. **Format** — each channel gets its native shape; nothing is cross-posted verbatim
4. **Calendar** — sequence and timing; who answers comments and for how long
5. **Measure** — UTM per channel; success is signups and activation, not points

## Worked example

> **Angle:** "Coding agents call it done when it compiles" — not "145 skills".
> **Evidence:** `complete-everything` state file + `completion-judge` agent exist
> in `skills/`; 3.6k npm downloads from `npm view`; no star count claimed.
> **Format:** Show HN title states the mechanism; first comment explains why it
> was built and what it does not do. PH tagline ≤60 chars, three gallery shots
> from `docs/screenshots/`. Reddit r/cursor post leads with the failure story.
> **Calendar:** HN Tuesday 13:00 UTC; PH the following week; Reddit on release
> day; reply window 2 h for HN, all day for PH.
> **Measure:** `?utm_source=hn&utm_medium=post&utm_campaign=v1.35`; report
> signups per channel after 7 days.

## Self-critique before reporting

- **Angle first** — every post opens with the problem, not the product or a count
- **Checked facts** — each number and feature in the copy was verified this session
- **Native format** — HN copy has no marketing adjectives; PH copy fits its fields; Reddit follows the subreddit rules quoted in the file
- **No solicitation** — no "upvote us" links, vote rings, or DMs asking for votes
- **Disclosure** — the maker is identified as the maker on every channel
- **Right owner** — README visuals → `enhance-readme`; changelog → `docs-writer`

---

## Procedure

### 1. Gather facts  [LOW freedom — run exactly]

Read `CHANGELOG.md` (or the release diff), README hero, `package.json`
version, screenshots directory, and any live numbers (`npm view`, store
listing, analytics). Build a **claims table**: `Claim | Source | Verified`.
Copy may use only verified rows.

### 2. Pick the angle  [HIGH freedom]

One sentence the ICP would say about their own problem. Test: does it still
work with the product name removed? Lead with what **changed** for the reader,
never with counts, "excited to announce", or the tech stack.

### 3. Write per channel  [LOW freedom — formats; HIGH freedom — words]

| Channel | Shape | Rules that matter in 2026 |
|---|---|---|
| **Show HN** | `Show HN: <what it does, plainly>` + first comment: why built, how it works, trade-offs, what it does not do, one ask | Official rules: a runnable thing, no signup wall or waitlist, human-written (AI-written posts are removed), never solicit votes; sober tone, no adjectives; answer every comment for 2 h; only ~11% of Show HN posts clear 10 points — the thread is the asset even when the front page misses |
| **Product Hunt** | tagline ≤60 chars; description; 3–5 gallery images or a 30-s demo; maker first comment; hunter or self-hunt | Featured rate ~10%; 1–2% visit→signup for B2B; credibility and feedback, not acquisition; launch after real users exist; relaunch per major version |
| **Reddit** | subreddit-specific post: story → what it does → link in comments if rules require | Quote the subreddit rules in the kit; value-first; one subreddit per day |
| **X / Bluesky / LinkedIn** | hook line → 15-s demo or screenshot → link; LinkedIn in first person, longer | External links are throttled on X — the demo clip travels, the link rides in a reply; one thread, not five; reply to every quote |
| **dev.to / Hashnode / blog** | problem → approach → code → what you would change → link | Canonical URL to your domain; this is the SEO asset; one honest piece beats a batch of generated ones (Google scaled-content policy) |
| **Release notes as announcement** | Changelog section rewritten for users: what you can do now | Ships with the tag; link from every other post |
| **Newsletter / Discord** | short, personal, one link | Existing users first — they retell it |

### 4. Calendar  [HIGH freedom]

Sequence: existing users → Show HN (Tue–Thu, 12–17 UTC) → community posts →
Product Hunt a week later when social proof exists → article the following
week. Name who watches comments and for how long. Put the next release's
kit date at the bottom.

### 5. Links and measurement  [LOW freedom — run exactly]

`?utm_source=<channel>&utm_medium=post&utm_campaign=<version>` on every
link; one row per channel in the kit's **Results** table: visits, signups,
activated, notes — filled after 7 days. Channel numbers to judge against
(Show HN front page 5–30k visits / 50–400 signups; Product Hunt 1–2% B2B
signup) live in `plan-gtm/references/benchmarks-2026.md`.

### 6. Output

```markdown
# Launch kit — <product> <version> — <date>
## Angle
## Claims table
## Show HN
## Product Hunt
## Reddit — r/<name> (rules: …)
## X / Bluesky / LinkedIn
## Article outline
## Release notes (user-facing)
## Calendar
## Results (fill after 7 days)
```

## Guardrails

- **No vote solicitation.** No upvote asks, rings, or DMs — HN and PH both penalize it.
- **No fabricated proof.** Testimonials, numbers, and logos come from the claims table.
- **Disclose.** The maker posts as the maker.
- **No cross-post spam.** One native post per channel; respect each community's rules.
- **Voice check.** If a paragraph could be any product's launch, rewrite or send to `plan-antislop`.

## Chains with

- **`plan-gtm`** → channel plan and ICP this kit writes for.
- **`enhance-readme`** → README hero and screenshots the posts link to.
- **`enhance-web-seo`** → the article and landing page it links.
- **`iterate-post-launch`** → reads the Results table one week later.
