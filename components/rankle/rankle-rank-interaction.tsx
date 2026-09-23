"use client";

import { useEffect, useRef, useState } from "react";
import {
  RANK_DEMO_TIERS,
  announce,
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
// component on this page (everything else stays server-rendered; see
// lib/work/rank-demo.ts's header comment for why the state logic itself
// lives outside React, in a plain, independently-tested module).
//
// The mechanism is deliberately NOT drag-and-drop. Every rankable object
// carries its own row of five tier buttons; pressing one assigns it (press
// the same one again to un-rank). This is the brief's own preferred model
// when drag would be fragile on touch (§5): one control, works identically
// with a pointer, a keyboard (Tab + Enter/Space, real <button> elements,
// nothing synthesized), or a finger, no spatial precision required at all.
// No pointer-drag enhancement was added on top of it -- see the M5B report's
// self-critique for why that was a deliberate choice, not an omission.
//
// Ephemeral by design: state is component-local useState, nothing is
// persisted (no localStorage), nothing is sent anywhere. Refreshing resets
// it, which is correct -- this demonstrates the verb "rank," not the real
// Rankle account/session model.
//
// FOCUS RESTORATION: assigning a tier moves an item's <li> from the pool's
// <ul> into a tier's own <ul> -- a real DOM relocation, not just a style
// change (that IS the "pieces moving into tier bands" the brief asked for).
// React does not carry keyboard focus across that move on its own: testing
// with Playwright against a live page (the Chrome extension used for this
// session's other screenshots had disconnected) surfaced exactly this --
// after pressing a tier button, focus silently fell back to nowhere
// specific, so a keyboard/screen-reader user lost their place after every
// single action. Fixed by giving every tier button a stable, predictable id
// and, after each assignment, imperatively refocusing the button for that
// same item+tier pair in its new location once React has re-rendered.
export function RankleRankInteraction() {
  const [items, setItems] = useState<RankDemoItem[]>(initialRankDemoItems);
  const [status, setStatus] = useState("");
  const pendingFocusId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pendingFocusId.current) return;
    const target = document.getElementById(pendingFocusId.current);
    target?.focus();
    pendingFocusId.current = null;
  }, [items]);

  function handleAssign(id: RankDemoShape, tier: RankDemoTier) {
    pendingFocusId.current = pickId(id, tier);
    setItems((prev) => {
      const next = assignTier(prev, id, tier);
      const changed = next.find((item) => item.id === id);
      if (changed) setStatus(announce(changed));
      return next;
    });
  }

  function handleReset() {
    setItems((prev) => resetRanking(prev));
    setStatus("Ranking reset.");
    // The Reset control itself unmounts once nothing is ranked -- move focus
    // to the (stable, never-unmounting) container instead of losing it.
    containerRef.current?.focus();
  }

  const unranked = items.filter((item) => item.tier === null);
  const complete = isComplete(items);
  const started = hasStarted(items);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="rk-rank-demo"
      aria-label="Try it: rank four shapes into tiers. Not the real game."
    >
      <p className="t-meta rk-rank-caption">Try it — not the real game</p>

      {unranked.length > 0 && (
        <ul className="rk-rank-pool" aria-label="Unranked">
          {unranked.map((item) => (
            <RankSlip key={item.id} item={item} onAssign={handleAssign} />
          ))}
        </ul>
      )}

      <ol className="rk-rank-tiers">
        {RANK_DEMO_TIERS.map((tier) => (
          <li key={tier} className={`rk-rank-tier rk-rt-${tier.toLowerCase()}`}>
            <span className="rk-rank-tier-label" aria-hidden="true">
              {tier}
            </span>
            <ul className="rk-rank-tier-slot" aria-label={`${tier} tier`}>
              {items
                .filter((item) => item.tier === tier)
                .map((item) => (
                  <RankSlip key={item.id} item={item} onAssign={handleAssign} />
                ))}
            </ul>
          </li>
        ))}
      </ol>

      {/* Concise, non-repeating: only real state changes are announced, not
          decorative transitions (brief §20). Visually hidden -- the tier
          buttons' own aria-pressed state and visible position already carry
          this sighted. */}
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

function pickId(id: RankDemoShape, tier: RankDemoTier): string {
  return `rank-pick-${id}-${tier}`;
}

function RankSlip({
  item,
  onAssign,
}: {
  item: RankDemoItem;
  onAssign: (id: RankDemoShape, tier: RankDemoTier) => void;
}) {
  return (
    <li className="rk-rank-slip">
      <span className="rk-rank-glyph" aria-hidden="true">
        <RankGlyph shape={item.id} />
      </span>
      <span className="rk-rank-slip-name">{item.label}</span>
      <span className="rk-rank-picker" role="group" aria-label={`Rank ${item.label}`}>
        {RANK_DEMO_TIERS.map((tier) => (
          <button
            key={tier}
            id={pickId(item.id, tier)}
            type="button"
            className={`rk-rank-pick rk-rank-pick-${tier.toLowerCase()}`}
            aria-pressed={item.tier === tier}
            aria-label={`${item.label}, ${tier} tier`}
            onClick={() => onAssign(item.id, tier)}
          >
            {tier}
          </button>
        ))}
      </span>
    </li>
  );
}
