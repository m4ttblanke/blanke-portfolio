"use client";

import { useEffect, useRef, useState } from "react";
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
  type RankDemoItem,
  type RankDemoShape,
  type RankDemoTier,
} from "@/lib/work/rank-demo";
import { RankGlyph } from "./rank-glyphs";

// THE RANK DEMO — M5B's one signature interaction, and the only client
// component on this page. State logic is a plain, framework-free module
// (lib/work/rank-demo.ts) with its own independently-tested pure functions.
//
// VISUAL MODEL (rebuilt after review: the first pass read as a form -- four
// bordered rows, twenty permanently-visible buttons, five empty input-look
// boxes). This is a SELECTED-OBJECT model instead: pick a shape up (select
// it), then choose one of five tier destinations. Only one tier field
// exists on the page; a shape's own button is its only permanent control.
// The five tier-destination buttons stay in the DOM but `disabled` until
// something is selected -- exposed, not hidden, the moment a shape is
// picked up (brief's own suggested architecture), never removed from a
// keyboard user's reach once relevant.
//
// Ephemeral by design: component-local React state only. No network call,
// no localStorage, nothing persisted -- refreshing resets it, correctly.
export function RankleRankInteraction() {
  const [items, setItems] = useState<RankDemoItem[]>(initialRankDemoItems);
  const [selectedId, setSelectedId] = useState<RankDemoShape | null>(null);
  const [status, setStatus] = useState("");
  const pendingFocusId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstTierTargetRef = useRef<HTMLButtonElement>(null);

  // Placement moves an item's <li> into a different tier's <ul> -- a real
  // DOM relocation. Follow it with focus once React has actually re-rendered.
  useEffect(() => {
    if (!pendingFocusId.current) return;
    document.getElementById(pendingFocusId.current)?.focus();
    pendingFocusId.current = null;
  }, [items]);

  // The moment a shape is picked up, move focus straight to its first
  // destination so "select, then choose a tier" reads as one continuous
  // keyboard motion, not two separate lookups.
  useEffect(() => {
    if (selectedId) firstTierTargetRef.current?.focus();
  }, [selectedId]);

  function handleSelect(id: RankDemoShape) {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (selectedId === id) {
      setSelectedId(null);
      setStatus(announceDeselect(item));
    } else {
      setSelectedId(id);
      setStatus(announceSelect(item));
    }
  }

  function handlePlace(tier: RankDemoTier) {
    if (!selectedId) return;
    const id = selectedId;
    pendingFocusId.current = `rank-shape-${id}`;
    setItems((prev) => {
      const next = assignTier(prev, id, tier);
      const changed = next.find((item) => item.id === id);
      if (changed) setStatus(announce(changed));
      return next;
    });
    setSelectedId(null);
  }

  function handleReset() {
    setItems((prev) => resetRanking(prev));
    setSelectedId(null);
    setStatus("Ranking reset.");
    containerRef.current?.focus();
  }

  const unranked = items.filter((item) => item.tier === null);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const complete = isComplete(items);
  const started = hasStarted(items);

  return (
    <div ref={containerRef} tabIndex={-1} className="rk-rank-demo" aria-label="Rank four shapes into tiers">
      <p className="t-caption rk-rank-caption">Rank the shapes — select one, then choose a tier.</p>

      {unranked.length > 0 && (
        <ul className="rk-rank-shapes" aria-label="Unranked">
          {unranked.map((item) => (
            <ShapeSlip key={item.id} item={item} selected={selectedId === item.id} onSelect={handleSelect} />
          ))}
        </ul>
      )}

      <ol className="rk-rank-tiers">
        {RANK_DEMO_TIERS.map((tier, i) => (
          <li key={tier} className={`rk-rank-tier rk-rt-${tier.toLowerCase()}`}>
            <span className="rk-rank-tier-letter" aria-hidden="true">
              {tier}
            </span>
            <ul className="rk-rank-tier-items" aria-label={`${tier} tier`}>
              {items
                .filter((item) => item.tier === tier)
                .map((item) => (
                  <ShapeSlip key={item.id} item={item} selected={selectedId === item.id} onSelect={handleSelect} compact />
                ))}
            </ul>
            <button
              ref={i === 0 ? firstTierTargetRef : undefined}
              type="button"
              className="rk-rank-tier-target"
              disabled={!selected}
              aria-pressed={selected ? selected.tier === tier : undefined}
              onClick={() => handlePlace(tier)}
            >
              {selected ? `Move ${selected.label} to ${tier} tier` : `${tier} tier`}
            </button>
          </li>
        ))}
      </ol>

      {/* Concise, non-repeating: only real state changes are announced. */}
      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <div className="rk-rank-controls">
        {complete && <p className="rk-rank-done">RANKED.</p>}
        {started && (
          <button type="button" className="rk-rank-reset" onClick={handleReset}>
            Reset ↺
          </button>
        )}
      </div>
    </div>
  );
}

const TILT: Record<RankDemoShape, string> = {
  circle: "tilt-ccw-1",
  square: "tilt-cw-1",
  triangle: "tilt-ccw-2",
  diamond: "tilt-cw-2",
};

function ShapeSlip({
  item,
  selected,
  onSelect,
  compact,
}: {
  item: RankDemoItem;
  selected: boolean;
  onSelect: (id: RankDemoShape) => void;
  compact?: boolean;
}) {
  return (
    <li>
      <button
        id={`rank-shape-${item.id}`}
        type="button"
        className={`rk-rank-shape${compact ? " rk-rank-shape-compact" : ""}${selected ? "" : ` ${TILT[item.id]}`}`}
        aria-pressed={selected}
        aria-label={item.tier ? `${item.label}, ranked ${item.tier}. Press to pick up.` : `${item.label}. Press to pick up.`}
        onClick={() => onSelect(item.id)}
      >
        <span className="rk-rank-glyph" aria-hidden="true">
          <RankGlyph shape={item.id} />
        </span>
        <span className="rk-rank-shape-name">{item.label}</span>
      </button>
    </li>
  );
}
