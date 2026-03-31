import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Projects — Matt Blanke",
  description: "Featured work and technical experiments.",
};

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-fg mb-2">Projects</h1>
        <p className="text-fg-muted">No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl md:text-6xl font-bold text-fg mb-2">Projects</h1>
        <p className="text-lg text-fg-muted">Featured work and technical experiments</p>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <article
            key={project._id}
            className="group relative border border-border rounded-xl p-8 overflow-hidden transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(16,185,129,0.1)]"
          >
            {/* Scan-line sweep */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-accent/8 to-transparent pointer-events-none" />
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-accent to-accent-muted rounded-t-xl w-0 group-hover:w-full transition-all duration-500" />

            <div className="space-y-4">
              <div>
                <Link href={`/projects/${project.slug}`}>
                  <h2 className="text-2xl font-bold text-fg group-hover:text-accent transition-colors duration-200 flex items-center gap-1">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-lg">&gt;</span>
                    {project.title}
                  </h2>
                </Link>
                <p className="text-sm text-fg-subtle mt-2 font-mono">
                  {project.startDate}
                  {project.endDate && ` – ${project.endDate}`}
                </p>
              </div>

              <p className="text-fg-muted leading-relaxed max-w-2xl">
                {project.description}
              </p>

              {project.stack.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono bg-accent/10 text-accent px-3 py-1.5 rounded-full border border-accent/20 group-hover:border-accent/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {(project.repoUrl || project.liveUrl) && (
                <div className="flex gap-6 pt-4">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors group/link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-dark transition-colors group/link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
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
