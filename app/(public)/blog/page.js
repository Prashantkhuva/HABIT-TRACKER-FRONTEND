import BlogListing from "@/views/blog/BlogListing";
import { BLOG_POSTS } from "@/lib/blog";
import { serverApiBase } from "@/lib/api-url";

export const revalidate = 3600;

async function getPosts() {
  try {
    const res = await fetch(`${serverApiBase()}/blog/posts`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      const posts = json.data?.posts;
      if (Array.isArray(posts) && posts.length > 0) return posts;
    }
  } catch {
    // API unavailable
  }

  return BLOG_POSTS;
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogListing posts={posts} />;
}
