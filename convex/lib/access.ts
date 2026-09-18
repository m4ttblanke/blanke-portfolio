import type { Auth } from "convex/server";
import { ConvexError } from "convex/values";

// Single-owner authorization for the portfolio admin.
//
// Who is an admin is decided *here, inside Convex*, so it cannot be bypassed by
// calling the public Convex URL directly. The check is by WorkOS user id
// (the JWT `sub` claim), which is stable and cannot be changed by the user,
// unlike an email address. WorkOS access tokens do not carry an email claim.
//
// Configure with the Convex deployment environment variable:
//   npx convex env set ADMIN_WORKOS_USER_IDS user_XXXX[,user_YYYY]
//
// Fail closed: if the variable is missing or empty, nobody is an admin.

export function parseIdList(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export function isAdminSubject(
  subject: string | undefined,
  rawAllowList: string | undefined
): boolean {
  if (!subject) return false;
  const allowed = parseIdList(rawAllowList);
  return allowed.length > 0 && allowed.includes(subject);
}

/** Throws unless the caller is an authenticated, allow-listed admin. */
export async function requireAdmin(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({ code: "UNAUTHENTICATED", message: "Sign in required." });
  }
  if (!isAdminSubject(identity.subject, process.env.ADMIN_WORKOS_USER_IDS)) {
    throw new ConvexError({ code: "FORBIDDEN", message: "Not authorized." });
  }
  return identity;
}
