import Link from "next/link";
import { navItem, type NavId } from "@/lib/shell/nav";

// Page furniture for pages that sit on the 12/8/4 grid. These are structure, not
// design: a page still composes its own spread inside them. They exist so every
// page starts from the same margins, columns and entry, not to make every page
// the same.

/** The M1 grid, with the page's vertical breathing room at the end. */
export function PageFrame({
  as: Tag = "div",
  children,
}: {
  as?: "div" | "article";
  children: React.ReactNode;
}) {
  return <Tag className="page-grid pageframe">{children}</Tag>;
}

/**
 * A temporary, generic page entry: the section folio, the page title, a rule.
 * The folio sits in the left columns and the title lines up with the masthead's
 * contents, so the eye keeps one vertical. Real pages will replace this with
 * their own openings.
 */
export function PageHeader({
  section,
  title,
  path,
}: {
  section: NavId;
  title: string;
  /** Current path, so a multi-page section can mark where you are. */
  path?: string;
}) {
  const item = navItem(section);
  return (
    <header className="pagehead">
      <p className="pagehead-folio t-meta t-soft">{item.label}</p>
      <h1 className="pagehead-title">{title}</h1>
      {item.pages && (
        <nav aria-label={`${item.label} pages`} className="pagehead-switch">
          <ul>
            {item.pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} aria-current={page.href === path ? "page" : undefined}>
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

/** Reading content, set on a measure and hung from the same column as the masthead's contents. */
export function ContentFrame({ children }: { children: React.ReactNode }) {
  return <div className="contentframe copy">{children}</div>;
}
