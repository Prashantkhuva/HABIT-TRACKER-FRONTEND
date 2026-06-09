import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo-config";
import BlogPostReader from "@/views/blog/BlogPostReader";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const dynamic = "force-dynamic";

async function getPost(slug) {
  try {
    const res = await fetch(`${API_URL}/blog/posts/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
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
  const post = await getPost(params.slug);
  if (!post) notFound();

  return <BlogPostReader post={post} siteUrl={SITE_URL} />;
}
