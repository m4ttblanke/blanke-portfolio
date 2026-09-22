import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/shell/nav";
import { CONTACT, ISSUE, SITE_NAME, TAGLINE } from "@/lib/site";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// The colophon: the end matter of the issue. It repeats the contents (so no page
// is a dead end) and lists only verified links. Deliberately small; File 001 gets
// its own, more expressive ending later.
export function SiteFooter() {
  return (
    <footer className="colophon">
      <div className="page-grid colophon-grid">
        <div className="colophon-brand">
          <p className="colophon-name">{SITE_NAME}</p>
          <p className="t-meta t-soft">
            Issue {ISSUE.number} · {ISSUE.year}
          </p>
          <p className="t-small t-soft">{TAGLINE}</p>
        </div>

        <nav aria-label="Footer" className="colophon-index">
          <h2 className="t-meta t-soft">Contents</h2>
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="colophon-elsewhere">
          <h2 className="t-meta t-soft">Elsewhere</h2>
          <ul>
            <li>
              <a href={CONTACT.email.href}>{CONTACT.email.label}</a>
            </li>
            <li>
              <a href={CONTACT.github.href} {...external}>
                GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.linkedin.href} {...external}>
                LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>

        <p className="colophon-legal t-caption t-soft">
          <span>
            © {ISSUE.year} {SITE_NAME}
          </span>
          {/* Plain anchor on purpose: /admin is behind sign-in, so it must not be prefetched. */}
          <a href="/admin">Sign in</a>
        </p>
      </div>
    </footer>
  );
}
