"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useRef } from "react";

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
  const articleRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <main className="bg-background text-text-primary overflow-hidden selection:bg-primary selection:text-background">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed left-0 top-0 z-[9999] h-[2px] w-full origin-left bg-gradient-to-r from-accent-mint to-accent-soft"
      />

      {/* Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1000px] h-[300px] bg-[#C58B5D] blur-[150px] opacity-10 pointer-events-none" />

      <article ref={articleRef} className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-32">
        {/* Top nav */}
        <div className="mb-8 flex items-center gap-4">
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
          <span className="app-muted opacity-30 text-[9px]">/</span>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] app-muted hover:text-text-primary transition-colors group"
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
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] app-muted mb-4"
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
            className="font-heading text-[clamp(1.6rem,4vw,3rem)] leading-[0.95] tracking-[-0.05em] lowercase mb-5"
          >
            {post.title}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            variants={fadeUp}
            custom={3}
            className="text-[14px] sm:text-[15px] leading-[1.75] app-muted"
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
                  className="rounded-full border border-border-subtle/40 px-2.5 py-0.5 text-[8px] uppercase tracking-[0.12em] app-muted transition-colors duration-300 hover:border-accent-mint/30 hover:text-accent-mint"
                >
                  {cat}
                </span>
              ))}
            </motion.div>
          )}
        </header>

        {/* Content */}
        <div className="max-w-none leading-[1.85] text-[14px] sm:text-[15px] [&_h2]:mt-12 [&_h2]:mb-5 [&_h2]:font-heading [&_h2]:text-[22px] [&_h2]:tracking-[-0.04em] [&_h3]:mt-12 [&_h3]:mb-5 [&_h3]:font-bold [&_h3]:text-[18px] [&_p]:mb-6 [&_p]:mt-0 [&_hr]:my-10 [&_ul]:my-5 [&_li]:my-1 [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-text-muted [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:app-muted [&_code]:rounded-md [&_code]:bg-surface-dim [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[13px] [&_pre]:rounded-2xl [&_pre]:bg-surface-dim [&_pre]:p-4 [&_pre]:overflow-x-auto [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:opacity-70">
          <ReactMarkdown>{post.content || ""}</ReactMarkdown>
        </div>

        {/* Steps */}
        {post.steps && post.steps.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="relative overflow-hidden mt-16 rounded-[20px] border border-border-subtle/30 bg-surface p-6 sm:p-8"
          >
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-mint/5 blur-[60px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <p className="app-label mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
                Quick-Start Checklist
              </p>
              <ol className="space-y-4">
                {post.steps.map((step, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-4 items-start"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-background">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[13px] leading-[1.7] app-muted">
                      {step}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="relative mt-16 pt-8 border-t border-border-subtle/30"
        >
          <div className="absolute -top-[1px] left-0 h-[1px] w-0 bg-accent-mint/30 group-hover:w-full transition-all duration-700" />
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] app-muted hover:text-text-primary transition-colors group"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full border border-border-subtle/40 transition-all duration-300 group-hover:bg-primary group-hover:text-background group-hover:border-transparent group-hover:shadow-[0_0_20px_-4px_rgba(75,107,99,0.3)]">
              <ArrowLeft
                size={12}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />
            </span>
            <span className="transition-all duration-300 group-hover:tracking-[0.25em]">Read More Entries</span>
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
