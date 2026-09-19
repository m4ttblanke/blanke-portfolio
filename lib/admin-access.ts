// Gate for the Next.js admin UI (defense in depth). The real authorization for
// reading drafts and writing content lives in Convex (convex/lib/access.ts).
//
// Reads ADMIN_ALLOWED_EMAILS, a server-only variable (never NEXT_PUBLIC_*),
// passed in by the caller. Fail closed: a missing or empty list admits nobody.

export function parseEmailList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(
  user: { email?: string | null; emailVerified?: boolean } | null | undefined,
  rawAllowList: string | undefined
): boolean {
  if (!user?.email || user.emailVerified !== true) return false;
  const allowed = parseEmailList(rawAllowList);
  return allowed.length > 0 && allowed.includes(user.email.trim().toLowerCase());
}
