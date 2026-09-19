# Matthew Blanke's Personal Portfolio

Personal portfolio website showcasing my projects, technical experience, and coursework. Built to highlight full-stack development, product thinking, and clean UI/UX. Includes integrations, real-world projects, and ongoing work.

**Live site:** https://matthewblanke.com

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start Convex dev server (in one terminal)
npx convex dev

# Start Next.js dev server (in another terminal)
npm run dev
```

The site will be available at `http://localhost:3000`. Admin panel at `/admin` (requires WorkOS login).

### Environment Variables

Create a `.env.local` file with:

```
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_API_KEY=<from-workos-dashboard>
WORKOS_CLIENT_ID=<from-workos-dashboard>
WORKOS_COOKIE_PASSWORD=<32+-character-string>
ADMIN_ALLOWED_EMAILS=<your-email>   # comma-separated; empty = nobody can open /admin
```

Admin access is enforced in Convex, not just in Next.js. Set these **on the Convex deployment** (they are not read from `.env.local`):

```bash
npx convex env set WORKOS_CLIENT_ID <same value as above>
npx convex env set ADMIN_WORKOS_USER_IDS <your WorkOS user id, e.g. user_01ABC...>   # empty = nobody can edit
```

Find your user id in the WorkOS dashboard (Users), or sign in to `/admin` once and it prints the exact command. `convex deploy` refuses to run if `WORKOS_CLIENT_ID` is not set on the target deployment. See [docs/architecture.md](docs/architecture.md#authentication-and-authorization-workos--convex).

## Architecture

**See [docs/architecture.md](docs/architecture.md) for detailed architecture documentation.**

Personal portfolio site built on Next.js, deployed to Vercel, with Convex as the TypeScript-native database and WorkOS for authentication.

**Stack:** Next.js · Vercel · Convex · WorkOS · GitHub Actions
**Design:** editorial art direction with CSS tokens in `app/globals.css` (see [docs/ART_DIRECTION.md](docs/ART_DIRECTION.md)); proof sheet at `/proof` on local and preview builds
**Dev tooling:** Claude Code · Greptile


## Deployment

The site uses a **fully automated deployment pipeline** triggered on every push to `main`:

1. **Verify** runs typecheck, lint, tests and a production build (the same checks run on every pull request)
2. **GitHub Actions** detects changes to `convex/`
3. **Migration safety check** verifies no destructive schema changes without `[allow-destructive]` (a failure also blocks the Vercel deploy)
4. **Convex deploy** pushes database schema and functions to production
5. **Vercel deploy** builds and deploys the Next.js app after Convex succeeds

Vercel's own Git auto-deploy of `main` is disabled in `vercel.json`, so this pipeline is the only path to production. Pull requests and branches still get Vercel preview deployments.

**Live site:** https://matthewblanke.com

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
