import "./rankle.css";
import { RankleHero } from "./rankle-hero";
import { RankleThing } from "./rankle-thing";
import { RankleArgument } from "./rankle-argument";
import { RankleSystem } from "./rankle-system";
import { RankleReceipt } from "./rankle-receipt";

// RANKLE — the flagship case study (M5A). Five editorial spreads, each its
// own hand-art-directed .stage (ART_DIRECTION.md §50: "several editorial
// spreads connected vertically," not one continuous layout). .rankle-case is
// the color-world scope (app/globals.css, "6b. PROJECT COLOR WORLDS") --
// Rankle's red/yellow/blue exist only inside this wrapper, never globally.
//
// Static only (M5A brief §31): no drag, no cursor, no scroll choreography.
// The M2 shell (masthead, nav, footer) is untouched -- this renders straight
// inside <main>, the same pattern as the homepage's Cover + SelectedWork.
export function RankleCase() {
  return (
    <article className="rankle-case">
      <RankleHero />
      <RankleThing />
      <RankleArgument />
      <RankleSystem />
      <RankleReceipt />
    </article>
  );
}
