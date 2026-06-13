"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBlogPosts, deleteBlogPost } from "@/api/blog-api";
import { useToast } from "@/components/Toast/ToastProvider";
import { Pencil, Trash2, FileText, Plus } from "lucide-react";
import Button from "@/components/Button";
import { Skeleton } from "@/components/loading/LoadingSkeletons";

export default function AdminBlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  const fetchPosts = async () => {
    try {
      const res = await getBlogPosts();
      setPosts(res.data?.data?.posts || []);
    } catch {
      addToast({ type: "error", title: "Failed", message: "Could not load blog posts" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteBlogPost(id);
      addToast({ type: "success", title: "Deleted", message: "Blog post removed" });
      fetchPosts();
    } catch {
      addToast({ type: "error", title: "Failed", message: "Could not delete post" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="mt-1 text-sm app-muted">
            {posts.length} post{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <Button onClick={() => router.push("/blog-admin/new")}>
          <Plus size={14} />
          New Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 app-muted">
          <FileText size={40} strokeWidth={1} />
          <p className="text-sm">No blog posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="flex items-center gap-4 rounded-xl border border-border-subtle/50 p-4 transition-colors hover:bg-surface-dim"
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{post.title}</h3>
                <p className="mt-0.5 text-sm app-muted truncate">
                  {post.description}
                </p>
                <div className="mt-1.5 flex items-center gap-3 text-xs app-muted">
                  <span>{new Date(post.published || post.createdAt).toLocaleDateString()}</span>
                  <span>{post.readingTime || `${Math.ceil((post.content?.length || 0) / 1000)} min read`}</span>
                  {post.published && <span className="text-green-600 dark:text-green-400">Published</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => router.push(`/blog-admin/${post._id}/edit`)}
                  className="rounded-lg p-2 app-muted transition-colors hover:bg-surface hover:text-text-primary"
                  aria-label="Edit"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post._id, post.title)}
                  className="rounded-lg p-2 app-muted transition-colors hover:bg-surface hover:text-danger"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
