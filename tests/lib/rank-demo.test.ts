// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  RANK_DEMO_TIERS,
  announce,
  announceDeselect,
  announceSelect,
  assignTier,
  hasStarted,
  initialRankDemoItems,
  isComplete,
  resetRanking,
} from "../../lib/work/rank-demo";

describe("rank demo — initial state", () => {
  it("starts with four unranked, unlabeled-as-real-items shapes", () => {
    const items = initialRankDemoItems();
    expect(items).toHaveLength(4);
    expect(items.map((i) => i.id)).toEqual(["circle", "square", "triangle", "diamond"]);
    expect(items.every((i) => i.tier === null)).toBe(true);
  });

  it("uses Rankle's real tier vocabulary, S through F, N/A omitted", () => {
    expect(RANK_DEMO_TIERS).toEqual(["S", "A", "B", "C", "F"]);
  });

  it("is not started and not complete before anything is ranked", () => {
    const items = initialRankDemoItems();
    expect(hasStarted(items)).toBe(false);
    expect(isComplete(items)).toBe(false);
  });
});

describe("rank demo — assignment", () => {
  it("assigns an item to a tier", () => {
    const items = initialRankDemoItems();
    const next = assignTier(items, "circle", "S");
    expect(next.find((i) => i.id === "circle")?.tier).toBe("S");
    // every other item is untouched
    expect(next.find((i) => i.id === "square")?.tier).toBeNull();
  });

  it("moves an item directly between tiers without an intermediate unranked state", () => {
    let items = initialRankDemoItems();
    items = assignTier(items, "square", "F");
    items = assignTier(items, "square", "A");
    expect(items.find((i) => i.id === "square")?.tier).toBe("A");
  });

  it("pressing the already-assigned tier again un-ranks the item (the one reset-per-item control)", () => {
    let items = initialRankDemoItems();
    items = assignTier(items, "triangle", "B");
    items = assignTier(items, "triangle", "B");
    expect(items.find((i) => i.id === "triangle")?.tier).toBeNull();
  });

  it("is pure: never mutates its input array", () => {
    const items = initialRankDemoItems();
    const snapshot = JSON.stringify(items);
    assignTier(items, "diamond", "C");
    expect(JSON.stringify(items)).toBe(snapshot);
  });
});

describe("rank demo — completion and reset", () => {
  it("is only complete once all four items hold a tier", () => {
    let items = initialRankDemoItems();
    for (const id of ["circle", "square", "triangle"] as const) items = assignTier(items, id, "A");
    expect(isComplete(items)).toBe(false);
    items = assignTier(items, "diamond", "F");
    expect(isComplete(items)).toBe(true);
  });

  it("hasStarted is true the moment any single item is ranked", () => {
    const items = assignTier(initialRankDemoItems(), "circle", "S");
    expect(hasStarted(items)).toBe(true);
  });

  it("reset clears every tier back to null", () => {
    let items = initialRankDemoItems();
    for (const id of ["circle", "square", "triangle", "diamond"] as const) items = assignTier(items, id, "S");
    items = resetRanking(items);
    expect(items.every((i) => i.tier === null)).toBe(true);
    expect(isComplete(items)).toBe(false);
    expect(hasStarted(items)).toBe(false);
  });
});

describe("rank demo — announcements", () => {
  it("announces a concrete, concise move", () => {
    const item = assignTier(initialRankDemoItems(), "circle", "S").find((i) => i.id === "circle")!;
    expect(announce(item)).toBe("Circle moved to S tier.");
  });

  it("announces an un-rank distinctly", () => {
    const item = { id: "circle" as const, label: "Circle", tier: null };
    expect(announce(item)).toBe("Circle returned to unranked.");
  });

  it("announces picking a shape up, and putting it back down without placing it", () => {
    const item = { id: "square" as const, label: "Square", tier: null };
    expect(announceSelect(item)).toBe("Square selected. Choose a tier.");
    expect(announceDeselect(item)).toBe("Square deselected.");
  });
});

describe("rank demo — no invented content", () => {
  it("every item's label is a plain shape name, nothing resembling real Rankle content", () => {
    const banned = /movie|food|show|player|person|celebrity|brand|restaurant/i;
    for (const item of initialRankDemoItems()) {
      expect(item.label).not.toMatch(banned);
      expect(item.id).not.toMatch(banned);
    }
  });
});
