// @vitest-environment node
import { describe, expect, it } from "vitest";
import { contrastRatio, grade, relativeLuminance } from "../../lib/design/contrast";
import { BLOCK_TILTS, NUDGES, STICKER_TILTS, blockTilt, hashString, nudge, pick, stickerTilt } from "../../lib/design/seed";

describe("deterministic chaos (seed)", () => {
  it("hashes are stable: the same slug always gets the same value", () => {
    expect(hashString("rankle")).toBe(hashString("rankle"));
    expect(hashString("rankle")).not.toBe(hashString("plannr"));
    // pinned so a change of algorithm (which would reshuffle every tilt) is a conscious decision
    expect(hashString("rankle")).toBe(3067758236);
  });

  it("only ever returns named presets that exist as CSS classes", () => {
    for (const id of ["rankle", "plannr", "ranktheref", "a", "", "zz-m0-test"]) {
      expect(BLOCK_TILTS).toContain(blockTilt(id));
      expect(STICKER_TILTS).toContain(stickerTilt(id));
      expect(NUDGES).toContain(nudge(id));
    }
  });

  it("is deterministic across repeated calls and varies across ids", () => {
    const ids = Array.from({ length: 24 }, (_, i) => `project-${i}`);
    const first = ids.map(blockTilt);
    expect(ids.map(blockTilt)).toEqual(first);
    expect(new Set(first).size).toBeGreaterThan(1);
  });

  it("uses different salts so tilt and nudge are not locked together", () => {
    const ids = Array.from({ length: 40 }, (_, i) => `id-${i}`);
    const combos = new Set(ids.map((id) => `${blockTilt(id)}|${nudge(id)}`));
    expect(combos.size).toBeGreaterThan(6);
  });

  it("refuses an empty preset list", () => {
    expect(() => pick("x", [])).toThrow();
  });
});

describe("contrast math", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(contrastRatio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBe(0);
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 1);
  });
  it("grades ratios into what they are good for", () => {
    expect(grade(7.1)).toBe("AAA");
    expect(grade(4.6)).toBe("AA");
    expect(grade(3.2)).toBe("large text and graphics only");
    expect(grade(2.9)).toBe("fails");
  });
  it("rejects malformed colors", () => {
    expect(() => relativeLuminance("red")).toThrow();
  });
});
