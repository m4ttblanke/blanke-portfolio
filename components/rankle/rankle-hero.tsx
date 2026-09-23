import Image from "next/image";
import { RANKLE_META, RANKLE_TAGLINE } from "@/lib/work/rankle-content";

// RANKLE HERO — the opening. One dominant visual idea (brief §9/§59): the
// oversized wordmark, in Rankle's own black-and-paper, continuing straight
// from the M4 poster's black ground rather than introducing a new surface.
// The tier-stack in the corner is a subordinate accent, not a second hero --
// it continues the M4 poster's tier-band language (rk-band in
// selected-work.css) at a larger, looser scale, never competing with RANKLE
// for attention. No screenshot, no fake UI: this is graphic composition.
//
// The one real Rankle asset that exists (public/rankle/rankle-mark.svg, the
// product's own app icon, copied verbatim from github.com/m4ttblanke/rankle)
// sits quietly in the metadata row -- small, honestly captioned, never
// presented as a screenshot or as more evidence than it is.
export function RankleHero() {
  return (
    <section className="stage page-grid rk-hero" aria-labelledby="rankle-hero-heading">
      <span className="rk-hero-stack ornament" aria-hidden="true">
        <span className="rk-hero-tier rk-hero-tier-s tilt-cw-1">S</span>
        <span className="rk-hero-tier rk-hero-tier-a tilt-ccw-2">A</span>
        <span className="rk-hero-tier rk-hero-tier-b tilt-cw-2">B</span>
      </span>

      <h1 id="rankle-hero-heading" className="rk-hero-word">
        <span className="t-display">Rankle</span>
      </h1>

      <p className="rk-hero-tagline t-lede">{RANKLE_TAGLINE}</p>

      <div className="rk-hero-meta">
        <Image
          src="/rankle/rankle-mark.svg"
          alt="Rankle's app icon: three stacked, tilted ranking cards"
          width={40}
          height={40}
          className="rk-hero-mark"
        />
        <p className="t-meta">{RANKLE_META.status} — rankle.io</p>
        <p className="t-meta">{RANKLE_META.stack}</p>
        <p className="t-meta">{RANKLE_META.built}</p>
      </div>
    </section>
  );
}
