import Link from "next/link";
import { ISSUE, SITE_NAME } from "@/lib/site";
import { PrimaryNav } from "./primary-nav";

// The masthead. A heavy rule across the full page, the name, the issue, and the
// contents. Not sticky on purpose: a magazine's masthead scrolls away, the
// colophon repeats the contents at the end, and long pages later on (File 001)
// should not carry a fixed bar over their compositions.
export function SiteHeader() {
  return (
    <header className="masthead">
      <div className="page-grid masthead-grid">
        <div className="masthead-brand">
          <Link href="/" className="wordmark">
            {SITE_NAME}
          </Link>
          <p className="issue t-meta">
            <span>Issue {ISSUE.number}</span>
            <span className="reg ornament" aria-hidden="true" />
          </p>
        </div>
        <PrimaryNav />
      </div>
    </header>
  );
}
