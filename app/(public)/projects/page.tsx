import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Projects</h1>
        <p className="text-zinc-600">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Projects</h1>
      <div className="space-y-6">
        {projects.map((project) => (
          <article
            key={project._id}
            className="border border-zinc-100 rounded-lg p-6 hover:border-zinc-200 transition"
          >
            <div className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {project.title}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {project.startDate}
                  {project.endDate && ` – ${project.endDate}`}
                </p>
              </div>

              <p className="text-zinc-600 text-sm leading-relaxed">
                {project.description}
              </p>

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-zinc-100 text-zinc-700 px-2 py-1 rounded"
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
                      className="text-sm text-zinc-500 hover:text-zinc-900 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="text-sm text-zinc-500 hover:text-zinc-900 underline"
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
