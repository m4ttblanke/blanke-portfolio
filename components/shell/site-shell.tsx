import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import "./shell.css";

// The permanent frame of the public site: skip link, masthead, page, colophon.
//
// <main> is deliberately unframed. The cover (M3) and the spreads after it run
// edge to edge, so each page opts into the grid with <PageFrame> rather than the
// shell forcing margins on everything.
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
