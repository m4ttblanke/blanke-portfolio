import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";

const authMiddleware = authkitMiddleware({
  redirectUri: process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/",
      "/projects",
      "/projects/:path*",
      "/experience",
      "/coursework",
      "/about",
      "/plannr",
      "/plannr/:path*",
    ],
  },
});

export default function proxy(request: NextRequest, event: Parameters<typeof authMiddleware>[1]) {
  // Exact match only (not next.config redirects, which treat trailing
  // slashes as optional and would loop): the proxied plannr page's relative
  // asset paths need the trailing slash to resolve under /plannr/.
  if (request.nextUrl.pathname === "/plannr") {
    return NextResponse.redirect(new URL("/plannr/", request.url), 308);
  }
  return authMiddleware(request, event);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
