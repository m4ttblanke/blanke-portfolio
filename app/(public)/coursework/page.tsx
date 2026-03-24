import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Coursework — Matt Blanke",
  description: "Academic coursework and courses.",
};

export default async function CourseworkPage() {
  const coursework = await fetchQuery(api.coursework.listPublished);

  if (coursework.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-fg mb-2">Coursework</h1>
        <p className="text-fg-muted">No coursework yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-fg">Coursework</h1>
      <div className="space-y-6">
        {coursework.map((course) => (
          <article
            key={course._id}
            className="border border-bg-subtle rounded-lg p-6 hover:border-border-hover transition-colors duration-150"
          >
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-fg">
                  {course.title}
                </h2>
                <p className="text-sm text-fg-muted">{course.institution}</p>
              </div>

              <p className="text-sm text-fg-subtle">
                {course.term}
                {course.grade && ` • Grade: ${course.grade}`}
              </p>

              <p className="text-fg-muted text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
