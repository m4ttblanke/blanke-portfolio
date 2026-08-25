import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Experience — Matt Blanke",
  description: "Work experience and roles.",
};

export default async function ExperiencePage() {
  const experience = await fetchQuery(api.experience.listPublished);

  return (
    <div>
      <h1>Experience</h1>

      {experience.length === 0 ? (
        <p>No experience yet.</p>
      ) : (
        <ul>
          {experience.map((exp) => (
            <li key={exp._id}>
              <strong>{exp.role}</strong> at {exp.company}
              {exp.current && " (Current)"}
              <br />
              {exp.startDate}{exp.endDate && ` – ${exp.endDate}`}
              <br />
              {exp.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
