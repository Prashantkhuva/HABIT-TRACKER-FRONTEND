import { SITE_URL, PUBLIC_ROUTES, ROUTE_SEO } from "@/lib/seo-config";

const BLOG_POSTS = [
  { slug: "how-to-build-daily-rituals", lastmod: "2026-05-28" },
  { slug: "streak-tracking-science", lastmod: "2026-05-25" },
  { slug: "habit-stacking-guide", lastmod: "2026-05-20" },
];

export default function sitemap() {
  const staticPages = PUBLIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: "2026-05-28",
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1.0 : 0.5,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastmod,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticPages,
    {
      url: `${SITE_URL}/blog`,
      lastModified: "2026-05-28",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogPages,
  ];
}
