"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

type Project = {
  _id: Id<"projects">;
  title: string;
  slug: string;
  description: string;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  startDate: string;
  endDate?: string;
  draft: boolean;
  order: number;
};

export function ProjectsManager() {
  const projects = useQuery(api.projects.listAll);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const removeProject = useMutation(api.projects.remove);

  const [editingId, setEditingId] = useState<Id<"projects"> | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = formData.get("title") as string;
    let slug = (formData.get("slug") as string) || "";

    // Normalize slug: lowercase, remove special chars, replace spaces with hyphens
    slug = slug
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    // Auto-generate from title if normalized slug is empty
    if (!slug) {
      slug = title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    const data = {
      title,
      slug,
      description: formData.get("description") as string,
      stack: (formData.get("stack") as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      repoUrl: (formData.get("repoUrl") as string) || undefined,
      liveUrl: (formData.get("liveUrl") as string) || undefined,
      startDate: formData.get("startDate") as string,
      endDate: (formData.get("endDate") as string) || undefined,
      draft: formData.get("draft") === "on",
      order: parseInt(formData.get("order") as string) || 0,
    };

    try {
      if (editingId) {
        await updateProject({
          id: editingId,
          ...data,
        });
        setEditingId(null);
      } else {
        await createProject(data);
      }
      (e.target as HTMLFormElement).reset();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save project:", error);
    }
  };

  const handleDelete = async (id: Id<"projects">) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await removeProject({ id });
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const editingProject = projects?.find((p) => p._id === editingId);

  if (!projects) {
    return <div className="text-zinc-600">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Projects</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded text-sm hover:bg-zinc-800"
        >
          {showForm ? "Cancel" : "New Project"}
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
              defaultValue={editingProject?.title}
              required
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              URL Slug (auto-generated from title if left blank)
            </label>
            <input
              type="text"
              name="slug"
              defaultValue={editingProject?.slug}
              placeholder="my-project-name"
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              defaultValue={editingProject?.description}
              required
              rows={3}
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              Stack (comma-separated)
            </label>
            <input
              type="text"
              name="stack"
              defaultValue={editingProject?.stack.join(", ")}
              placeholder="React, TypeScript, Tailwind"
              className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Repo URL
              </label>
              <input
                type="url"
                name="repoUrl"
                defaultValue={editingProject?.repoUrl || ""}
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Live URL
              </label>
              <input
                type="url"
                name="liveUrl"
                defaultValue={editingProject?.liveUrl || ""}
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Start Date
              </label>
              <input
                type="text"
                name="startDate"
                defaultValue={editingProject?.startDate}
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
                defaultValue={editingProject?.endDate || ""}
                placeholder="2024"
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Order
              </label>
              <input
                type="number"
                name="order"
                defaultValue={editingProject?.order || 0}
                className="w-full px-3 py-2 border border-zinc-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="draft"
                defaultChecked={editingProject?.draft || false}
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
        {projects.length === 0 ? (
          <p className="text-zinc-600 py-8 text-center">No projects yet</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-4 rounded border border-zinc-200 flex items-start justify-between hover:border-zinc-300"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-zinc-900">{project.title}</h3>
                  {project.draft && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-600">{project.description}</p>
                <div className="flex gap-2 pt-1">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => setEditingId(project._id)}
                  className="px-3 py-1 text-sm text-zinc-600 hover:text-zinc-900 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
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
