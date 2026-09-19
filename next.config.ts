import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next's default trailing-slash redirect always strips the slash, which
  // fights the proxy.ts redirect that adds one for /plannr. Disable the
  // built-in behavior so only that explicit, exact-match redirect applies.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // The admin index has no page of its own. This must be an HTTP redirect,
      // not a `redirect()` inside app/(admin)/admin/page.tsx: AuthKit's client
      // provider refreshes the session through server actions, which makes
      // Next re-render the *current* route inside the action response. A
      // redirecting page would embed a NEXT_REDIRECT in that response while
      // the router is also following the page's own redirect, and the two
      // collide (React error #310, "This page couldn't load"). A config
      // redirect runs before the proxy and before React renders anything, and
      // means sign-in returns the user straight to /admin/projects.
      {
        source: "/admin",
        destination: "/admin/projects",
        permanent: false,
      },
      // The GitHub Pages source still links to privacy.html/terms.html
      // internally, so bounce those to the clean URLs rather than editing
      // the proxied site's markup.
      {
        source: "/plannr/privacy\\.html",
        destination: "/plannr/privacy",
        permanent: true,
      },
      {
        source: "/plannr/terms\\.html",
        destination: "/plannr/terms",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Next drops the trailing slash from the destination when :path* is
        // empty, which GitHub Pages then 301s right back (it canonicalizes
        // directory URLs to end in /). Route the bare case to index.html
        // explicitly to avoid that redirect loop.
        source: "/plannr/",
        destination: "https://m4ttblanke.github.io/plannr/index.html",
      },
      {
        source: "/plannr/privacy",
        destination: "https://m4ttblanke.github.io/plannr/privacy.html",
      },
      {
        source: "/plannr/terms",
        destination: "https://m4ttblanke.github.io/plannr/terms.html",
      },
      {
        source: "/plannr/:path+",
        destination: "https://m4ttblanke.github.io/plannr/:path*",
      },
    ];
  },
};

export default nextConfig;
