import type { AuthConfig } from "convex/server";

// Convex verifies WorkOS AuthKit access tokens (the same JWT the Next.js app
// holds in the user's session) against WorkOS's public keys for this client.
//
// WORKOS_CLIENT_ID must be set in the *Convex deployment* environment, not just
// in Vercel:  npx convex env set WORKOS_CLIENT_ID client_XXXX
//
// Only the AuthKit (user management) issuer is trusted. The issuer embeds the
// client id, so tokens minted for any other WorkOS application are rejected.
const clientId = process.env.WORKOS_CLIENT_ID;

if (!clientId) {
  throw new Error(
    "WORKOS_CLIENT_ID is not set in the Convex deployment environment. " +
      "Run `npx convex env set WORKOS_CLIENT_ID <your WorkOS client id>`."
  );
}

export default {
  providers: [
    {
      type: "customJwt",
      issuer: `https://api.workos.com/user_management/${clientId}`,
      algorithm: "RS256",
      jwks: `https://api.workos.com/sso/jwks/${clientId}`,
    },
  ],
} satisfies AuthConfig;
