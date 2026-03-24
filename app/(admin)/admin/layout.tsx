import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await withAuth({ ensureSignedIn: true });

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <nav className="flex gap-4">
            <a
              href="/admin/projects"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              Projects
            </a>
            <a
              href="/admin/experience"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              Experience
            </a>
            <a
              href="/admin/coursework"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              Coursework
            </a>
          </nav>
          <a
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-700 underline"
          >
            View site
          </a>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
