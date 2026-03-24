import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Experience — Matt Blanke",
  description: "Work experience and roles.",
};

export default async function ExperiencePage() {
  const experience = await fetchQuery(api.experience.listPublished);

  if (experience.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-fg mb-2">Experience</h1>
        <p className="text-fg-muted">No experience yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-fg">Experience</h1>
      <div className="space-y-6">
        {experience.map((exp) => (
          <article
            key={exp._id}
            className="border border-bg-subtle rounded-lg p-6 hover:border-border-hover transition-colors duration-150"
          >
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-fg">
                  {exp.role}
                </h2>
                <p className="text-sm text-fg-muted">{exp.company}</p>
              </div>

              <p className="text-sm text-fg-subtle">
                {exp.startDate}
                {exp.endDate && ` – ${exp.endDate}`}
                {exp.current && " (Current)"}
              </p>

              <p className="text-fg-muted text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
