import Link from "next/link";
import { SITE_URL } from "@/lib/seo-config";

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

export const metadata = {
  title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
  description:
    "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
  robots: "index, follow",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: "HabitFlow",
    title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals.",
    images: ["/og-image.png"],
  },
};

export default async function BlogListing() {
  const posts = await getPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog/#blog`,
    name: "HabitFlow Blog",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals.",
    url: `${SITE_URL}/blog`,
    publisher: {
      "@type": "Organization",
      name: "HabitFlow",
      logo: `${SITE_URL}/logo.png`,
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.published || post.createdAt,
      author: {
        "@type": "Person",
        name: "Prashant Khuva",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground" aria-current="page">Blog</li>
            </ol>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight">HabitFlow Blog</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Practical guides on habit building, streak tracking, and daily rituals.
          </p>
        </header>
        <div className="space-y-10">
          {posts.length === 0 && (
            <p className="text-muted-foreground">No posts yet. Check back soon.</p>
          )}
          {posts.map((post) => (
            <article key={post._id || post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <time
                  className="text-sm text-muted-foreground"
                  dateTime={post.published || post.createdAt}
                >
                  {post.published
                    ? new Date(post.published).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </time>
                <h2 className="mt-1 text-xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                  {post.readingTime && <span>{post.readingTime}</span>}
                  {(post.categories || []).map((cat) => (
                    <span key={cat} className="rounded-full border px-2.5 py-0.5 text-xs">
                      {cat}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
