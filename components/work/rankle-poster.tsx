import Link from "next/link";
import { RANKLE } from "@/lib/work/projects";

// RANKLE — M4A entry poster only. "Loud, playful, competitive, social" (M4A
// brief §9 / ART_DIRECTION.md §16): a black ground (reusing --color-ink, not a
// new near-duplicate black) with three tier bands in Rankle's own red/yellow/
// blue, standing in for "ranking cards" and "tier bands" until real product
// assets exist. Slightly off-axis (tilt-ccw-1): the one flagship that behaves
// like a pasted, physical game poster -- the semantic-vandalism reason is the
// same one that lets it own the cover→wall intrusion (see selected-work.css).
// Deep Rankle art direction (real assets, playable ranking, results) is M5;
// this is the cover, not the article.
export function RankleWorkPoster() {
  return (
    <Link
      href={RANKLE.href}
      aria-label={RANKLE.accessibleName}
      className="work-poster wall-rankle tilt-ccw-1"
    >
      <span className="rk-bands ornament" aria-hidden="true">
        <span className="rk-band rk-band-1">01</span>
        <span className="rk-band rk-band-2">02</span>
        <span className="rk-band rk-band-3">03</span>
      </span>

      <span className="work-poster-body">
        <h3 className="t-display rk-title">
          <span>{RANKLE.name}</span>
        </h3>
        <p className="t-meta rk-meta">{RANKLE.meta}</p>
        <p className="t-small rk-descriptor">{RANKLE.descriptor}</p>
      </span>
    </Link>
  );
}
