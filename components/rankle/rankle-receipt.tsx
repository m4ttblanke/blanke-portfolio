import Link from "next/link";
import { RANKLE_META, RANKLE_RECEIPT_STATS } from "@/lib/work/rankle-content";

// THE RECEIPT — is this real? Only verified, publicly-appropriate evidence:
// the repository is public (confirmed via `gh repo view`) and the product is
// live in production (confirmed via a direct HTTP request to rankle.io, 200,
// served by Vercel). No fabricated user counts, no testimonials -- a real
// repository and a real deployment are the receipt (brief §20/§56). Exits
// cleanly back to Work; no fake "Next: Plannr" (Plannr's case study is M6
// and does not exist yet -- brief §49).
export function RankleReceipt() {
  return (
    <section className="stage page-grid rk-receipt" aria-labelledby="rankle-receipt-heading">
      <header className="rk-receipt-heading">
        <p className="t-meta">The receipt</p>
        <h2 id="rankle-receipt-heading" className="t-head-2">
          Real repository. Real deployment.
        </h2>
      </header>

      <p className="rk-receipt-note">
        Every change to Rankle passes through the same five required checks before it reaches production — built
        and shipped solo.
      </p>

      <div className="rk-receipt-links">
        <a className="btn" href={RANKLE_META.liveHref} target="_blank" rel="noopener noreferrer">
          Live at rankle.io ↗
        </a>
        <a className="btn-quiet" href={RANKLE_META.repoHref} target="_blank" rel="noopener noreferrer">
          Source on GitHub ↗
        </a>
      </div>

      <dl className="rk-stats-row">
        {RANKLE_RECEIPT_STATS.map((stat) => (
          <div key={stat.label} className="rk-stat">
            <dt className="rk-stat-n">{stat.n}</dt>
            <dd className="rk-stat-label">{stat.label}</dd>
          </div>
        ))}
      </dl>

      <div className="rk-exit">
        <Link href="/projects">← Back to Work</Link>
      </div>
    </section>
  );
}
