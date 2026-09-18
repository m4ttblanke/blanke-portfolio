import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matt Blanke",
  description: "CS student and software engineer.",
};

// No auth or Convex providers here: the public site is server-rendered and
// must not depend on either. They are mounted only under /admin
// (components/admin/admin-providers.tsx).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
