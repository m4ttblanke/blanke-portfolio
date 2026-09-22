"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRIMARY_NAV, isActive } from "@/lib/shell/nav";

// The only client component in the shell, and only because the active section
// depends on the current path. The server render already contains the right
// active item (usePathname resolves during prerender), so nothing flashes.
export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="nav">
      <ul className="nav-list">
        {PRIMARY_NAV.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="nav-link"
              aria-current={isActive(pathname, item) ? "page" : undefined}
            >
              <span className="nav-label">{item.label}</span>{" "}
              <span className="nav-note">{item.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
