"use client";

import { useCallback, useMemo } from "react";
import { ConvexProviderWithAuth } from "convex/react";
import {
  AuthKitProvider,
  useAccessToken,
  useAuth,
} from "@workos-inc/authkit-nextjs/components";
import { convex } from "@/lib/convex";

// Hands the signed-in user's WorkOS access token to the Convex client, so every
// admin query/mutation reaches Convex as an authenticated call. Convex verifies
// the token itself (convex/auth.config.ts) and decides who is an admin.
//
// This mirrors the official `@convex-dev/workos` adapter, which targets
// `@workos-inc/authkit-react`; this project uses `authkit-nextjs`.
function useAuthFromAuthKit() {
  const { user, loading } = useAuth();
  const { getAccessToken, refresh } = useAccessToken();

  const fetchAccessToken = useCallback(
    async ({ forceRefreshToken }: { forceRefreshToken: boolean }) => {
      if (!user) return null;
      try {
        const token = forceRefreshToken ? await refresh() : await getAccessToken();
        return token ?? null;
      } catch {
        return null;
      }
    },
    [user, getAccessToken, refresh]
  );

  return useMemo(
    () => ({ isLoading: loading, isAuthenticated: !!user, fetchAccessToken }),
    [loading, user, fetchAccessToken]
  );
}

// Only mounted under /admin (the only place AuthKit middleware runs), so the
// public site ships neither the auth client nor the Convex client.
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthKitProvider>
      <ConvexProviderWithAuth client={convex} useAuth={useAuthFromAuthKit}>
        {children}
      </ConvexProviderWithAuth>
    </AuthKitProvider>
  );
}
