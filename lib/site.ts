// Canonical origin for absolute URLs (metadata, sitemap, robots, OG).
// This is intentionally a constant, not an env var: it must not vary between
// preview deployments, and it is not a secret.
export const SITE_URL = "https://matthewblanke.com";

// Publication identity. These are the only facts the shell prints about the
// site: the name, the issue, and copy that already existed on the site. Add a
// fact here only once it is verified; the shell never invents metadata.
export const SITE_NAME = "Matthew Blanke";
export const TAGLINE = "CS student and software engineer.";
export const ISSUE = { number: "001", year: "2026" } as const;

// Verified contact points. The single source for the Contact page, the About
// page and the colophon.
export const CONTACT = {
  email: { label: "mattheweblanke@gmail.com", href: "mailto:mattheweblanke@gmail.com" },
  github: { label: "@m4ttblanke", href: "https://github.com/m4ttblanke" },
  linkedin: { label: "@m4ttblanke", href: "https://linkedin.com/in/m4ttblanke" },
} as const;
