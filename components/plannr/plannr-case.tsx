import "./plannr.css";
import { PlannrHero } from "./plannr-hero";
import { PlannrDocument } from "./plannr-document";
import { PlannrTransformation } from "./plannr-transformation";
import { PlannrProduct } from "./plannr-product";
import { PlannrDecisions } from "./plannr-decisions";
import { PlannrSystem } from "./plannr-system";
import { PlannrReceipt } from "./plannr-receipt";

// PLANNR: the second flagship case study (M6A, static composition only).
// Rankle is loud, social, argumentative. Plannr is ordered, academic,
// documentary: an annotated course packet. Seven spreads on one .plannr-case
// scope (app/globals.css, "6b. PROJECT COLOR WORLDS"), the palette of the real
// product, never global tokens:
//
//   hero            the course packet: wordmark, transformation in one glance
//   document        the syllabus as protagonist
//   transformation  SYLLABUS -> EXTRACT -> REVIEW -> CALENDAR (M6B's foundation)
//   product         real screenshots, as evidence
//   decisions       what was actually difficult
//   system          how a syllabus travels
//   receipt         what exists, checked, and who built it
//
// Everything is server-rendered. There is no client component, no listener and
// no animation here: the interaction belongs to M6B, the choreography to M9.
// The M2 shell (masthead, navigation, footer) is untouched; this renders
// straight inside <main>, exactly as the Rankle case does.
export function PlannrCase() {
  return (
    <article className="plannr-case">
      <PlannrHero />
      <PlannrDocument />
      <PlannrTransformation />
      <PlannrProduct />
      <PlannrDecisions />
      <PlannrSystem />
      <PlannrReceipt />
    </article>
  );
}
