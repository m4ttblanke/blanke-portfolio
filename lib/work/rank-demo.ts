// THE RANK DEMO — pure state logic for M5B's one signature interaction.
//
// Framework-free on purpose: this repo's existing tests (tests/work/*.test.ts)
// are all plain @vitest-environment node source/logic tests, with no jsdom or
// component-rendering library anywhere in the codebase. Rather than add one
// (jsdom, @testing-library/react) just to test this, the state transitions
// live here as plain functions the React layer only wires up -- so the
// M5B interaction is fully unit-testable with zero new dependencies, and
// components/rankle/rankle-rank-interaction.tsx stays a thin client shell.
//
// This is an EDITORIAL DEMONSTRATION of the verb "rank," not a miniature
// Rankle client: four abstract shapes, no invented items, no network call,
// no persistence (state resets on refresh, which is correct -- see the
// component's own header comment).

export const RANK_DEMO_TIERS = ["S", "A", "B", "C", "F"] as const;
export type RankDemoTier = (typeof RANK_DEMO_TIERS)[number];

export type RankDemoShape = "circle" | "square" | "triangle" | "diamond";

export type RankDemoItem = {
  id: RankDemoShape;
  /** The real, only accessible name for this object -- a shape, nothing invented. */
  label: string;
  tier: RankDemoTier | null;
};

export function initialRankDemoItems(): RankDemoItem[] {
  return [
    { id: "circle", label: "Circle", tier: null },
    { id: "square", label: "Square", tier: null },
    { id: "triangle", label: "Triangle", tier: null },
    { id: "diamond", label: "Diamond", tier: null },
  ];
}

/**
 * Assigns one item to a tier. Pressing the tier it already holds un-ranks it
 * (returns it to the pool) -- one control, one mental model, no separate
 * "remove" affordance needed. Pure: returns a new array, no side effects.
 */
export function assignTier(items: readonly RankDemoItem[], id: RankDemoShape, tier: RankDemoTier): RankDemoItem[] {
  return items.map((item) => (item.id === id ? { ...item, tier: item.tier === tier ? null : tier } : item));
}

export function resetRanking(items: readonly RankDemoItem[]): RankDemoItem[] {
  return items.map((item) => ({ ...item, tier: null }));
}

export function isComplete(items: readonly RankDemoItem[]): boolean {
  return items.length > 0 && items.every((item) => item.tier !== null);
}

export function hasStarted(items: readonly RankDemoItem[]): boolean {
  return items.some((item) => item.tier !== null);
}

/** A short, concrete live-region announcement -- never a growing log. */
export function announce(item: RankDemoItem): string {
  return item.tier ? `${item.label} moved to ${item.tier} tier.` : `${item.label} returned to unranked.`;
}
