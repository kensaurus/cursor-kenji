#!/usr/bin/env node
// Record a guided-tour GIF for any web app and inline it in the README.
//
// Mirrors the captureVideo() flow from the kensaur.us portfolio capture
// script, but generic: any URL, optional auth, optional viewport size,
// optional output directory. Produces a `.webm` (intermediate, deletable)
// and a `.gif` (the actual deliverable — autoplays inline on github.com).
//
// Usage:
//   node record-readme-tour.mjs --url=https://demo.example.com/ \
//     [--out=docs/screenshots/tour.gif] \
//     [--width=1280] [--height=800] \
//     [--duration=9000] [--fps=15] \
//     [--user=demo] [--pass=demo] \
//     [--keep-webm]
//
// The script:
//   1. Opens Chromium with recordVideo, navigates to URL.
//   2. Best-effort dismisses common onboarding overlays (intro.js, joyride,
//      shepherd.js, generic close icons, cookie banners, "Skip" / "Got it"
//      / "閉じる" buttons).
//   3. If --user/--pass given, fills the first email/text + password input
//      and submits.
//   4. Calculates real page geometry, executes a 4-stop scroll tour
//      (25 → 50 → 75 → 100% scrollHeight) with smooth transitions, OR
//      holds steady for a single-screen layout.
//   5. ffmpeg trims the dismiss/login prefix, then runs a two-pass GIF
//      conversion with palette dithering for the best size/quality ratio.
//
// Output size: at 800x500 @ 15 fps for a 9 s clip, expect 4-7 MB. GitHub's
// hard cap is 10 MB. Tune --width and --fps if you blow the budget.

import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...rest] = a.replace(/^--/, "").split("=");
    return [k, rest.length ? rest.join("=") : true];
  }),
);

const URL = args.url;
if (!URL || URL === true) {
  console.error("error: --url=<demo-url> is required");
  process.exit(1);
}

const OUT = resolve(args.out || "docs/screenshots/tour.gif");
const WIDTH = parseInt(args.width || "1280", 10);
const HEIGHT = parseInt(args.height || "800", 10);
const DURATION_MS = parseInt(args.duration || "9000", 10);
const FPS = parseInt(args.fps || "15", 10);
const USER = args.user;
const PASS = args.pass;
const KEEP_WEBM = !!args["keep-webm"];
// Comma-separated list of paths or absolute URLs to walk through after login.
// e.g. --routes=/,/reports,/fixes,/judge,/repo  → 5 stops, ~equal time each.
// When omitted the tour just scrolls the landing page (the original behaviour).
const ROUTES = (args.routes && args.routes !== true)
  ? String(args.routes).split(",").map((s) => s.trim()).filter(Boolean)
  : null;

// JSON object of localStorage entries to seed BEFORE the page loads. Use to
// pre-dismiss first-run tours, force a specific theme/density/admin-mode, or
// hide "what's new" popovers — anything the app gates on a localStorage key.
// e.g. --storage='{"mushi:mode":"advanced","mushi:tour-v1-completed":"true"}'
let STORAGE_SEED = null;
if (args.storage && args.storage !== true) {
  try {
    const parsed = JSON.parse(args.storage);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      STORAGE_SEED = parsed;
    }
  } catch (e) {
    console.error(`[tour][err] --storage must be valid JSON: ${e.message}`);
    process.exit(1);
  }
}

const SOFT_LIMIT_BYTES = 5 * 1024 * 1024;
const HARD_LIMIT_BYTES = 10 * 1024 * 1024;
const SETTLE_MS = 1500;
const MAX_RECORDING_MS = 35000;
const FFMPEG = ffmpegInstaller.path;

function log(...m) { console.log("[tour]", ...m); }
function warn(...m) { console.warn("[tour][warn]", ...m); }
function err(...m) { console.error("[tour][err]", ...m); }

function runCommand(bin, args) {
  return new Promise((resolveCmd, rejectCmd) => {
    const child = spawn(bin, args, { stdio: ["ignore", "inherit", "inherit"] });
    child.on("error", rejectCmd);
    child.on("exit", (code) => {
      if (code === 0) resolveCmd();
      else rejectCmd(new Error(`${bin} exited with code ${code}`));
    });
  });
}

// ── Dismiss common onboarding / cookie overlays before recording the tour. ──
// Mirrors the portfolio capture script's dismissOverlays() but trimmed to the
// patterns most likely to appear on a generic SaaS demo. Best-effort: every
// click is wrapped in .catch so a missing selector never aborts the run.
//
// `safe=true` skips the aggressive text-pattern fallback. Use safe mode after
// route navigation: app pages are full of inline ✕ icons for "dismiss row /
// remove tag / clear filter" that match the universal close-glyph regex but
// would trigger a real destructive action (e.g. dismissing a triage row,
// removing a project member). Pre-tour dismiss can stay aggressive — at that
// point the app is in its post-login default state and the only ✕ buttons
// are real modal close buttons.
async function dismissOverlays(page, { safe = false } = {}) {
  const selectors = [
    '[data-test-id="button-skip"]',         // react-joyride
    '.introjs-skipbutton',                  // intro.js
    '.driver-popover-close-btn',            // driver.js
    '.shepherd-cancel-icon',                // shepherd.js
    '[role="dialog"] [aria-label*="close" i]',
    'button[aria-label*="close" i]',
    'button[aria-label*="dismiss" i]',
    'button[aria-label*="skip" i]',
    '[id*="cookie" i] button',
    '[class*="cookie" i] button',
  ];
  const textPatterns = [
    /^skip\b/i, /^got it!?$/i, /^continue$/i, /^done$/i, /^close$/i,
    /^[\u00d7\u2715\u2716]$/, /^dismiss$/i, /^later$/i, /^no thanks$/i,
    /^accept all$/i, /^reject all$/i,
    /^閉じる$/, /^スキップ/, /^完了$/, /^OK$/i,
    /^guest$/i, /^try as guest$/i,
  ];
  // Press Escape first — almost every tour/modal lib (intro.js, driver.js,
  // shepherd.js, react-joyride, headlessui Dialog, Radix Dialog, custom
  // first-run tours) binds Esc-to-close. Way more reliable than guessing the
  // close-button selector. Cheap and idempotent.
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(150);

  for (let pass = 0; pass < 3; pass++) {
    let clicked = false;
    for (const sel of selectors) {
      const loc = page.locator(sel).first();
      if (await loc.isVisible({ timeout: 250 }).catch(() => false)) {
        await loc.click({ timeout: 1500, force: true }).catch(() => {});
        clicked = true;
        break;
      }
    }
    if (!clicked && !safe) {
      const candidates = await page
        .locator('button:visible, [role="button"]:visible, a:visible')
        .all()
        .catch(() => []);
      for (const btn of candidates) {
        const text = (await btn.textContent({ timeout: 250 }).catch(() => "")).trim();
        if (!text || text.length > 80) continue;
        if (textPatterns.some((re) => re.test(text))) {
          await btn.click({ timeout: 1500, force: true }).catch(() => {});
          clicked = true;
          break;
        }
      }
    }
    if (!clicked) break;
    await page.waitForTimeout(250);
  }
}

async function maybeLogin(page) {
  if (!USER || !PASS) return;
  const userInput = page
    .locator('input[type="email"], input[name*="email" i], input[name*="user" i], input[type="text"]')
    .first();
  const passInput = page.locator('input[type="password"]').first();
  if (!(await userInput.isVisible({ timeout: 1500 }).catch(() => false))) return;
  log("filling login form");
  await userInput.fill(USER).catch(() => {});
  await passInput.fill(PASS).catch(() => {});
  const submit = page
    .getByRole("button", { name: /sign\s*in|log\s*in|login|continue|submit|ログイン/i })
    .first();
  if (await submit.isVisible({ timeout: 800 }).catch(() => false)) {
    await submit.click({ timeout: 2000 }).catch(() => {});
  } else {
    await passInput.press("Enter").catch(() => {});
  }
  await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
}

// Settle the page after login: wait for late-appearing modals to mount,
// dismiss them, press Escape as a fallback. Returns wall-clock millis spent
// here so the caller can include this in the ffmpeg trim prefix and avoid
// a GIF that opens with a half-dismissed coach-mark.
async function performTourSettle(page) {
  const t0 = Date.now();
  // Late-appearing modals (first-run tours, post-login coach-marks, "what's
  // new" announcements) often mount via async useEffect AFTER the login
  // network call resolves — i.e. after maybeLogin's dismissOverlays already
  // ran. Wait a beat then sweep again so the tour doesn't end up filming a
  // still of a coach-mark.
  await page.waitForTimeout(1500);
  await dismissOverlays(page);
  // Send Escape one more time after the dismiss in case a late-mount modal
  // appeared between the wait and the click loop (e.g. a "what's new"
  // popover that fires only after the project list resolves).
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(500);
  return Date.now() - t0;
}

async function performTour(page, startMs) {
  // Multi-route tour: walk through a sequence of pages, dwelling on each
  // long enough to read the headline number. Way more compelling than
  // scrolling a single short dashboard. Resolves each entry against the
  // initial URL so callers can pass either absolute URLs or relative paths.
  if (ROUTES && ROUTES.length > 0) {
    const baseUrl = new globalThis.URL(URL);
    const perRouteMs = Math.max(
      1500,
      Math.floor((DURATION_MS - 500) / ROUTES.length),
    );
    log(`multi-route tour: ${ROUTES.length} stops · ${perRouteMs}ms each`);
    for (let i = 0; i < ROUTES.length; i++) {
      if (Date.now() - startMs > MAX_RECORDING_MS - 1500) break;
      const route = ROUTES[i];
      const target = /^https?:\/\//i.test(route)
        ? route
        : new globalThis.URL(route, baseUrl).toString();
      const isFirst = i === 0 && (route === "/" || target === URL);
      if (!isFirst) {
        // SPA-friendly navigation: prefer clicking an in-page link to the
        // target so React Router / Vue Router / SvelteKit handle it as a
        // client-side transition (no white flash, no full re-mount). Fall
        // back to a hard goto if no nav link exists for this path.
        const targetPath = new globalThis.URL(target).pathname;
        const navLink = page
          .locator(
            `a[href="${targetPath}"], a[href="${targetPath}/"], a[href$="${targetPath}"]`,
          )
          .first();
        const clicked = await navLink
          .isVisible({ timeout: 600 })
          .then((v) => (v ? navLink.click({ timeout: 2000 }).then(() => true).catch(() => false) : false))
          .catch(() => false);
        if (!clicked) {
          await page
            .goto(target, { waitUntil: "domcontentloaded", timeout: 15000 })
            .catch(() => {});
        }
        // Wait for the new route to settle. networkidle covers SPA data
        // fetches; the short timeout keeps a slow XHR from blowing the
        // per-route budget — most SPAs hit interactive in <1.5 s.
        await page.waitForLoadState("networkidle", { timeout: 2000 }).catch(() => {});
        // Best-effort dismiss any per-route modal/coach-mark that mounts on
        // navigation. Safe mode: selectors only — real app pages have inline
        // ✕ icons for "dismiss row / clear filter" that would otherwise get
        // hit by the close-glyph text regex and trigger destructive actions.
        await page.waitForTimeout(300);
        await dismissOverlays(page, { safe: true });
      }
      await page.waitForTimeout(perRouteMs);
    }
    return;
  }

  // Real geometry → editorial tour. Short pages dwell in place.
  const scrollHeight = await page
    .evaluate(() =>
      Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0),
    )
    .catch(() => HEIGHT);
  const maxScrollY = Math.max(0, scrollHeight - HEIGHT);
  const isShortPage = maxScrollY < HEIGHT * 0.5;

  const TOP_DWELL_MS = 1200;
  const STOP_DWELL_MS = 800;
  const SMOOTH_SCROLL_MS = 600;
  const RETURN_DWELL_MS = 1000;

  if (isShortPage) {
    // Single-screen layout — hold steady. Better than jittering a non-scrolling page.
    await page.waitForTimeout(DURATION_MS - 500);
    return;
  }

  await page.waitForTimeout(TOP_DWELL_MS);
  const stops = [0.25, 0.5, 0.75, 1.0];
  for (const pct of stops) {
    if (Date.now() - startMs > MAX_RECORDING_MS - 1500) break;
    const target = Math.round(maxScrollY * pct);
    await page.evaluate(
      ({ y, ms }) => {
        return new Promise((res) => {
          const start = window.scrollY;
          const dist = y - start;
          const t0 = performance.now();
          function step(now) {
            const t = Math.min(1, (now - t0) / ms);
            const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            window.scrollTo(0, start + dist * eased);
            if (t < 1) requestAnimationFrame(step);
            else res();
          }
          requestAnimationFrame(step);
        });
      },
      { y: target, ms: SMOOTH_SCROLL_MS },
    ).catch(() => {});
    await page.waitForTimeout(STOP_DWELL_MS);
  }
  // Return to hero so the loop end matches the loop start visually.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" })).catch(() => {});
  await page.waitForTimeout(RETURN_DWELL_MS);
}

async function recordWebm(tmpDir) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    recordVideo: { dir: tmpDir, size: { width: WIDTH, height: HEIGHT } },
  });
  // Seed localStorage BEFORE any page script runs. Playwright's addInitScript
  // injects into every navigation in this context, so the values are present
  // on the very first React render — perfect for skipping first-run tours,
  // forcing dark mode, or unlocking advanced UI on a fresh test account.
  if (STORAGE_SEED) {
    const entries = JSON.stringify(STORAGE_SEED);
    await ctx.addInitScript(`(() => {
      try {
        const e = ${entries};
        for (const k of Object.keys(e)) {
          const v = e[k];
          window.localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        }
      } catch {}
    })();`);
    log(`seeded localStorage: ${Object.keys(STORAGE_SEED).join(", ")}`);
  }

  const page = await ctx.newPage();
  const startMs = Date.now();

  log(`navigating to ${URL}`);
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(SETTLE_MS);

  await dismissOverlays(page);
  await maybeLogin(page);

  // performTour does its own late-overlay sweep first; mark the prefix AFTER
  // that sweep so the GIF doesn't lead with a half-dismissed coach-mark.
  // performTour returns the wall-clock millis it spent settling the page so
  // we can fold that into the prefix the ffmpeg trim seeks past.
  const settleStart = Date.now();
  const settleMs = await performTourSettle(page);
  const settleSec = settleMs / 1000;
  const prefixSec = (settleStart - startMs) / 1000 + settleSec;
  log(`prefix ${prefixSec.toFixed(2)}s — running guided tour`);

  await performTour(page, startMs);

  await page.close();
  await ctx.close();
  await browser.close();

  // The webm filename is decided by Playwright; pick the latest .webm in tmpDir.
  const entries = (await readdir(tmpDir)).filter((f) => f.endsWith(".webm"));
  if (entries.length === 0) throw new Error("no .webm produced — recording context never closed?");
  const rawWebm = join(tmpDir, entries[entries.length - 1]);
  return { rawWebm, prefixSec };
}

async function convertToGif(rawWebm, prefixSec) {
  await mkdir(dirname(OUT), { recursive: true });
  // Two-pass palette generation gives an order-of-magnitude better quality
  // at a given size than the single-pass default. The dither=bayer:bayer_scale=5
  // pattern is the recommended setting from ffmpeg's gif documentation —
  // smooth gradients without the speckled "diff" stats_mode artifacts.
  const filter =
    `fps=${FPS},scale=${WIDTH}:-1:flags=lanczos,` +
    `split[s0][s1];[s0]palettegen=stats_mode=diff[p];` +
    `[s1][p]paletteuse=dither=bayer:bayer_scale=5`;
  log(`converting webm → gif (${WIDTH}px @ ${FPS} fps, ${(DURATION_MS / 1000).toFixed(1)} s)`);
  await runCommand(FFMPEG, [
    "-y",
    "-ss", prefixSec.toFixed(2),
    "-i", rawWebm,
    "-t", String(DURATION_MS / 1000),
    "-vf", filter,
    "-loop", "0",
    "-loglevel", "error",
    OUT,
  ]);
}

(async () => {
  if (!existsSync(FFMPEG)) {
    err(`ffmpeg binary missing at ${FFMPEG} — re-install @ffmpeg-installer/ffmpeg`);
    process.exit(1);
  }
  const tmpDir = resolve(`.tour-tmp-${Date.now()}`);
  await mkdir(tmpDir, { recursive: true });
  try {
    const { rawWebm, prefixSec } = await recordWebm(tmpDir);
    await convertToGif(rawWebm, prefixSec);
    if (KEEP_WEBM) {
      const keptWebm = OUT.replace(/\.gif$/, ".webm");
      await runCommand("cp", [rawWebm, keptWebm]).catch(async () => {
        // cp is missing on Windows shells; fall back to a node-native copy.
        const buf = await import("node:fs/promises").then((m) => m.readFile(rawWebm));
        await writeFile(keptWebm, buf);
      });
      log(`kept webm at ${keptWebm}`);
    }

    const { size } = statSync(OUT);
    const mb = size / 1024 / 1024;
    log(`wrote ${OUT} (${mb.toFixed(2)} MB)`);
    if (size > HARD_LIMIT_BYTES) {
      err(`gif is ${mb.toFixed(2)} MB — exceeds GitHub's 10 MB inline cap. Re-run with smaller --width or lower --fps.`);
      process.exit(2);
    }
    if (size > SOFT_LIMIT_BYTES) {
      warn(`gif is ${mb.toFixed(2)} MB (>${(SOFT_LIMIT_BYTES / 1024 / 1024).toFixed(0)} MB). Consider lowering --width or --fps for faster repo clones.`);
    }
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
})().catch((e) => {
  err(e.stack || e.message || String(e));
  process.exit(1);
});
