'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/coursework', label: 'Coursework' },
  { href: '/about', label: 'About' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="border-b border-zinc-100">
      <nav className="max-w-3xl mx-auto px-6 py-4 flex gap-6 items-center justify-between">
        <Link href="/" className="font-semibold text-zinc-900 text-lg">
          Matt Blanke
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition ${
                isActive(link.href)
                  ? 'font-semibold text-zinc-900'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-zinc-900 p-1"
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-zinc-100">
          <div className="max-w-3xl mx-auto px-6 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block text-sm py-2 transition ${
                  isActive(link.href)
                    ? 'font-semibold text-zinc-900'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
