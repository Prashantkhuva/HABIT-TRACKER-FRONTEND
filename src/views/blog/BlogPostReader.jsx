"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function BlogPostReader({ post, siteUrl }) {
  const { status: authStatus } = useSelector((state) => state.auth);

  return (
    <main className="bg-[#FAFAF5] dark:bg-[#141218] text-[#1A1A1A] dark:text-[#E6E1E5] overflow-hidden selection:bg-black selection:text-white">
      {/* Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] bg-[#C58B5D] blur-[150px] opacity-10 pointer-events-none" />

      <article className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
        {/* Top nav */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={authStatus ? "/dashboard" : "/"}
            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-[#555555] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors group"
          >
            <ArrowLeft
              size={12}
              strokeWidth={1.5}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            {authStatus ? "Dashboard" : "Home"}
          </Link>
          <span className="text-[#555555] dark:text-[#938F99] opacity-30 text-[9px]">/</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-[#555555] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors group"
          >
            Journal
          </Link>
        </div>

        {/* Header */}
        <header className="mb-12">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={1}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-[#555555] dark:text-[#938F99] mb-4"
          >
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
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={2}
            className="font-[Epilogue] text-[clamp(1.6rem,4vw,3rem)] leading-[0.95] tracking-[-0.05em] lowercase mb-5"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="text-[14px] sm:text-[15px] leading-[1.75] text-[#555555] dark:text-[#938F99]"
          >
            {post.description}
          </motion.p>

          {(post.categories || []).length > 0 && (
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={4}
              className="flex items-center gap-2 mt-5"
            >
              {(post.categories || []).map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-black/8 dark:border-white/8 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.12em] text-[#555555] dark:text-[#938F99]"
                >
                  {cat}
                </span>
              ))}
            </motion.div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none leading-[1.85] text-[14px] sm:text-[15px] prose-headings:mt-10 prose-headings:mb-4 prose-p:mb-5 prose-p:mt-0 prose-hr:my-8 prose-ul:my-5 prose-li:my-1 prose-blockquote:my-6">
          <ReactMarkdown>{post.content || ""}</ReactMarkdown>
        </div>

        {/* Steps */}
        {post.steps && post.steps.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="mt-16 rounded-[20px] border border-black/8 dark:border-white/8 bg-white dark:bg-[#1D1B20] p-6 sm:p-8"
          >
            <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-5">
              Quick-Start Checklist
            </p>
            <ol className="space-y-4">
              {post.steps.map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[9px] font-semibold text-white dark:text-[#1A1A1A]">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[13px] leading-[1.7] text-[#555555] dark:text-[#938F99]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </motion.section>
        )}

        {/* Footer */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="mt-16 pt-8 border-t border-black/8 dark:border-white/8"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#555555] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors group"
          >
            <ArrowLeft
              size={12}
              strokeWidth={1.5}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Read More Entries
          </Link>
        </motion.div>
      </article>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: post.title,
                    item: `${siteUrl}/blog/${post.slug}`,
                  },
                ],
              },
              {
                "@type": "Article",
                headline: post.title,
                description: post.description,
                image: post.image || "/og-image.png",
                datePublished: post.published,
                dateModified: post.lastmod || post.published,
                author: { "@type": "Person", name: "Prashant Khuva" },
                publisher: {
                  "@type": "Organization",
                  name: "HabitFlow",
                },
                mainEntityOfPage: {
                  "@type": "WebPage",
                  "@id": `${siteUrl}/blog/${post.slug}`,
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
