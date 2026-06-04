import { SITE_URL, PUBLIC_ROUTES } from "@/lib/seo-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 3600;

async function getBlogSlugs() {
  try {
    const res = await fetch(`${API_URL}/blog/posts`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data || []).map((post) => ({
      slug: post.slug,
      lastmod: post.lastmod || post.published || new Date().toISOString().slice(0, 10),
    }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const blogPosts = await getBlogSlugs();

  const staticPages = PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: route === "/" ? "weekly" : route === "/blog" ? "daily" : "monthly",
    priority: route === "/" ? 1.0 : route === "/blog" ? 0.9 : 0.5,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastmod,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
