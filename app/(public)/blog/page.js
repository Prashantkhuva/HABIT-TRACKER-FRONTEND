import BlogListing from "@/views/blog/BlogListing";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/blog/posts`);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data?.posts) ? json.data.posts : [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogListing posts={posts} />;
}
