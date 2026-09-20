import type { Metadata, Viewport } from "next";
import { SITE_URL } from "@/lib/site";
import { PALETTE } from "@/lib/design/palette";
import { schibsted } from "./fonts/body";
import { display } from "./fonts/display";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Matt Blanke",
  description: "CS student and software engineer.",
};

// Browser chrome matches the paper ground. One light theme, so one value.
export const viewport: Viewport = {
  themeColor: PALETTE.paper,
  colorScheme: "light",
};

// Runs before first paint so Clean Copy never flashes. It only reads a stored
// preference and sets one attribute; if storage is blocked, the site simply
// renders in its default (vandalized) state.
const preferenceScript = `try{if(localStorage.getItem("copy")==="clean")document.documentElement.dataset.copy="clean"}catch(e){}`;

// No auth or Convex providers here: the public site is server-rendered and
// must not depend on either. They are mounted only under /admin
// (components/admin/admin-providers.tsx).
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${schibsted.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
