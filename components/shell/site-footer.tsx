import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/shell/nav";
import { CONTACT, ISSUE, SITE_NAME } from "@/lib/site";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

// The colophon: quiet, dense back matter for the issue, not a second masthead.
// The masthead is the primary navigation object; this repeats the contents once,
// inline, at a much lower visual volume, and lists only verified links. File 001
// gets its own, more expressive ending later.
export function SiteFooter() {
  return (
    <footer className="colophon">
      <div className="page-grid colophon-grid">
        <div className="colophon-top">
          <div className="colophon-brand">
            <p className="colophon-name">{SITE_NAME}</p>
            <p className="t-meta t-soft">
              Issue {ISSUE.number} · {ISSUE.year}
            </p>
          </div>

          <nav aria-label="Footer" className="colophon-index">
            <h2 className="t-meta t-soft">Index</h2>
            <ul>
              {PRIMARY_NAV.map((item, i) => (
                <li key={item.id}>
                  {i > 0 && (
                    <span className="sep" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="colophon-elsewhere">
            <h2 className="t-meta t-soft">Elsewhere</h2>
            <ul>
              <li>
                <a href={CONTACT.github.href} {...external}>
                  GitHub<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <span className="sep" aria-hidden="true">
                  ·
                </span>
                <a href={CONTACT.linkedin.href} {...external}>
                  LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
              <li>
                <span className="sep" aria-hidden="true">
                  ·
                </span>
                <a href={CONTACT.email.href}>Email</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="colophon-bottom">
          <p className="colophon-credit t-caption t-soft">
            Designed &amp; built by {SITE_NAME} · {ISSUE.year}
          </p>
          {/* Plain anchor on purpose: /admin is behind sign-in, so it must not be prefetched.
              Set apart from the index above and kept at the quietest type in the shell: this
              exists for Matthew, not for a visitor reading the issue. */}
          <a href="/admin" className="colophon-admin t-caption">
            Sign in
          </a>
        </div>
      </div>
    </footer>
  );
}
