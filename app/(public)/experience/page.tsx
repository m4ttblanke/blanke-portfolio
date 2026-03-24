import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function ExperiencePage() {
  const experience = await fetchQuery(api.experience.listPublished);

  if (experience.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Experience</h1>
        <p className="text-zinc-600">No experience yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Experience</h1>
      <div className="space-y-6">
        {experience.map((exp) => (
          <article
            key={exp._id}
            className="border border-zinc-100 rounded-lg p-6"
          >
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {exp.role}
                </h2>
                <p className="text-sm text-zinc-600">{exp.company}</p>
              </div>

              <p className="text-sm text-zinc-500">
                {exp.startDate}
                {exp.endDate && ` – ${exp.endDate}`}
                {exp.current && " (Current)"}
              </p>

              <p className="text-zinc-600 text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
