'use client';

import { useEffect, useState } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const current =
      localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(current as 'light' | 'dark');
  }, []);

  const toggleTheme = () => {
    if (!theme) return;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!theme) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-1 text-fg hover:text-fg-muted transition-colors duration-150"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="3" r="1.5" />
          <circle cx="12" cy="21" r="1.5" />
          <circle cx="3" cy="12" r="1.5" />
          <circle cx="21" cy="12" r="1.5" />
          <circle cx="5.64" cy="5.64" r="1.5" />
          <circle cx="18.36" cy="18.36" r="1.5" />
          <circle cx="18.36" cy="5.64" r="1.5" />
          <circle cx="5.64" cy="18.36" r="1.5" />
        </svg>
      )}
    </button>
  );
}
