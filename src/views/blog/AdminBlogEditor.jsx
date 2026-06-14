"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBlogPost, getBlogPostById, updateBlogPost } from "@/api/blog-api";
import { useToast } from "@/components/Toast/ToastProvider";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/loading/LoadingSkeletons";

export default function AdminBlogEditor({ postId }) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEdit = !!postId;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    categories: "",
    readingTime: "",
    published: "",
  });

  useEffect(() => {
    if (!postId) return;
    const fetch = async () => {
      try {
        const res = await getBlogPostById(postId);
        const p = res.data.data;
        setForm({
          title: p.title || "",
          slug: p.slug || "",
          description: p.description || "",
          content: p.content || "",
          categories: (p.categories || []).join(", "),
          readingTime: p.readingTime || "",
          published: p.published ? p.published.slice(0, 10) : "",
        });
      } catch {
        addToast({ type: "error", title: "Failed", message: "Could not load post" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [postId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleTitleBlur = () => {
    if (!isEdit && !form.slug) {
      setForm((prev) => ({ ...prev, slug: generateSlug(prev.title) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      addToast({ type: "error", title: "Required", message: "Title and content are required" });
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      categories: form.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      slug: form.slug || generateSlug(form.title),
      published: form.published || new Date().toISOString().slice(0, 10),
    };
    try {
      if (isEdit) {
        await updateBlogPost(postId, payload);
        addToast({ type: "success", title: "Saved", message: "Blog post updated" });
      } else {
        await createBlogPost(payload);
        addToast({ type: "success", title: "Published", message: "Blog post created" });
      }
      fetch("/api/ping-google", { method: "POST" }).catch((err) => console.error("[AdminBlogEditor] Ping-google failed:", err));
      router.push("/blog-admin");
    } catch {
      addToast({ type: "error", title: "Failed", message: "Could not save blog post" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="space-y-5">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <button
        onClick={() => router.push("/blog-admin")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm app-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to posts
      </button>

      <h1 className="mb-8 text-2xl font-bold">
        {isEdit ? "Edit Post" : "New Blog Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleTitleBlur}
            placeholder="How to build daily rituals"
            className="w-full rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Slug</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="how-to-build-daily-rituals"
              className="w-full rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Reading Time</label>
            <input
              name="readingTime"
              value={form.readingTime}
              onChange={handleChange}
              placeholder="5 min read"
              className="w-full rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="A short summary for search results and previews"
            className="w-full resize-none rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Content (Markdown) *
          </label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={16}
            placeholder="Write your blog content in markdown..."
            className="w-full resize-y rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 font-mono text-sm leading-relaxed outline-none transition-colors focus:border-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Categories (comma-separated)
            </label>
            <input
              name="categories"
              value={form.categories}
              onChange={handleChange}
              placeholder="Habit Building, Productivity"
              className="w-full rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Publish Date
            </label>
            <input
              name="published"
              type="date"
              value={form.published}
              onChange={handleChange}
              className="w-full rounded-xl border border-border-subtle bg-transparent px-4 py-2.5 text-sm outline-none transition-colors focus:border-text-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-background transition-all hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {isEdit ? "Save Changes" : "Publish"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/blog-admin")}
            className="rounded-full border border-border-subtle/50 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-surface-dim"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
