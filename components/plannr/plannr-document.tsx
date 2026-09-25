import { DocumentPage } from "./document-page";
import { DOCUMENT_DISCLAIMER } from "@/lib/work/plannr-content";

// THE DOCUMENT: the syllabus is the protagonist of this spread, set large and
// physically (binder holes, highlighter) with margin notes that say, in real
// text, what each mark means, each one anchored to the line it is about (beside
// it on wide screens, directly under it on narrow ones). Notes are pen-blue
// Schibsted, not a handwriting font; the real handwriting layer is M11. Reading
// order: the intro, then the document with its notes in place.
export function PlannrDocument() {
  return (
    <section className="stage page-grid pc-document" aria-labelledby="plannr-document-heading">
      <header className="pc-document-head">
        <p className="t-meta">The document</p>
        <h2 id="plannr-document-heading" className="t-head-2">
          The dates are already written down. Just not like dates.
        </h2>
      </header>

      <div className="pc-document-prose">
        <p className="t-body">
          Every instructor writes a syllabus their own way, and a term brings a handful of them. Deadlines sit in a
          table on one page, in a sentence on another, in a phrase that only makes sense next to the start date.
        </p>
        <p className="t-body">
          Plannr starts from the document as it is: a PDF with selectable text, or the text pasted in. Scans and
          photos aren&rsquo;t supported in the beta yet.
        </p>
      </div>

      <figure className="pc-document-figure">
        <DocumentPage variant="full" notes />
        <figcaption className="t-caption pc-disclaimer">{DOCUMENT_DISCLAIMER}</figcaption>
      </figure>
    </section>
  );
}
