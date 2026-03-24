"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type Experience = {
  _id: Id<"experience">;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  draft: boolean;
};

export function ExperienceManager() {
  const experiences = useQuery(api.experience.listAll);
  const createExperience = useMutation(api.experience.create);
  const updateExperience = useMutation(api.experience.update);
  const removeExperience = useMutation(api.experience.remove);

  const [editingId, setEditingId] = useState<Id<"experience"> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      description: formData.get("description") as string,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || undefined,
      current: formData.get("current") === "on",
      draft: formData.get("draft") === "on",
    };

    try {
      if (editingId) {
        await updateExperience({
          id: editingId,
          ...data,
        });
        setEditingId(null);
      } else {
        await createExperience(data);
      }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save experience:", error);
    }
  };

  const handleDelete = async (id: Id<"experience">) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        await removeExperience({ id });
      } catch (error) {
        console.error("Failed to delete experience:", error);
      }
    }
  };

  const editingExp = experiences?.find((e) => e._id === editingId);

  if (!experiences) {
    return <div className="text-zinc-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Experience</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded text-sm hover:bg-zinc-800"
        >
          {showForm ? "Cancel" : "New Role"}
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-zinc-200 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                defaultValue={editingExp?.company}
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                defaultValue={editingExp?.role}
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
              defaultValue={editingExp?.description}
              required
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                name="startDate"
                defaultValue={editingExp?.startDate}
                placeholder="2024"
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                End Date
              </label>
              <input
                type="text"
                name="endDate"
                defaultValue={editingExp?.endDate || ""}
                placeholder="2024"
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="current"
                defaultChecked={editingExp?.current || false}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-zinc-700">Currently working here</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="draft"
                defaultChecked={editingExp?.draft || false}
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
        {experiences.length === 0 ? (
          <p className="text-zinc-600 py-8 text-center">No experience yet</p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp._id}
              className="bg-white p-4 rounded border border-zinc-200 flex items-start justify-between hover:border-zinc-300"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-900">{exp.role}</h3>
                  <span className="text-sm text-zinc-600">{exp.company}</span>
                  {exp.current && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      Current
                    </span>
                  )}
                  {exp.draft && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-600">{exp.description}</p>
                <p className="text-xs text-zinc-500">
                  {exp.startDate}
                  {exp.endDate && ` – ${exp.endDate}`}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingId(exp._id)}
                  className="px-3 py-1 text-sm text-zinc-600 hover:text-zinc-900 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
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
