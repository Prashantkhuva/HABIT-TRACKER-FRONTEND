import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/seo-config";
import ReactMarkdown from "react-markdown";

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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image || "/og-image.png",
    datePublished: post.published,
    dateModified: post.lastmod || post.published,
    author: {
      "@type": "Person",
      name: "Prashant Khuva",
    },
    publisher: {
      "@type": "Organization",
      name: "HabitFlow",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground truncate max-w-[200px]" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
        <article>
          <header className="mb-10">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              {post.published && (
                <time>
                  {new Date(post.published).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
              {post.readingTime && <span>{post.readingTime}</span>}
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {post.description}
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
            <ReactMarkdown>{post.content || ""}</ReactMarkdown>
          </div>

          {post.steps && post.steps.length > 0 && (
            <section className="mt-12 rounded-xl border p-6">
              <h2 className="text-xl font-semibold mb-4">
                Quick-Start Checklist
              </h2>
              <ol className="space-y-3">
                {post.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-muted-foreground">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
