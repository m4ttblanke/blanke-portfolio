// @vitest-environment node
import { describe, expect, it } from "vitest";
import { isAllowedAdminEmail, parseEmailList } from "../../lib/admin-access";
import { isAdminPath } from "../../lib/route-access";

describe("admin email gate fails closed", () => {
  const verified = (email: string) => ({ email, emailVerified: true });

  it("admits nobody when ADMIN_ALLOWED_EMAILS is unset, empty or only separators", () => {
    expect(isAllowedAdminEmail(verified("me@example.com"), undefined)).toBe(false);
    expect(isAllowedAdminEmail(verified("me@example.com"), "")).toBe(false);
    expect(isAllowedAdminEmail(verified("me@example.com"), " , ,")).toBe(false);
  });

  it("admits a listed, verified email, case-insensitively and trimmed", () => {
    expect(isAllowedAdminEmail(verified("Me@Example.com"), " me@example.com , other@example.com")).toBe(true);
  });

  it("rejects unlisted emails, unverified emails, and missing users", () => {
    expect(isAllowedAdminEmail(verified("intruder@example.com"), "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail({ email: "me@example.com", emailVerified: false }, "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail({ email: "me@example.com" }, "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail({ email: null, emailVerified: true }, "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail(null, "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail(undefined, "me@example.com")).toBe(false);
  });

  it("does not match by substring", () => {
    expect(isAllowedAdminEmail(verified("me@example.com.evil.io"), "me@example.com")).toBe(false);
    expect(isAllowedAdminEmail(verified("xme@example.com"), "me@example.com")).toBe(false);
  });

  it("parses lists", () => {
    expect(parseEmailList("A@x.com, b@x.com,,")).toEqual(["a@x.com", "b@x.com"]);
  });
});

describe("only the admin surface is protected", () => {
  it("protects /admin and everything beneath it", () => {
    for (const p of ["/admin", "/admin/", "/admin/projects", "/admin/experience/123"]) {
      expect(isAdminPath(p), p).toBe(true);
    }
  });

  it("leaves the public site, SEO routes, assets, callback and Plannr public", () => {
    const publicPaths = [
      "/", "/projects", "/projects/rankle", "/experience", "/coursework", "/about",
      "/robots.txt", "/sitemap.xml", "/opengraph-image", "/file.svg", "/favicon.ico",
      "/images/hero.avif", "/resume.pdf", "/callback", "/plannr", "/plannr/",
      "/plannr/privacy", "/plannr/terms", "/administrator", "/adminx",
    ];
    for (const p of publicPaths) expect(isAdminPath(p), p).toBe(false);
  });
});
