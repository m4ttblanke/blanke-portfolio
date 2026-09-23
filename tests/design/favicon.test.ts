// @vitest-environment node
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Not brittle: no pixel/byte-content assertions. Just confirms the intended
// Next.js file-convention icon assets exist, replace the old default/fake
// favicon, and stay sensibly sized -- not a giant unprocessed source asset.
const root = join(__dirname, "../..");

describe("favicon / portfolio icon identity (M4C)", () => {
  it("ships the three idiomatic Next.js icon files, each a sensible production size", () => {
    // The old favicon.ico was a mislabeled 1024x1024 PNG (~1.3MB) -- a real,
    // small, multi-resolution ICO replaces it here.
    const favicon = statSync(join(root, "app/favicon.ico"));
    expect(favicon.size).toBeGreaterThan(1000); // not empty/corrupt
    expect(favicon.size).toBeLessThan(50 * 1024); // not the old 1.3MB asset

    const icon = statSync(join(root, "app/icon.png"));
    expect(icon.size).toBeGreaterThan(1000);
    expect(icon.size).toBeLessThan(500 * 1024); // sensible for a 512px PNG

    const apple = statSync(join(root, "app/apple-icon.png"));
    expect(apple.size).toBeGreaterThan(1000);
    expect(apple.size).toBeLessThan(200 * 1024);
  });

  it("declares no manual icon metadata that would conflict with the file-convention icons", () => {
    // app/favicon.ico, app/icon.png and app/apple-icon.png are auto-detected
    // by Next.js; layout.tsx must not also declare `icons` in `metadata`,
    // which would create two sources of truth.
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    expect(layout).not.toMatch(/icons\s*:/);
  });
});
