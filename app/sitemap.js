import { SITE_URL } from "@/lib/seo-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 3600;

const STATIC_PAGES = [
  { path: "/", priority: 1.0, changeFreq: "weekly" },
  { path: "/blog", priority: 0.9, changeFreq: "daily" },
  { path: "/signin", priority: 0.3, changeFreq: "monthly" },
  { path: "/signup", priority: 0.3, changeFreq: "monthly" },
];

async function getBlogSlugs() {
  try {
    const res = await fetch(`${API_URL}/blog/posts?limit=1000`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data?.posts || []).map((post) => ({
      slug: post.slug,
      lastmod: post.lastmod || post.published || post.createdAt || null,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const blogPosts = await getBlogSlugs();

  const blogLastMod = blogPosts.reduce((latest, post) => {
    return post.lastmod && post.lastmod > latest ? post.lastmod : latest;
  }, "");

  const staticPages = STATIC_PAGES.map(({ path, priority, changeFreq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: path === "/blog" && blogLastMod ? blogLastMod : undefined,
    changeFrequency: changeFreq,
    priority,
  }));

  const blogPages = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastmod || undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
