import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function CourseworkPage() {
  const coursework = await fetchQuery(api.coursework.listPublished);

  if (coursework.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-zinc-900 mb-2">Coursework</h1>
        <p className="text-zinc-600">No coursework yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-zinc-900">Coursework</h1>
      <div className="space-y-6">
        {coursework.map((course) => (
          <article
            key={course._id}
            className="border border-zinc-100 rounded-lg p-6"
          >
            <div className="space-y-2">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  {course.title}
                </h2>
                <p className="text-sm text-zinc-600">{course.institution}</p>
              </div>

              <p className="text-sm text-zinc-500">
                {course.term}
                {course.grade && ` • Grade: ${course.grade}`}
              </p>

              <p className="text-zinc-600 text-sm leading-relaxed">
                {course.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
