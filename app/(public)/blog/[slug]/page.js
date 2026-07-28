import { SITE_URL } from "@/lib/seo-config";
import { getBlogPost, ALL_SLUGS } from "@/lib/blog";
import BlogPostReader from "@/views/blog/BlogPostReader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const revalidate = 3600;
export const dynamicParams = true;

async function getPost(slug) {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${slug}`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    }
  } catch {
    // API unavailable
  }

  const local = getBlogPost(slug);
  if (local) return local;

  return { slug, title: slug.replace(/-/g, " "), description: "", content: "", published: null, readingTime: "" };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/blog/posts?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const posts = json.data?.posts || [];
      if (posts.length > 0) return posts.map((p) => ({ slug: p.slug }));
    }
  } catch {
    // API unavailable
  }

  return ALL_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — HabitFlow Blog`,
    description: post.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: "HabitFlow",
      title: `${post.title} — HabitFlow Blog`,
      description: post.description,
      images: [{ url: post.image || "/og-image.png", width: 1200, height: 630 }],
      publishedTime: post.published,
      modifiedTime: post.lastmod || post.published,
      authors: ["Prashant Khuva"],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — HabitFlow Blog`,
      description: post.description,
      images: [post.image || "/og-image.png"],
    },
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  return <BlogPostReader post={post} siteUrl={SITE_URL} />;
}
