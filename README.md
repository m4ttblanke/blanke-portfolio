# Matthew Blanke's Personal Portfolio
Personal portfolio website showcasing my projects, technical experience, and coursework. Built to highlight full-stack development, product thinking, and clean UI/UX. Includes integrations, real-world projects, and ongoing work.


## Architecture

### See [docs/architecture.md](docs/architecture.md) for more.

Personal portfolio site built on Next.js, deployed to Vercel, with Convex
as the TypeScript-native database and WorkOS for authentication.

Feature development uses a Claude Code → Greptile feedback loop on
feature branches. Only reviewed PRs merged to `main` trigger CI, which
runs a destructive-migration safety check before deploying Convex and
Vercel in order.

**Stack:** Next.js · Vercel · Convex · WorkOS · GitHub Actions
**Dev tooling:** Claude Code · Greptile


## Deployment

The site uses a **fully automated deployment pipeline** triggered on every push to `main`:

1. **GitHub Actions** detects changes to `convex/` and/or app files
2. **Migration safety check** verifies no destructive schema changes without `[allow-destructive]` tag
3. **Convex deploy** pushes database schema and functions to production
4. **Vercel deploy** builds and deploys the Next.js app after Convex succeeds

**Live site:** https://blanke-portfolio.vercel.app

### Environment Variables

Required in `.env.local` (local dev) and Vercel dashboard (production):

```
NEXT_PUBLIC_CONVEX_URL=         # Convex deployment URL
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_API_KEY=                 # From WorkOS dashboard
WORKOS_CLIENT_ID=               # From WorkOS dashboard
WORKOS_COOKIE_PASSWORD=         # 32+ character secure string
CONVEX_DEPLOY_KEY=              # From Convex Settings > Deploy Keys
```

### GitHub Secrets

Required for CI/CD pipeline:

- `CONVEX_DEPLOY_KEY` — Convex production deploy key
- `VERCEL_TOKEN` — Vercel API token
- `VERCEL_ORG_ID` — From `.vercel/project.json`
- `VERCEL_PROJECT_ID` — From `.vercel/project.json`


## Users

### Public Users
Access the portfolio without authentication at `/` (home), `/projects`, `/experience`, `/coursework`, `/about`.

- View published projects with stack, dates, and links
- Browse experience timeline and coursework
- All content marked as "Draft" is hidden from public view

### Admin Users
Access the admin dashboard at `/admin` after signing in with WorkOS.

**Capabilities:**
- Create, edit, and delete projects, experience entries, and coursework
- Toggle "Draft" flag to control visibility on public pages
- Live updates — changes appear immediately on public pages
- Admin navigation: `/admin/projects`, `/admin/experience`, `/admin/coursework`

**Auth:** WorkOS handles login, session management, and HTTP-only cookies. Only users configured in the WorkOS dashboard can access `/admin`.


## Conventions

### Naming Conventions

The following conventions should be followed to **maintain consistency across the project**:

- **Branches:** `initials-myFeatureBranch`
  - Example: `ab-myFeatureBranch`
  - Rule: Keep branches focused on a single issue or feature
- **PRs:** `initials - My PR Title`
  - Example: `ab - Add referee rating feature`
- **Commits:** Use clear, concise, imperative messages
  - Example: Add referee rating feature
- **Planning docs:** `month-day-year-next-steps.md`
  - Example: `12-31-2000-next-steps.md`

### PR Format

Every PR must include the following:

- **Title:** `initials - My PR Title` (e.g. `ab - My PR Title`)
- Assign yourself as the assignee.
- Link to the issue this PR closes.

Every PR description must include the following:

1. **Merge order** — State if this PR must be merged after another PR, or if it can be merged independently.
2. **Problem** — Describe the problem or motivation behind the change.
3. **Solution** — Explain the approach taken to solve it.
4. **Changes** — List the specific changes made.
5. **Screenshots** — Include screenshots if the change affects the UI.
6. **Testing** — Describe how to test the changes.

See [docs/PRFormat.md](docs/PRFormat.md)

### Issue Format

Every issue for bugs/large features must include the following:

1. **Problem** — Describe the bug, missing feature, or improvement needed.
2. **Expected behavior** — Describe what should happen.
3. **Actual behavior** — Describe what currently happens (if applicable).
4. **Steps to reproduce** — List steps to reproduce the issue (if applicable).
5. **Acceptance criteria** — List the specific conditions that must be met for this issue to be considered resolved.
6. **Screenshots** — Include screenshots if the issue involves the UI.
7. **Additional context** — Any other relevant information (environment, related issues, etc.).

For small features or quick tasks, only the following are required:

1. **Problem** — Describe the task or small feature needed.
2. **Acceptance criteria** — List the conditions that must be met to close the issue.


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b firstlast-my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin firstlast-my-new-feature`
5. Submit a pull request :D


## License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
