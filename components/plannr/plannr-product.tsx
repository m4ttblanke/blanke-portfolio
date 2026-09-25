import Image from "next/image";
import { PRODUCT_CAPTION, PRODUCT_KEEPS, PRODUCT_NOTES } from "@/lib/work/plannr-content";

// THE PRODUCT: real captures, used as evidence, not as a mockup. One dominant
// screenshot (Week at a Glance) and a second (My Classes) cropped and bleeding
// off the edge behind it. No device chrome, no shadow, no gloss: the screenshot
// is the artifact, edged by a hairline like a photocopied plate. Callouts quote
// what the screenshot itself shows, and sit attached to it: beside it on wide
// screens, directly under it on narrow ones (same DOM, same order). The profile
// photo in both captures is covered (docs/planning/m6-plannr-evidence.md); the
// course codes and titles are real.
export function PlannrProduct() {
  return (
    <section className="stage page-grid pc-product" aria-labelledby="plannr-product-heading">
      <header className="pc-product-head">
        <p className="t-meta">The product</p>
        <h2 id="plannr-product-heading" className="t-head-2">
          What the student keeps.
        </h2>
        <p className="t-lede pc-product-lede">After the sync, Plannr is the view over the term.</p>
      </header>

      <ul className="pc-keeps">
        {PRODUCT_KEEPS.map((k) => (
          <li key={k.name}>
            <h3 className="t-head-3">{k.name}</h3>
            <p className="t-small">{k.body}</p>
          </li>
        ))}
      </ul>

      <figure className="pc-shot pc-shot-week layer-subject">
        <div className="pc-shot-body">
          <Image
            src="/plannr/week-at-a-glance.png"
            alt="Plannr's Week at a Glance screen, 30 August to 5 September. Tiles show 8 due this week, 11 next week and 0 percent complete. A week strip shows a count on each day that has something due. A weekend preview reads Busy Weekend, 3 assignments due early next week. Upcoming events list Viral Video, for class TMP124, and Week 4 Discussion Peer Responses, tagged Homework."
            width={760}
            height={1652}
            sizes="(min-width: 64rem) 26vw, (min-width: 48rem) 44vw, 80vw"
            className="pc-shot-img"
          />
          <ul className="pc-shot-notes">
            {PRODUCT_NOTES.week.map((n) => (
              <li key={n.text} className="pc-pen" style={{ "--at": `${n.at}%` } as React.CSSProperties}>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
        <figcaption className="t-caption">Week at a Glance. {PRODUCT_CAPTION}</figcaption>
      </figure>

      <figure className="pc-shot pc-shot-classes layer-paper">
        <div className="pc-shot-body">
          <div className="pc-shot-crop">
            <Image
              src="/plannr/my-classes.png"
              alt="Plannr's My Classes screen, cropped: three classes, TMP124 with 27 events synced, CMPSC 111 with 6, and ENGR 101 with 9, each with its own colour bar and an Active tag, above an Add New Class button."
              width={760}
              height={1652}
              sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 40vw, 70vw"
              className="pc-shot-img"
            />
          </div>
          <ul className="pc-shot-notes">
            {PRODUCT_NOTES.classes.map((n) => (
              <li key={n.text} className="pc-pen" style={{ "--at": `${n.at}%` } as React.CSSProperties}>
                {n.text}
              </li>
            ))}
          </ul>
        </div>
        <figcaption className="t-caption">My Classes, cropped.</figcaption>
      </figure>
    </section>
  );
}
