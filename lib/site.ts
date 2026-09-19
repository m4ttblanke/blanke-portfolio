// Canonical origin for absolute URLs (metadata, sitemap, robots, OG).
// This is intentionally a constant, not an env var: it must not vary between
// preview deployments, and it is not a secret.
export const SITE_URL = "https://matthewblanke.com";
