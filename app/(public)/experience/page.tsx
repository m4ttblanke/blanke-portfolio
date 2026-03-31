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
            className="group relative border border-border rounded-lg p-6 overflow-hidden transition-all duration-300 hover:border-accent hover:bg-accent/5 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(16,185,129,0.1)]"
          >
            {/* Scan-line sweep */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-accent/8 to-transparent pointer-events-none" />
            {/* Bottom accent bar */}
            <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-300 rounded-b-lg" />

            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-fg group-hover:text-accent transition-colors duration-200 flex items-center gap-1">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">&gt;</span>
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
