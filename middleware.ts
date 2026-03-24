import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  redirectUri: "http://localhost:3000/callback",
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ["/", "/projects", "/projects/:path*", "/experience", "/coursework", "/about"],
  },
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
