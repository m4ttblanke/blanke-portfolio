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
    <article className="space-y-8">
      <Link
        href="/projects"
        className="text-sm text-zinc-500 hover:text-zinc-900 inline-flex items-center gap-1"
      >
        ← Back to Projects
      </Link>

      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-zinc-900">
            {project.title}
          </h1>
          <p className="text-zinc-600">
            {project.startDate}
            {project.endDate && ` – ${project.endDate}`}
          </p>
        </div>

        <p className="text-lg text-zinc-700 leading-relaxed">
          {project.description}
        </p>

        {project.stack.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 mb-3">Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-sm bg-zinc-100 text-zinc-700 px-3 py-1 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {(project.repoUrl || project.liveUrl) && (
          <div className="flex gap-4 pt-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                className="text-sm font-medium text-zinc-900 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className="text-sm font-medium text-zinc-900 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live Site →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
