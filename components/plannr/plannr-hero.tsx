import Image from "next/image";
import { DocumentPage } from "./document-page";
import { TermGrid } from "./term-grid";
import { MarkArrow } from "@/components/design/marks";
import { PLANNR_LEDE, PLANNR_META } from "@/lib/work/plannr-content";

// PLANNR HERO: THE COURSE PACKET. A warm paper field, the wordmark as the one
// display moment, and the transformation stated before any body copy is read:
// a syllabus fragment with its deadlines highlighted, a pen arrow, and a
// crop of the term those deadlines land on. The registrar-form block underneath
// is real metadata, not decoration: what the thing is, where it runs, where it
// came from. No phone, no product screenshot here; the app appears in the
// spreads that explain it. The whole composition on the right is aria-hidden
// (the same document is real text in "The document") and hidden by Clean Copy
// where it is ornament; the form and the links carry everything.
export function PlannrHero() {
  return (
    <section className="stage page-grid pc-hero" aria-labelledby="plannr-hero-heading">
      <h1 id="plannr-hero-heading" className="pc-hero-word">
        <span className="t-display">Plannr</span>
      </h1>

      <p className="pc-hero-lede t-lede">{PLANNR_LEDE}</p>

      <div className="pc-hero-links">
        <a className="pc-link-solid" href={PLANNR_META.productHref} target="_blank" rel="noopener noreferrer">
          Join the free beta ↗
        </a>
        <a className="pc-link-plain" href={PLANNR_META.repoHref} target="_blank" rel="noopener noreferrer">
          Source on GitHub ↗
        </a>
      </div>

      <div className="pc-hero-art ornament" aria-hidden="true">
        <div className="pc-hero-doc layer-paper">
          <DocumentPage variant="fragment" />
        </div>
        <span className="pc-hero-arrow layer-annotation annotation">
          <MarkArrow />
        </span>
        <div className="pc-hero-grid layer-subject">
          <TermGrid fromWeek={2} toWeek={6} marked={["ps1", "obs1", "mid"]} />
        </div>
      </div>

      <dl className="pc-form">
        <div className="pc-form-row">
          <dt className="t-meta">Product</dt>
          <dd className="pc-form-product">
            <Image
              src="/plannr/plannr-icon.png"
              alt="Plannr's app icon: a gold star above a line drawing of a phone, on navy, with the name Plannr"
              width={64}
              height={64}
              className="pc-hero-icon"
              priority
            />
            <span>Syllabus to calendar</span>
          </dd>
        </div>
        <div className="pc-form-row">
          <dt className="t-meta">Platform</dt>
          <dd>{PLANNR_META.platform}, Python · FastAPI</dd>
        </div>
        <div className="pc-form-row">
          <dt className="t-meta">Status</dt>
          <dd>{PLANNR_META.status}</dd>
        </div>
        <div className="pc-form-row">
          <dt className="t-meta">Origin</dt>
          <dd>{PLANNR_META.origin}</dd>
        </div>
        <div className="pc-form-row">
          <dt className="t-meta">Since</dt>
          <dd>{PLANNR_META.since}</dd>
        </div>
      </dl>
    </section>
  );
}
