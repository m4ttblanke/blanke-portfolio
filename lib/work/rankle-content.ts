// RANKLE CASE STUDY — content source of truth (M5A).
//
// SOURCE MAP (§55: a concise map, not a bureaucracy). Every fact below traces
// to one of these, inspected 2026-09-23:
//
//   [README]   github.com/m4ttblanke/rankle README.md (public repo, verified
//              via `gh repo view`; solo author, confirmed via
//              `gh api repos/m4ttblanke/rankle/contributors`)
//   [SECURITY] github.com/m4ttblanke/rankle docs/SECURITY.md
//   [DESIGN]   github.com/m4ttblanke/rankle docs/DESIGN.md
//   [FILES]    direct inspection of a shallow clone: supabase/migrations/
//              (15 files), lib/**/*.test.ts + components/**/*.test.tsx
//              (36 files), e2e/*.spec.ts (12 files), supabase/tests/ (1 SQL
//              spec), .github/workflows/ci.yml (5 jobs: static, build,
//              vitest, sql, playwright), public/brand/ (rankle-icon.png,
//              rankle-apple-icon.png, rankle-mark.svg), package.json
//   [LIVE]     `curl -I https://rankle.io` -> HTTP/2 200, server: Vercel
//   [REPO]     `gh api repos/m4ttblanke/rankle` -> created 2026-09-03,
//              pushed 2026-09-18, public, single contributor
//   [PORTFOLIO] docs/ART_DIRECTION.md §16, app/globals.css .wall-rankle,
//              components/work/rankle-poster.tsx (M4's own established
//              Rankle palette and tier-band language — reused, not
//              reinvented, per the M5A brief §12)
//
// What is DELIBERATELY NOT here, because it isn't verified: user/traffic
// counts, revenue, testimonials or quotes, a specific "number of tests"
// (file counts are exact and verified; pass/fail counts are not, and would
// go stale — [FILES] gives categories instead, per the brief's own
// guidance), and any feature only found in docs/TODO.md's "Next"/"Later"/
// "Ideas" sections (recorded below as PLANNED, never as shipped).

export const RANKLE_META = {
  status: "Live",
  liveHref: "https://rankle.io",
  repoHref: "https://github.com/m4ttblanke/rankle",
  stack: "Next.js · Supabase",
  built: "Solo build, September 2026", // [REPO] created 2026-09-03, milestones through 2026-09-14
} as const;

export const RANKLE_TAGLINE =
  "A daily tier-list game: one topic, rank it, submit, then see how everyone else ranked it too."; // [README]

/** THE THING — the verified flow, in order. [README] "Rank → Submit → Compare → Share → Return tomorrow" */
export const RANKLE_FLOW = [
  {
    step: "Rank",
    body: "Every day, one topic and a fixed set of items. Place each one into a tier — S, A, B, C, F, or N/A if you haven't tried it.",
  },
  {
    step: "Submit",
    body: "Submitting locks the ranking. One official ranking per player per game, enforced by a database constraint below the one server action that can write it — not a disabled button.",
  },
  {
    step: "Compare",
    body: "See the community's tier distribution, the consensus, the controversial items, and where your own ranking disagreed.",
  },
  {
    step: "Share",
    body: "Send a link. It's spoiler-protected: whoever opens it has to submit their own ranking before they can see yours.",
  },
  {
    step: "Return tomorrow",
    body: "A new topic releases on its own schedule. No account required to play any of it.",
  },
] as const;

/** THE ARGUMENT — verified product behavior the social tension is built on. */
export const RANKLE_ARGUMENT = {
  lede: "Rankle only shows you the argument after you've taken a side.",
  points: [
    "No signup required to play — an opinion shouldn't have a login wall. Guest identity is a signed cookie, not an account.", // [SECURITY] §26
    "Results stay locked until you submit your own ranking, checked twice, server-side, independent of whatever the page shows.", // [SECURITY] §7
    "Sign up later and your guest history follows you in — nothing about the original ranking is rewritten to do it.", // [SECURITY] §26
  ],
} as const;

/** THE SYSTEM — constraint -> decision -> why it mattered. Only decisions with direct doc/code evidence. */
export const RANKLE_DECISIONS = [
  {
    constraint: "Play had to work with no signup, without resorting to device fingerprinting.",
    decision:
      "Guest identity is a random UUID in a signed, httpOnly cookie — HMAC-SHA256, verified in constant time, never readable or forgeable by the browser.",
    why: "Sign in later and Rankle claims that guest's submissions into the new account without ever mutating the original, immutable row.",
    source: "docs/SECURITY.md §26, Guest Security",
  },
  {
    constraint: "Community results had to stay invisible to anyone who hasn't played — not just hidden in the UI.",
    decision:
      "Two independent server checks stand between a visitor and results: a cheap boolean redirect for UX, and a SECURITY DEFINER Postgres function that's the actual authority.",
    why: "Even a raw call straight to the database can't see results early — tested at the RLS, integration, and end-to-end layers.",
    source: "docs/SECURITY.md §7, Spoiler Protection",
  },
  {
    constraint: "One official ranking per player per game had to actually hold, not just look like it holds.",
    decision:
      "Enforced by a unique database constraint, not a disabled submit button or client-side state — the server action reads identity from a trusted cookie, never the request body.",
    why: "A duplicate or retried request can't double-count community statistics; it just reports back the already-submitted state.",
    source: "docs/SECURITY.md §10, Submission Integrity",
  },
] as const;

/** A clean editorial architecture summary. [README] "Architecture" */
export const RANKLE_ARCHITECTURE = [
  { layer: "Browser", detail: "Next.js / React UI" },
  { layer: "Next.js", detail: "Server Actions · Route Handlers · Server Components" },
  { layer: "Supabase", detail: "PostgreSQL · Auth · Storage · Row Level Security" },
] as const;

/** THE RECEIPT — exact, verified, countable facts only. */
export const RANKLE_RECEIPT_STATS = [
  { n: "15", label: "version-controlled database migrations" },
  { n: "36", label: "Vitest unit & integration test files" },
  { n: "12", label: "Playwright end-to-end specs" },
  { n: "5", label: "required, parallel CI checks per change" },
  { n: "10", label: "tables enforcing the product's own rules" },
] as const;
