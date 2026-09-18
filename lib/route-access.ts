// Which paths require a signed-in session.
//
// The public portfolio is public by default. Only the admin surface is
// protected; everything else (pages, /robots.txt, /sitemap.xml, OG images,
// files from /public, /callback, /plannr/*) is never gated by AuthKit.
// Being an explicit *protect list* means new public routes and assets need no
// registration, unlike the previous allow-list model.
export function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}
