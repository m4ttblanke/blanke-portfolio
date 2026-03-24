export function Nav() {
  return (
    <header className="border-b border-zinc-100">
      <nav className="max-w-3xl mx-auto px-6 py-4 flex gap-6 items-center justify-between">
        <a href="/" className="font-semibold text-zinc-900 text-lg">
          Matt Blanke
        </a>
        <div className="flex gap-6">
          <a href="/projects" className="text-sm text-zinc-600 hover:text-zinc-900">
            Projects
          </a>
          <a href="/experience" className="text-sm text-zinc-600 hover:text-zinc-900">
            Experience
          </a>
          <a href="/coursework" className="text-sm text-zinc-600 hover:text-zinc-900">
            Coursework
          </a>
          <a href="/about" className="text-sm text-zinc-600 hover:text-zinc-900">
            About
          </a>
        </div>
      </nav>
    </header>
  );
}
