# Architecture

Personal portfolio website showcasing my projects, technical experience, and coursework. Built to highlight full-stack development, product thinking, and clean UI/UX. Includes integrations, real-world projects, and ongoing work.

---

## Overview

This is a full-stack personal portfolio site deployed on Vercel, backed by Convex for the database layer, and protected by WorkOS for authentication. The site features a CSS token-based design system with light/dark mode support, dynamically generated OG images, and a fully automated CI/CD pipeline. Feature development is AI-assisted via Claude Code, with Greptile providing automated code review before any changes reach `main`.

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
│   ├── globals.css         # Design tokens, theme variables, typography
│   ├── layout.tsx          # Root layout with theme provider and auth wrapper
│   ├── favicon.tsx         # SVG favicon generation (32×32 with initials)
│   ├── opengraph-image.tsx # Static OG image for home page
│   └── robots.ts           # SEO robots config, sitemap reference
├── components/             # Shared React components (nav, theme toggle, etc.)
├── lib/                    # Utility functions and shared logic
├── convex/                 # All database logic — functions, schema, migrations
│   ├── schema.ts           # Single source of truth for data model
│   ├── migrations/         # Migration functions for destructive schema changes
│   └── *.ts                # Query and mutation functions
├── public/                 # Static assets
└── .github/
    └── workflows/
        └── deploy.yml      # Merge-to-main deployment pipeline
```

---

## Design System

The portfolio uses a **CSS custom property (token) system** for colors, typography, and transitions. This enables seamless theme switching and maintains consistent design across all components.

**Colors (light mode defaults):**
- `--color-bg: #ffffff` — Page background
- `--color-bg-subtle: #f9fafb` — Subtle background (cards, inputs)
- `--color-fg: #111827` — Primary text
- `--color-fg-muted: #52525b` — Secondary text
- `--color-fg-subtle: #a1a1aa` — Tertiary text
- `--color-border: #f4f4f5` — Default borders
- `--color-border-hover: #e4e4e7` — Hover border state
- `--color-badge-bg: #f4f4f5` — Badge backgrounds
- `--color-badge-fg: #3f3f46` — Badge text

**Typography:**
- `--font-sans` — Main UI font (Geist Sans via Next.js)
- `--font-mono` — Code font (Geist Mono)

**Transitions:**
- `--transition-fast: 150ms ease` — Hover states, brief interactions
- `--transition-base: 200ms ease` — Page transitions, modal opens

**Theme Implementation:**
- Light/dark colors are defined in `app/globals.css` with both `@media (prefers-color-scheme: dark)` for system preference and `[data-theme='dark']` / `[data-theme='light']` for explicit selection
- `ThemeProvider` component initializes theme from `localStorage` or system preference
- `ThemeToggle` button (sun/moon icon) in navigation allows manual switching
- All tokens are exposed to Tailwind via `@theme inline` block, enabling utility classes like `text-fg`, `bg-bg-subtle`, etc.

---

## Features

### Light/Dark Mode
- Auto-detects system preference on first visit
- Manual toggle via sun/moon icon in navigation
- Selection persists to localStorage
- All colors automatically adjust via CSS variables
- Mobile menu animates smoothly with `motion-reduce:transition-none` support

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
