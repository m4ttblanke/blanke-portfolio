"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type Coursework = {
  _id: Id<"coursework">;
  title: string;
  institution: string;
  description: string;
  term: string;
  grade?: string;
  draft: boolean;
};

export function CourseworkManager() {
  const courseworks = useQuery(api.coursework.listAll);
  const createCoursework = useMutation(api.coursework.create);
  const updateCoursework = useMutation(api.coursework.update);
  const removeCoursework = useMutation(api.coursework.remove);

  const [editingId, setEditingId] = useState<Id<"coursework"> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      title: formData.get("title") as string,
      institution: formData.get("institution") as string,
      description: formData.get("description") as string,
      term: formData.get("term") as string,
      grade: (formData.get("grade") as string) || undefined,
      draft: formData.get("draft") === "on",
    };

    try {
      if (editingId) {
        await updateCoursework({
          id: editingId,
          ...data,
        });
        setEditingId(null);
      } else {
        await createCoursework(data);
      }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save coursework:", error);
    }
  };

  const handleDelete = async (id: Id<"coursework">) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await removeCoursework({ id });
      } catch (error) {
        console.error("Failed to delete coursework:", error);
      }
    }
  };

  const editingCourse = courseworks?.find((c) => c._id === editingId);

  if (!courseworks) {
    return <div className="text-zinc-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Coursework</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded text-sm hover:bg-zinc-800"
        >
          {showForm ? "Cancel" : "New Course"}
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-zinc-200 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              defaultValue={editingCourse?.title}
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                defaultValue={editingCourse?.institution}
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Term
              </label>
              <input
                type="text"
                name="term"
                defaultValue={editingCourse?.term}
                placeholder="Fall 2024"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingCourse?.description}
              required
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Grade (optional)
            </label>
            <input
              type="text"
              name="grade"
              defaultValue={editingCourse?.grade || ""}
              placeholder="A"
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="draft"
                defaultChecked={editingCourse?.draft || false}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-zinc-700">Draft</span>
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-900 text-white rounded text-sm hover:bg-zinc-800"
            >
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="px-4 py-2 bg-zinc-200 text-zinc-900 rounded text-sm hover:bg-zinc-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <div className="space-y-2">
        {courseworks.length === 0 ? (
          <p className="text-zinc-600 py-8 text-center">No coursework yet</p>
        ) : (
          courseworks.map((course) => (
            <div
              key={course._id}
              className="bg-white p-4 rounded border border-zinc-200 flex items-start justify-between hover:border-zinc-300"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-900">{course.title}</h3>
                  {course.grade && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      {course.grade}
                    </span>
                  )}
                  {course.draft && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-600">{course.institution}</p>
                <p className="text-sm text-zinc-600">{course.description}</p>
                <p className="text-xs text-zinc-500">{course.term}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingId(course._id)}
                  className="px-3 py-1 text-sm text-zinc-600 hover:text-zinc-900 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-900 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
