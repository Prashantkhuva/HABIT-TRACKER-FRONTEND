"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Search, ArrowLeft } from "lucide-react";
import { SITE_URL } from "@/lib/seo-config";
import { useSelector } from "react-redux";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      delay: i * 0.11,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const gridContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function BlogListing({ posts }) {
  const { status: authStatus } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const postList = Array.isArray(posts) ? posts : [];

  const filtered = search
    ? postList.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()),
      )
    : postList;

  return (
    <main className="bg-background text-text-primary overflow-hidden selection:bg-primary selection:text-background">
      {/* Top nav */}
      <div className="relative z-20 px-5 sm:px-8 lg:px-20 pt-6">
        <Link
          href={authStatus ? "/dashboard" : "/"}
          className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] app-muted hover:text-text-primary transition-colors group"
        >
          <ArrowLeft
            size={12}
            strokeWidth={1.5}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          {authStatus ? "Dashboard" : "Home"}
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pt-12 pb-12 sm:px-8 sm:pt-20 sm:pb-16 lg:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[250px] bg-[#C58B5D] blur-[120px] opacity-20" />

        <motion.div
          initial="hidden"
          animate="show"
          className="relative z-10 max-w-2xl mx-auto text-center"
        >
          <motion.p
            variants={fadeUp}
            custom={0}
            className="app-label mb-5"
          >
            HabitFlow — The Journal
          </motion.p>
          <motion.h1
            variants={fadeUp}
            custom={1}
            className="font-heading text-[clamp(2rem,6vw,4rem)] leading-[0.92] tracking-[-0.06em] lowercase mb-4"
          >
            notes on
            <br />
            intentional living.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="max-w-lg mx-auto text-[12px] sm:text-[13px] leading-[1.75] app-muted"
          >
            Practical guides on habit building, streak tracking, and the quiet
            art of daily rituals — written for those who value consistency over
            intensity.
          </motion.p>
        </motion.div>
      </section>

      {/* Search */}
      <section className="px-5 sm:px-8 lg:px-20 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 app-muted pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search journal entries..."
              className="w-full rounded-full border border-border-subtle/50 bg-surface pl-10 pr-5 py-3 text-sm outline-none transition-colors focus:border-text-primary"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-5 sm:px-8 lg:px-20 pb-20 sm:pb-28">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[13px] app-muted py-16"
            >
              {posts.length === 0
                ? "No entries yet. The journal is blank."
                : "No entries match your search."}
            </motion.p>
          )}

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            variants={gridContainer}
            className="space-y-6"
          >
            {filtered.map((post) => (
              <motion.div key={post._id || post.slug} variants={gridItem}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <article className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] bg-surface border border-border-subtle/30 p-6 sm:p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.4)]">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] app-muted mb-3">
                          {post.published && (
                            <time className="text-[9px]">
                              {new Date(post.published).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </time>
                          )}
                          {post.readingTime && (
                            <span className="opacity-60">{post.readingTime}</span>
                          )}
                        </div>

                        <h2 className="font-heading text-xl sm:text-2xl tracking-[-0.04em] lowercase group-hover:opacity-70 transition-opacity duration-300 mb-2">
                          {post.title}
                        </h2>

                        <p className="text-[12px] sm:text-[13px] leading-[1.75] app-muted line-clamp-2">
                          {post.description}
                        </p>

                        {(post.categories || []).length > 0 && (
                          <div className="flex items-center gap-3 mt-4">
                            {(post.categories || []).map((cat) => (
                              <span
                                key={cat}
                                className="rounded-full border border-border-subtle/40 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.12em] app-muted"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full border border-border-subtle/40 shrink-0 group-hover:bg-primary group-hover:text-background transition-all duration-300">
                        <ArrowRight size={14} strokeWidth={1.5} />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
              author: { "@type": "Person", name: "Prashant Khuva" },
            })),
          }),
        }}
      />
    </main>
  );
}
