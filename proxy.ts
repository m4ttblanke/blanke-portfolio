import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { isAdminPath } from "@/lib/route-access";

// AuthKit only runs for the admin surface. The public site, its static files,
// SEO routes and /callback never touch the auth middleware, so they are public
// without an allow-list.
const authMiddleware = authkitMiddleware({
  redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [],
  },
});

export default function proxy(request: NextRequest, event: Parameters<typeof authMiddleware>[1]) {
  const { pathname } = request.nextUrl;

  // Exact match only (not next.config redirects, which treat trailing
  // slashes as optional and would loop): the proxied plannr page's relative
  // asset paths need the trailing slash to resolve under /plannr/.
  if (pathname === "/plannr") {
    return NextResponse.redirect(new URL("/plannr/", request.url), 308);
  }

  // Belt and braces: even if `config.matcher` is ever widened, only admin
  // paths are gated.
  if (isAdminPath(pathname)) {
    return authMiddleware(request, event);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/plannr"],
};
