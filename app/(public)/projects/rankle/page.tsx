import { RankleCase } from "@/components/rankle/rankle-case";

// RANKLE — the flagship case study (M5A). A static, literal segment
// alongside the Convex-backed app/(public)/projects/[slug]/page.tsx: Next.js
// matches the literal "rankle" segment before the dynamic one, so no
// existing route or data model changes (see rankle-case.tsx and
// lib/work/rankle-content.ts for the composition and its source map).
export const metadata = {
  title: "Rankle — Matt Blanke",
  description:
    "Rankle is a daily tier-list game built with Next.js and Supabase: rank today's set, submit, and see how you compare.",
  alternates: { canonical: "/projects/rankle" },
};

export default function RanklePage() {
  return <RankleCase />;
}
