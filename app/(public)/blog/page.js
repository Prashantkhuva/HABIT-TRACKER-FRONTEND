import BlogListing from "@/views/blog/BlogListing";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getPosts() {
  try {
    const res = await fetch(`${API_URL}/blog/posts`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogListing posts={posts} />;
}
