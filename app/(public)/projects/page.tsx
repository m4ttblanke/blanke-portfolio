import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Projects — Matt Blanke",
  description: "Software projects by Matt Blanke.",
};

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-fg mb-2">Projects</h1>
        <p className="text-fg-muted">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-fg">Projects</h1>
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project._id}
            className="border border-bg-subtle rounded-lg p-6 hover:border-border-hover transition-colors duration-150"
          >
            <div className="space-y-3">
              <div>
                <Link href={`/projects/${project.slug}`}>
                  <h2 className="text-lg font-semibold text-fg hover:underline">
                    {project.title}
                  </h2>
                </Link>
                <p className="text-sm text-fg-subtle mt-1">
                  {project.startDate}
                  {project.endDate && ` – ${project.endDate}`}
                </p>
              </div>

              <p className="text-fg-muted text-sm leading-relaxed">
                {project.description}
              </p>

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-badge-bg text-badge-fg px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {(project.repoUrl || project.liveUrl) && (
                <div className="flex gap-4 pt-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      className="text-sm text-fg-muted hover:text-fg underline transition-colors duration-150"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="text-sm text-fg-muted hover:text-fg underline transition-colors duration-150"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
