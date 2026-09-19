// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import nextConfig from "../../next.config";

// Regression guard for the post-login "This page couldn't load" crash.
//
// AuthKit's client provider refreshes the session via server actions. A
// refresh rewrites the session cookie, so Next re-renders the CURRENT route in
// the action response. If that route is a page that calls redirect(), the
// response embeds NEXT_REDIRECT while the router is also following the page's
// own redirect, and Next's root router crashes (React error #310).
//
// Therefore: the admin index must be an HTTP redirect (config), and no admin
// page may call redirect(). (The layout may, to turn away non-admins.)

const adminDir = join(__dirname, "../../app/(admin)");

function pageFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return pageFiles(full);
    return /^page\.(t|j)sx?$/.test(name) ? [full] : [];
  });
}

describe("admin index redirect", () => {
  it("/admin is a non-permanent HTTP redirect to /admin/projects", async () => {
    const redirects = (await nextConfig.redirects?.()) ?? [];
    const admin = redirects.find((r) => r.source === "/admin");
    expect(admin).toEqual({
      source: "/admin",
      destination: "/admin/projects",
      permanent: false,
    });
  });

  it("there is no admin index page to render", () => {
    expect(existsSync(join(adminDir, "admin/page.tsx"))).toBe(false);
  });

  it("no admin page calls redirect()", () => {
    const offenders = pageFiles(adminDir).filter((f) => /\bredirect\(/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });

  it("the guard actually inspects the admin pages", () => {
    expect(pageFiles(adminDir).length).toBeGreaterThanOrEqual(3);
  });
});
