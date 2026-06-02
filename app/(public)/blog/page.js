import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { SITE_URL } from "@/lib/seo-config";

export const metadata = {
  title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
  description:
    "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    siteName: "HabitFlow",
    title: "HabitFlow Blog — Guides on Habit Building & Daily Rituals",
    description:
      "Practical guides on habit building, streak tracking, habit stacking, and daily rituals. Learn how to build consistent routines that stick.",
    images: [{ url: "/og-image.png" }],
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

export default function BlogListing() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">HabitFlow Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Practical guides on habit building, streak tracking, and daily rituals.
        </p>
      </header>
      <div className="space-y-10">
        {BLOG_POSTS.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group block">
              <time className="text-sm text-muted-foreground">{post.published}</time>
              <h2 className="mt-1 text-xl font-semibold group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {post.description}
              </p>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <span>{post.readingTime}</span>
                {post.categories.map((cat) => (
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
  );
}
