import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { WorkIndex, type IndexedProject } from "@/components/work-index/work-index";

// WORK (M7): the issue's contents and back catalog. Features and archive are
// static, verified content (lib/work/archive.ts). Projects published through
// the admin still appear, filed as plain index rows after the archive; the
// Convex query is the M0 path and stays the only data source for them.
export const metadata = {
  title: "Work — Matt Blanke",
  description:
    "Rankle and Plannr, told in full, then an archive of coursework and smaller builds: legacy full-stack work, network protocols, and this site.",
  alternates: { canonical: "/projects" },
};

async function publishedProjects(): Promise<IndexedProject[]> {
  try {
    const projects = await fetchQuery(api.projects.listPublished);
    return projects.map((p) => ({
      id: p._id,
      title: p.title,
      year: p.startDate.slice(0, 4),
      description: p.description,
      href: `/projects/${p.slug}`,
    }));
  } catch {
    // The features and archive never depend on Convex: an outage only hides
    // the filed rows.
    return [];
  }
}

export default async function ProjectsPage() {
  return <WorkIndex filed={await publishedProjects()} />;
}
