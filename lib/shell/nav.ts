// The publication's table of contents: the one place the primary navigation is
// defined. The masthead, the colophon and each page's folio all read from here,
// so a section is renamed or re-pointed in one edit.
//
// Sections are not the same as routes. The legacy routes keep working; this maps
// them onto the intended structure:
//
//   Work      -> /projects   (later: the Selected Work wall)
//   File 001  -> /about      (later: the editorial profile)
//   Résumé    -> /experience (and /coursework, reached from the section switch)
//   Contact   -> /contact
//
// There is no résumé PDF yet. When one exists, Résumé can point at it.

export type NavId = "work" | "file" | "resume" | "contact";

export type NavItem = {
  id: NavId;
  label: string;
  /** One quiet line saying what is behind the label. */
  note: string;
  href: string;
  /** A path belongs to this section if it equals, or sits under, one of these. */
  match: readonly string[];
  /** Sibling pages of a section that has more than one. */
  pages?: readonly { label: string; href: string }[];
};

export const PRIMARY_NAV: readonly NavItem[] = [
  { id: "work", label: "Work", note: "Projects", href: "/projects", match: ["/projects"] },
  { id: "file", label: "File 001", note: "About", href: "/about", match: ["/about"] },
  {
    id: "resume",
    label: "Résumé",
    note: "Experience, coursework",
    href: "/experience",
    match: ["/experience", "/coursework"],
    pages: [
      { label: "Experience", href: "/experience" },
      { label: "Coursework", href: "/coursework" },
    ],
  },
  { id: "contact", label: "Contact", note: "Email and links", href: "/contact", match: ["/contact"] },
];

const under = (pathname: string, base: string) => pathname === base || pathname.startsWith(`${base}/`);

export function isActive(pathname: string | null, item: NavItem): boolean {
  if (!pathname) return false;
  return item.match.some((base) => under(pathname, base));
}

export function navItem(id: NavId): NavItem {
  const item = PRIMARY_NAV.find((n) => n.id === id);
  if (!item) throw new Error(`Unknown nav section: ${id}`);
  return item;
}
