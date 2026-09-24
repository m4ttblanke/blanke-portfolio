import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Tests that render components (M6B) resolve the same "@/" alias as tsconfig.json.
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    // Convex functions run in an edge-like runtime; convex-test emulates it.
    // Individual files can opt into Node with a `// @vitest-environment node` docblock.
    environment: "edge-runtime",
    server: { deps: { inline: ["convex-test"] } },
    include: ["tests/**/*.test.ts"],
  },
});
