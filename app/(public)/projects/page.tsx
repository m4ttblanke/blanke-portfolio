import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Projects — Matt Blanke",
  description: "Featured work and technical experiments.",
};

export default async function ProjectsPage() {
  const projects = await fetchQuery(api.projects.listPublished);

  return (
    <div>
      <h1>Projects</h1>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id}>
              <Link href={`/projects/${project.slug}`}>{project.title}</Link>
              {" "}— {project.startDate}{project.endDate && ` – ${project.endDate}`}
              <br />
              {project.description}
              <br />
              Stack: {project.stack.join(", ")}
              {project.repoUrl && <> | <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">GitHub</a></>}
              {project.liveUrl && <> | <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live</a></>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
