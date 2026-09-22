import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ContentFrame, PageFrame, PageHeader } from "@/components/shell/page";

export const metadata = {
  title: "Experience — Matt Blanke",
  description: "Work experience and roles.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const experience = await fetchQuery(api.experience.listPublished);

  return (
    <PageFrame>
      <PageHeader section="resume" title="Experience" path="/experience" />
      <ContentFrame>
        {experience.length === 0 ? (
          <p>Nothing published here yet.</p>
        ) : (
          <ul>
            {experience.map((exp) => (
              <li key={exp._id}>
                <strong>{exp.role}</strong> at {exp.company}
                {exp.current && " (Current)"}
                <br />
                {exp.startDate}
                {exp.endDate && ` – ${exp.endDate}`}
                <br />
                {exp.description}
              </li>
            ))}
          </ul>
        )}
      </ContentFrame>
    </PageFrame>
  );
}
