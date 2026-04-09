import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Coursework — Matt Blanke",
  description: "Academic coursework and courses.",
};

export default async function CourseworkPage() {
  const coursework = await fetchQuery(api.coursework.listPublished);

  return (
    <div>
      <h1>Coursework</h1>

      {coursework.length === 0 ? (
        <p>No coursework yet.</p>
      ) : (
        <ul>
          {coursework.map((course) => (
            <li key={course._id}>
              <strong>{course.title}</strong> — {course.institution}
              <br />
              {course.term}{course.grade && ` • Grade: ${course.grade}`}
              <br />
              {course.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
