"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// Renders the admin tools only once Convex itself confirms this caller is an
// admin. Without this, a session that Convex rejects would crash the managers
// with an unhandled query error instead of explaining what is wrong.
//
// This component is only reachable by users who already passed the server-side
// email allow-list in the admin layout, so the diagnostics below are for the
// site owner and safe to show.
export function AdminGate({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const isAdmin = useQuery(api.admin.isAdmin, isAuthenticated ? {} : "skip");

  if (isLoading || (isAuthenticated && isAdmin === undefined)) {
    return <p role="status">Checking access…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div role="alert" className="space-y-2 text-sm text-zinc-700">
        <p className="font-medium">The database did not accept your session.</p>
        <p>
          Reload the page or sign in again. If this persists, check that{" "}
          <code>WORKOS_CLIENT_ID</code> is set in the Convex deployment
          environment and that <code>convex/auth.config.ts</code> has been
          deployed.
        </p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div role="alert" className="space-y-2 text-sm text-zinc-700">
        <p className="font-medium">
          You are signed in, but this account is not an admin in the database.
        </p>
        <p>
          Add your WorkOS user id to the Convex deployment environment:
        </p>
        <pre className="overflow-x-auto rounded bg-zinc-100 p-3">
          npx convex env set ADMIN_WORKOS_USER_IDS {userId}
        </pre>
      </div>
    );
  }

  return <>{children}</>;
}
