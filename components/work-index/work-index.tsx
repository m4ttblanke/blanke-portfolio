import Link from "next/link";
import { ARCHIVE, FEATURES, type ArchiveEntry, type Feature, type Link as EntryLink } from "@/lib/work/archive";
import { CoursesShot, PlannrPlate, RanklePlate, RoutingRun, RuleSheet } from "./artifacts";
import "./work-index.css";

// THE WORK INDEX (M7): /projects as the issue's contents and back catalog.
// Content truth: lib/work/archive.ts and docs/planning/m7-work-evidence.md.
//
// Three levels, and the page is built so the difference is obvious without
// reading a word:
//
//   OPENING   the contents: a title, one sentence, and every entry by number
//   FEATURES  Rankle and Plannr. The only display type on the page, the only
//             project color, alternating plates. Each links to its case study.
//   ARCHIVE   after a heavy rule, a denser, stricter catalog: number and date
//             in the margin, the entry on the masthead's column, one exhibit
//             beside it. Paper, ink and one red mark per exhibit.
//
// Server-rendered, no client component. Nothing moves; M9 owns motion.

const NEW_TAB = " (opens in a new tab)";

function EntryAnchor({ link, className }: { link: EntryLink; className?: string }) {
  const hidden = `${link.context ? `: ${link.context}` : ""}${link.external ? NEW_TAB : ""}`;
  const body = (
    <>
      {link.label}
      {link.external && (
        <span className="wi-ext" aria-hidden="true">
          {"\u00a0↗"}
        </span>
      )}
      {hidden && <span className="sr-only">{hidden}</span>}
    </>
  );
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    // /plannr/ is a rewrite to another site: a plain anchor, not a client transition.
    <a href={link.href} className={className}>
      {body}
    </a>
  );
}

const EXHIBIT: Record<string, () => React.JSX.Element> = {
  "ucsb-courses-search": CoursesShot,
  "network-protocols": RoutingRun,
  "this-publication": RuleSheet,
};

export type IndexedProject = { id: string; title: string; year: string; description: string; href: string };

export function WorkIndex({ filed = [] }: { filed?: readonly IndexedProject[] }) {
  return (
    <div className="work-index page-grid">
      <header className="wi-head">
        <p className="wi-folio t-meta t-soft">Issue 001 · Work, 2025–2026</p>
        <h1 className="wi-title">Work</h1>
        <p className="wi-standfirst t-lede">
          Two products, each told in full. Then the archive: the coursework and smaller builds around them, each with
          something you can check.
        </p>

        <nav className="wi-contents" aria-label="Contents">
          <ContentsGroup label="Features" items={FEATURES.map((f) => ({ id: f.id, number: f.number, title: f.name, when: f.year }))} />
          <ContentsGroup label="Archive" items={ARCHIVE.map((e) => ({ id: e.id, number: e.number, title: e.title, when: e.period }))} />
        </nav>
      </header>

      <section className="wi-features" aria-labelledby="wi-features-title">
        <div className="wi-sechead">
          <h2 id="wi-features-title" className="wi-sectitle">
            Features
          </h2>
          <p className="t-meta t-soft">01–02 · Case studies</p>
        </div>
        {FEATURES.map((f) => (
          <FeatureSpread key={f.id} feature={f} />
        ))}
      </section>

      <section className="wi-archive" aria-labelledby="wi-archive-title">
        <div className="wi-sechead wi-sechead-archive">
          <h2 id="wi-archive-title" className="wi-sectitle">
            Archive
          </h2>
          <p className="t-meta t-soft">03–05 · Fall 2025 to now</p>
          <p className="wi-archive-intro">
            Shorter entries, in the order they happened. Work done with a team says so, and each entry links to the
            record where one is public.
          </p>
        </div>
        <ol className="wi-entries">
          {ARCHIVE.map((e) => (
            <ArchiveItem key={e.id} entry={e} />
          ))}
        </ol>
      </section>

      {/* Tier C: projects published through the admin (Convex). None exist yet,
          so nothing renders; when one does, it is filed here as a plain index
          row, never promoted into the archive's art direction. */}
      {filed.length > 0 && (
        <section className="wi-filed" aria-labelledby="wi-filed-title">
          <h2 id="wi-filed-title" className="wi-sectitle wi-sectitle-small">
            Also filed
          </h2>
          <ul>
            {filed.map((p) => (
              <li key={p.id}>
                <span className="t-meta t-soft">{p.year}</span>
                <Link href={p.href}>{p.title}</Link>
                <span className="t-small t-soft">{p.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function ContentsGroup({
  label,
  items,
}: {
  label: string;
  items: { id: string; number: string; title: string; when: string }[];
}) {
  return (
    <div className="wi-contents-group">
      <p className="t-meta t-soft">{label}</p>
      <ol>
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`}>
              <span className="wi-contents-num" aria-hidden="true">
                {it.number}
              </span>
              <span className="wi-contents-title">{it.title}</span>
              <span className="wi-contents-when t-soft">{it.when}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}

function FeatureSpread({ feature: f }: { feature: Feature }) {
  const titleId = `${f.id}-title`;
  return (
    <article id={f.id} className={`wi-feature wi-${f.id}`} aria-labelledby={titleId}>
      <div className="wi-feature-text">
        <p className="wi-feature-num t-meta">
          <span>{f.number}</span>
          <span className="t-soft">{f.year}</span>
        </p>
        <h3 id={titleId} className="wi-feature-name t-display">
          {f.name}
        </h3>
        <p className="wi-thesis">{f.thesis}</p>
        <dl className="wi-facts">
          {f.facts.map((fact) => (
            <div key={fact.term}>
              <dt className="t-meta t-soft">{fact.term}</dt>
              <dd>{fact.detail}</dd>
            </div>
          ))}
        </dl>
        <p className="wi-case">
          <Link href={f.caseStudy.href}>
            {f.caseStudy.label}
            <span aria-hidden="true">{"\u00a0→"}</span>
          </Link>
        </p>
        <ul className="wi-more">
          {f.more.map((l) => (
            <li key={l.href}>
              <EntryAnchor link={l} />
            </li>
          ))}
        </ul>
      </div>
      {f.id === "rankle" ? <RanklePlate /> : <PlannrPlate />}
    </article>
  );
}

function ArchiveItem({ entry: e }: { entry: ArchiveEntry }) {
  const titleId = `${e.id}-title`;
  const Exhibit = EXHIBIT[e.id];
  return (
    <li id={e.id} className="wi-entry">
      <article aria-labelledby={titleId} className="wi-entry-grid">
        <p className="wi-entry-num" aria-hidden="true">
          {e.number}
        </p>
        <div className="wi-entry-body">
          <h3 id={titleId} className="wi-entry-title">
            {e.title}
          </h3>
          <dl className="wi-entry-meta">
            <div>
              <dt className="sr-only">When</dt>
              <dd className="t-meta">{e.period}</dd>
            </div>
            <div>
              <dt className="sr-only">Context</dt>
              <dd>{e.context}</dd>
            </div>
            <div>
              <dt className="sr-only">Role</dt>
              <dd className="t-soft">{e.role}</dd>
            </div>
          </dl>
          <p>{e.summary}</p>
          <p>{e.work}</p>
          <p className="wi-entry-note">
            <span className="t-meta">Note</span> {e.note}
          </p>
          <p className="wi-entry-stack t-meta">
            <span className="sr-only">Technologies: </span>
            {e.stack.join(" / ")}
          </p>
          {e.links.length > 0 ? (
            <ul className="wi-entry-links">
              {e.links.map((l) => (
                <li key={l.href}>
                  <EntryAnchor link={l} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="wi-entry-unlinked t-small t-soft">{e.unlinked}</p>
          )}
        </div>
        {Exhibit && (
          <div className="wi-entry-exhibit">
            <Exhibit />
          </div>
        )}
      </article>
    </li>
  );
}
