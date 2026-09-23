import Link from "next/link";

// The wall's small, restrained "index" entry -- not a third poster. No other
// project is verified in the repository (see lib/work/projects.ts), so M4A
// does not fabricate secondary work to fill the tier the brief describes.
// This is the honest alternative: a quiet, factual line pointing at the real
// project index rather than an invented artifact.
export function WorkIndex() {
  return (
    <p className="work-index t-small">
      <Link href="/projects">More in the index →</Link>
    </p>
  );
}
