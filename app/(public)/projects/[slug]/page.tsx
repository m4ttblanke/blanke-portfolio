import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });
  if (!project) {
    return { title: "Project Not Found" };
  }
  return {
    title: `${project.title} — Matt Blanke`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await fetchQuery(api.projects.getBySlug, { slug });

  if (!project || project.draft) {
    notFound();
  }

  return (
    <article>
      <Link href="/projects">← Back to Projects</Link>

      <h1>{project.title}</h1>
      <p>{project.startDate}{project.endDate && ` – ${project.endDate}`}</p>
      <p>{project.description}</p>

      {project.stack.length > 0 && (
        <p>Stack: {project.stack.join(", ")}</p>
      )}

      {project.repoUrl && (
        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">View on GitHub →</a>
      )}
      {project.liveUrl && (
        <> | <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">View Live Site →</a></>
      )}
    </article>
  );
}
