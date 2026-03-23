# Architecture
 
Personal portfolio website showcasing my projects, technical experience, and coursework. Built to highlight full-stack development, product thinking, and clean UI/UX. Includes integrations, real-world projects, and ongoing work.
 
---
 
## Overview
 
This is a full-stack personal portfolio site deployed on Vercel, backed by Convex for the database layer, and protected by WorkOS for authentication. Feature development is AI-assisted via Claude Code, with Greptile providing automated code review before any changes reach `main`.
 
---
 
## Stack
 
| Layer | Technology | Role |
|---|---|---|
| Frontend | Next.js (App Router) | UI, routing, server components |
| Hosting | Vercel | Production deployment, preview environments |
| Database | Convex | TypeScript-native backend, real-time queries |
| Auth | WorkOS | SSO / session management |
| Dev tooling | Claude Code | AI-assisted feature development |
| Code review | Greptile | Automated AI code review on PRs |
| CI/CD | GitHub Actions | Deploy pipeline on merge to `main` |
 
---
 
## Project Structure
 
```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── (public)/           # Unauthenticated routes (portfolio, about, projects)
│   └── (admin)/            # Authenticated routes (content management)
├── components/             # Shared React components
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
 
## Data Layer (Convex)
 
All database work lives in `/convex` as TypeScript. This is intentional — it means Claude Code has full visibility into the schema and query logic without needing external context, and the type system enforces correctness end-to-end.
 
**Key properties:**
- Schema defined in `convex/schema.ts`; Convex applies migrations automatically on `convex deploy`
- Queries and mutations are plain TypeScript functions — no ORM, no SQL
- Real-time subscriptions available via `useQuery` on the frontend
- No database credentials to manage; auth is handled via Convex's built-in identity layer
 
**Destructive migration policy:** Any schema change that removes or renames fields requires a migration function in `convex/migrations/` and the commit message must include `[allow-destructive]` to pass the CI safety check. See `.github/workflows/deploy.yml` for details.
 
---
 
## Authentication (WorkOS)
 
WorkOS handles authentication via `authkitMiddleware` in Next.js middleware, using the App Router session pattern.
 
**Key properties:**
- Session managed via WorkOS-issued JWTs stored in HTTP-only cookies
- Middleware protects `/admin` routes; public portfolio routes are unauthenticated
- WorkOS user identity is passed through to Convex via the Convex auth integration
 
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
 
Defined in `.github/workflows/deploy.yml`. Triggers on every push to `main`.
 
```
detect-changes
    ├── [convex/**]  → migration-safety-check → deploy-convex
    └── [app/**]     →                        → deploy-vercel
                                                    ↑
                                         waits on deploy-convex
                                         if it was triggered
```
 
**Step-by-step:**
 
1. **Detect changes** — path filtering determines whether Convex, the app, or both changed. Downstream jobs are skipped if their files weren't touched.
 
2. **Migration safety check** — diffs `convex/schema.ts` against `HEAD~1`. If any lines were removed or renamed and the commit message doesn't include `[allow-destructive]`, the pipeline fails before anything deploys.
 
3. **Convex deploy** — runs `npx convex deploy`, which pushes updated functions and applies any schema migrations.
 
4. **Vercel deploy** — builds and ships the Next.js app to production. Always waits for Convex to finish if both were triggered, ensuring the frontend is never ahead of the schema.
 
5. **Failure summary** — on any failure, a summary is written to the GitHub Actions run with the commit SHA, author, and message for quick diagnosis.
 
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
 
The Convex dev server creates an isolated development deployment separate from production. Schema changes made locally do not touch the production database until merged to `main` and deployed via CI.
 