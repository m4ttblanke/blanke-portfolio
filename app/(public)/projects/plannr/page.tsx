import { PlannrCase } from "@/components/plannr/plannr-case";

// PLANNR: the second flagship case study (M6A). A static, literal segment
// beside the Convex-backed app/(public)/projects/[slug]/page.tsx, exactly like
// /projects/rankle: Next.js matches the literal "plannr" segment first, so no
// existing route or data model changes. /plannr/* (the proxied product site)
// is a different path and is untouched.
export const metadata = {
  title: "Plannr — Matt Blanke",
  description:
    "Plannr is an iOS app that reads a course syllabus, lets the student review the dates it finds, and syncs them to a Google Calendar for each class. Started as a UCSB team project; now a free TestFlight beta.",
  alternates: { canonical: "/projects/plannr" },
};

export default function PlannrPage() {
  return <PlannrCase />;
}
