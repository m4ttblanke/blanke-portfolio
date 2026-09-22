import { SiteShell } from "@/components/shell/site-shell";

// The public site's permanent frame (M2). The masthead, contents and colophon
// live in components/shell; each page places itself on the grid with PageFrame.
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell>{children}</SiteShell>;
}
