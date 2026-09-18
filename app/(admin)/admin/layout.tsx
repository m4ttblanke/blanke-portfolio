import Link from "next/link";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { AdminProviders } from "@/components/admin/admin-providers";
import { AdminGate } from "@/components/admin/admin-gate";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await withAuth({ ensureSignedIn: true });

  // Fail closed: a missing/empty ADMIN_ALLOWED_EMAILS admits nobody. This is
  // only the UI gate; Convex independently enforces who may read drafts or
  // write content (convex/lib/access.ts).
  if (!isAllowedAdminEmail(user, process.env.ADMIN_ALLOWED_EMAILS)) {
    redirect("/");
  }

  return (
    <AdminProviders>
      <div className="min-h-screen bg-zinc-50">
        <header className="border-b border-zinc-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <nav className="flex gap-4">
              <Link
                href="/admin/projects"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Projects
              </Link>
              <Link
                href="/admin/experience"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Experience
              </Link>
              <Link
                href="/admin/coursework"
                className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                Coursework
              </Link>
            </nav>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-700 underline"
            >
              View site
            </Link>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">
          <AdminGate userId={user.id}>{children}</AdminGate>
        </main>
      </div>
    </AdminProviders>
  );
}
