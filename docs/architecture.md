# Architecture

Personal portfolio website showcasing my projects, technical experience, and coursework. Built to highlight full-stack development, product thinking, and clean UI/UX. Includes integrations, real-world projects, and ongoing work.

---

## Overview

This is a full-stack personal portfolio site deployed on Vercel, backed by Convex for the database layer, and protected by WorkOS for authentication. The site features a CSS token-based editorial design system (one light theme plus a Clean Copy preference), dynamically generated OG images, and a fully automated CI/CD pipeline. Feature development is AI-assisted via Claude Code, with Greptile providing automated code review before any changes reach `main`.

---

## Stack

| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js 16.2+ (App Router) | UI, routing, server components, OG image generation |
| Styling | Tailwind CSS v4 + CSS custom properties | Utility-first with design tokens |
| Hosting | Vercel | Production deployment, preview environments, auto-scaling |
| Database | Convex | TypeScript-native backend, real-time queries, mutations |
| Auth | WorkOS | SSO / session management, HTTP-only cookies |
| Dev tooling | Claude Code | AI-assisted feature development |
| Code review | Greptile | Automated AI code review on PRs |
| CI/CD | GitHub Actions | Deploy pipeline on merge to `main` |

---

## Project Structure

```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── (public)/           # Unauthenticated routes (portfolio, about, projects)
│   ├── (admin)/            # Authenticated routes (content management)
│   ├── proof/              # Internal proof sheet (404 on production)
│   ├── fonts/              # Self-hosted variable fonts + next/font/local modules
│   ├── globals.css         # Every design token and primitive (see ART_DIRECTION.md)
│   ├── layout.tsx          # Root layout: fonts, global CSS, Clean Copy pre-paint script
│   ├── favicon.ico         # Static favicon
│   ├── opengraph-image.tsx # Static OG image for home page
│   └── robots.ts           # SEO robots config, sitemap reference
├── components/             # Shared React components (design marks, Clean Copy toggle, admin UI)
├── lib/                    # Site constants, admin access rules, lib/design (palette, contrast, seed)
├── convex/                 # All database logic — functions, schema, migrations
│   ├── schema.ts           # Single source of truth for data model
│   ├── migrations/         # Migration functions for destructive schema changes
│   └── *.ts                # Query and mutation functions
├── tests/                  # convex/ (authorization), lib/ (access rules), design/ (design guards)
├── docs/                   # Architecture, PRD, ART_DIRECTION.md
├── public/                 # Static assets
└── .github/
    └── workflows/          # ci.yml (verify) and deploy.yml (gated production deploy)
```

---

## Design System

The visual foundation is documented in **[docs/ART_DIRECTION.md](ART_DIRECTION.md)**, which is the source of truth for any public-facing visual decision. In short:

- **Tokens and primitives** live in one file, `app/globals.css`: palette (paper, hard white, ink, one red), type roles, the 12/8/4-column grid, the layer stack, motion tokens, and a small set of controlled-chaos utilities that are all scaled by a single `--chaos` variable.
- **Fonts** are self-hosted variable woff2 files loaded with `next/font/local` (`app/fonts/`): Schibsted Grotesk carries body, UI and most hierarchy; Big Shoulders Display is a display instrument for mastheads, major section titles and oversized statements, not the default heading face.
- **Clean Copy** is one attribute, `html[data-copy="clean"]`, set before first paint by an inline script in `app/layout.tsx`. It zeroes `--chaos` and hides decoration; content is untouched. It is infrastructure only: whether it becomes a visitor-facing control is undecided and deferred until real compositions exist. There is one theme (no dark mode).
- **The proof sheet** at `/proof` renders the system (type, grid, color with computed contrast, materials, a clean and a marked-up composition). It is available locally and on Vercel previews and returns 404 on the production deployment.
- **Guards** in `tests/design` enforce the rules that are easy to break by accident: no `Math.random()` for visible design, no `transition: all`, no raw z-index or hex outside the token file, no off-palette Tailwind colors on public code.

Tailwind CSS v4 is loaded through `app/globals.css` (imported in the root layout). The default Tailwind palette remains only because the admin UI is authored with it.

---

## Features

### Single theme, plus Clean Copy
- One light theme: warm paper ground, near-black ink, one red accent
- No dark mode or theme toggle. A **Clean Copy** preference (`html[data-copy="clean"]`, persisted in `localStorage`) removes rotation, tape, grain, halftone, marks and torn edges without changing any content
- Both are applied before first paint, so there is no flash

### Open Graph Images
Dynamic OG images are generated server-side using Next.js `ImageResponse`:

- **Home page:** Static OG image at `app/opengraph-image.tsx` (1200×630 px) with site title and description
- **Project pages:** Dynamic OG per project at `app/(public)/projects/[slug]/opengraph-image.tsx` — fetches project data and renders title with site branding

### Favicon & Branding
- Custom SVG favicon at `app/favicon.tsx` — 32×32 icon with initials "MB"
- Rendered dynamically via `ImageResponse`
- Displayed in browser tab and bookmarks

### SEO & Metadata
- Static sitemap at `app/sitemap.ts` — lists all public routes and project slugs
- Robots config at `app/robots.ts` — allows public routes, blocks `/admin`
- OG metadata in root layout — enables rich previews when shared on social media
- Dynamic per-page metadata for project detail routes

---

## Accessibility

The site includes comprehensive accessibility improvements:

- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, `<article>`, etc. for proper document structure
- **Active link indication** — `aria-current="page"` on active navigation links
- **Skip to content** — Hidden link in header, visible on first Tab press, jumps to `#main-content`
- **Interactive element structure** — No nested `<Link>` or `<a>` elements; separate links for navigation vs. content links
- **Color contrast** — All text meets WCAG AA standards (4.5:1 for body text, 3:1 for large text)
- **Motion sensitivity** — `prefers-reduced-motion: reduce` respected; animations disabled for users with motion sensitivity settings
- **Heading hierarchy** — Proper `<h1>` → `<h2>` → `<h3>` structure on each page
- **Link text clarity** — All links have descriptive anchor text (not "click here" or "more")

---

## Data Layer (Convex)

All database work lives in `/convex` as TypeScript. This is intentional — it means Claude Code has full visibility into the schema and query logic without needing external context, and the type system enforces correctness end-to-end.

**Key properties:**
- Schema defined in `convex/schema.ts`; Convex applies migrations automatically on `convex deploy`
- Queries and mutations are plain TypeScript functions — no ORM, no SQL
- Real-time subscriptions available via `useQuery` on the frontend
- No database credentials to manage; auth is handled via Convex's built-in identity layer

**Destructive migration policy:** Any schema change that removes or renames fields requires a migration function in `convex/migrations/` and the commit message must include `[allow-destructive]` to pass the CI safety check. See `.github/workflows/deploy.yml` for details.

---

## Authentication and authorization (WorkOS + Convex)

Three independent layers. The public site never depends on any of them.

**1. Public routes are never gated.** `proxy.ts` runs AuthKit only for `/admin/:path*` (and does the exact `/plannr` → `/plannr/` redirect). Pages, `/robots.txt`, `/sitemap.xml`, OG images, files in `/public`, `/callback` and `/plannr/*` do not pass through the auth middleware, so new public routes and assets need no registration. (`withAuth()` only works on paths the middleware covers, so the AuthKit and Convex client providers are mounted only under `/admin`, in `components/admin/admin-providers.tsx`.)

**2. Admin UI gate (Next.js).** `app/(admin)/admin/layout.tsx` requires a WorkOS sign-in with a *verified* email listed in `ADMIN_ALLOWED_EMAILS`. This is a server-only variable. **Fail closed:** if it is missing or empty, nobody gets in.

**3. Data authorization (Convex) is the real security boundary.** The Convex URL is public, so anyone can call functions directly; the Next.js gate alone would not protect the data.
- `convex/auth.config.ts` makes Convex verify the WorkOS access token the admin's browser sends.
- `convex/lib/access.ts` (`requireAdmin`) allows only WorkOS user ids listed in the Convex variable `ADMIN_WORKOS_USER_IDS`. Fail closed here too. (The check is by user id, not email: WorkOS access tokens carry no email claim, and ids are immutable.)
- Every mutation and every query that can return drafts calls `requireAdmin`. Public queries (`listPublished`, `getBySlug`) return published content only. `tests/convex/every-function-is-guarded.test.ts` fails if a new function is added without a guard.

**Environment variables**

| Variable | Where | Purpose |
|---|---|---|
| `ADMIN_ALLOWED_EMAILS` | Vercel (server-only), `.env.local` | Comma-separated emails allowed into the admin UI. Empty = nobody. |
| `WORKOS_CLIENT_ID` | Vercel **and the Convex deployment** | Convex uses it to validate WorkOS tokens. `convex deploy` refuses to run if it is missing on the deployment. |
| `ADMIN_WORKOS_USER_IDS` | **Convex deployment only** | Comma-separated WorkOS user ids (`user_...`) allowed to read drafts and write content. Empty = nobody. |

Set the Convex ones with `npx convex env set NAME value` (add `--prod` for a production deployment). Your WorkOS user id is in the WorkOS dashboard under Users; the admin page also prints the exact command with your id if you sign in but are not yet allow-listed.

---

## Development Workflow

Feature development uses a feedback loop between Claude Code and Greptile before any code reaches `main`.

```
Claude Code (writes feature)
        ↓
Opens pull request
        ↓
Greptile reviews PR  ←──── iterates until no blocking issues
        ↓
Matt reviews and merges
        ↓
GitHub Actions deploy pipeline runs
```

**Invariants:**
- Only Matt merges PRs to `main`
- Greptile must pass before a PR is considered ready for review
- Claude Code operates on feature branches only - never directly on `main`

---

## Deploy Pipeline

Defined in `.github/workflows/deploy.yml`. Triggers on every push to `main`. `.github/workflows/ci.yml` runs the same verification on every pull request.

```
verify (typecheck, lint, tests, production build)
detect-changes
    ├── [convex/**]  → migration-safety-check → deploy-convex ─┐
    └── (always)                                               ├→ deploy-vercel
                                          verify + safety check ┘
```

**Step-by-step:**

1. **Verify** (`ci.yml`) — `npm run typecheck`, `npm run lint`, `npm test` (Convex authorization tests) and `npm run build` with placeholder env. Nothing below runs unless this passes.

2. **Detect changes** — path filtering determines whether Convex files changed.

3. **Migration safety check** — diffs `convex/schema.ts` against `HEAD~1`. If any lines were removed or renamed and the commit message doesn't include `[allow-destructive]`, the pipeline fails **and the Vercel deploy is blocked too**.

4. **Convex deploy** — runs `npx convex deploy`, which pushes updated functions and applies schema changes. It fails fast if `WORKOS_CLIENT_ID` is not set on the Convex deployment.

5. **Vercel deploy** — builds and ships the Next.js app to production. Waits for Convex if it was triggered, so the frontend is never ahead of the backend.

6. **Failure summary** — on any failure, a summary with the commit and each job's result is written to the run.

**Vercel Git auto-deploy of `main` is turned off** in `vercel.json` (`git.deploymentEnabled.main = false`). Before this, Vercel's own GitHub integration also deployed every push to `main` in parallel, bypassing the gates above and racing the Convex deploy. Pull requests and other branches still get Vercel preview deployments.

**Concurrency:** A `production-deploy` concurrency group with `cancel-in-progress: false` ensures a second push queues rather than cancelling an in-flight migration.

---

## Secrets

The following secrets must be configured in GitHub repository settings:

| Secret | Source |
|---|---|
| `CONVEX_DEPLOY_KEY` | Convex dashboard → Settings → Deploy keys |
| `VERCEL_TOKEN` | vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` |

WorkOS credentials (`WORKOS_API_KEY`, `WORKOS_CLIENT_ID`) are stored as Vercel environment variables and pulled automatically during build via `vercel pull`.

---

## Local Development

```bash
npm install

# Start the Convex dev server (watches convex/ and hot-reloads functions)
npx convex dev

# In a separate terminal, start the Next.js dev server
npm run dev
```

> **Warning:** as of M0, the `dev:` Convex deployment in `.env.local` is the *same deployment production uses* (the live site's bundle points at it). Treat `npx convex dev`, `npx convex deploy` and `npx convex run` as production operations. Create a separate production deployment before doing risky schema work.
>
> Convex functions now require an authenticated admin. `npx convex run` runs without a user identity, so admin functions reject it unless you pass `--identity '{"subject":"user_..."}'` (an id in `ADMIN_WORKOS_USER_IDS`). Public queries work as before.

Run the checks CI runs: `npm run typecheck && npm run lint && npm test && npm run build`.

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin panel (requires WorkOS login).

---

## Performance & Monitoring

- **Image optimization** — Next.js `<Image>` component for automatic srcset generation and lazy loading
- **Vercel Analytics** — Built-in performance monitoring via Vercel dashboard
- **Lighthouse** — Target Lighthouse score ≥ 90 for performance, accessibility, and best practices
- **SEO** — Sitemap, robots.txt, OG images, and meta tags for discoverability
