"use client";

import { useState } from "react";
import {
  Mail,
  Plus,
  BookOpen,
  Sparkles,
  BarChart2,
  UserRound,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import Input from "../components/Input";
import Textarea from "../components/Textarea";

const TOPICS = [
  { icon: BookOpen, label: "Getting started", count: 3 },
  { icon: Sparkles, label: "Rituals & streaks", count: 3 },
  { icon: BarChart2, label: "Statistics", count: 2 },
  { icon: UserRound, label: "Account", count: 2 },
];

const FAQS = [
  {
    q: "How do I create my first ritual?",
    a: "Hit NEW RITUAL in the sidebar (or press Ctrl+K and type “create”). Pick a category, colour and frequency — daily rituals show up on your dashboard right away.",
    topic: "Getting started",
  },
  {
    q: "What is the difference between a ritual and a habit?",
    a: "Nothing — HabitFlow calls them rituals to keep the language intentional. Same tracking, same streaks.",
    topic: "Getting started",
  },
  {
    q: "How do streaks work?",
    a: "Complete a ritual each day to grow its streak. Missing a day resets it. Your longest streak is tracked in statistics and shown on the habit detail page.",
    topic: "Rituals & streaks",
  },
  {
    q: "Can I pause a ritual instead of deleting it?",
    a: "Yes. Open the ritual and use Pause — it keeps all history and streak data. Resume anytime.",
    topic: "Rituals & streaks",
  },
  {
    q: "What do the hatched cells in the heatmap mean?",
    a: "They are days with no completions logged. Darker green means more rituals completed that day.",
    topic: "Statistics",
  },
  {
    q: "How is the completion rate calculated?",
    a: "Completed rituals today divided by active rituals, as a percentage. The donut on your dashboard shows the same number.",
    topic: "Statistics",
  },
  {
    q: "Can I export my data?",
    a: "Settings → Data export downloads everything as JSON or CSV. Your rituals and history are yours.",
    topic: "Account",
  },
  {
    q: "How do I change theme or accent colour?",
    a: "Settings → Appearance. Light, dark or system, plus four accent colours — remembered on this device.",
    topic: "Account",
  },
];

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], label: "Command palette" },
  { keys: ["/"], label: "Search, from anywhere" },
  { keys: ["G", "D"], label: "Go to dashboard" },
  { keys: ["G", "R"], label: "Go to rituals" },
  { keys: ["G", "S"], label: "Go to statistics" },
  { keys: ["G", "H"], label: "Go to help" },
  { keys: ["Esc"], label: "Close menus and dialogs" },
];

function Kbd({ children }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded-md border border-border-subtle bg-surface-dim px-1.5 py-0.5 text-[10px] font-bold text-text-primary shadow-[0_1px_0_var(--color-border-subtle)]">
      {children}
    </kbd>
  );
}

export default function HelpPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [filter, setFilter] = useState("All");
  const [showAll, setShowAll] = useState(false);

  const visibleFaqs = FAQS.filter(
    (f) => filter === "All" || f.topic === filter,
  ).slice(0, showAll ? FAQS.length : 5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    setLoading(true);
    try {
      const res = await fetch("https://formspree.io/f/mjgjqnqd", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSuccess(true);
        form.reset();
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto pb-4 text-text-primary">
      <div className="mb-6 sm:mb-10">
        <h1 className="app-heading text-[clamp(2.5rem,5vw,4rem)]">
          help center
        </h1>
        <p className="app-label mt-2">
          Answers, shortcuts, and a human when you need one
        </p>
      </div>

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[var(--r-lg)] bg-primary p-6 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-radial-gradient(circle at 120% 130%, transparent 0 14px, currentColor 14px 15px)",
          }}
        />
        <div className="relative">
          <h2 className="font-heading text-2xl font-bold tracking-[-0.04em] text-background sm:text-3xl">
            How can we help?
          </h2>
          <p className="mt-2 text-sm text-background/70">
            Browse a topic below, or open the command palette with Ctrl K.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {TOPICS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => {
                  setFilter(filter === t.label ? "All" : t.label);
                  document
                    .getElementById("faq")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`flex items-center gap-3 rounded-[var(--r-sm)] border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  filter === t.label
                    ? "border-background/50 bg-background/15"
                    : "border-background/15 bg-background/5 hover:bg-background/10"
                }`}
              >
                <t.icon size={16} className="shrink-0 text-background" />
                <div>
                  <p className="text-xs font-bold text-background">{t.label}</p>
                  <p className="text-[10px] text-background/60">
                    {t.count} articles
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {/* FAQ */}
        <motion.section
          id="faq"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="app-surface rounded-[var(--r-lg)] p-6 sm:p-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold tracking-[-0.04em]">
              Frequently asked
            </h2>
            <button
              onClick={() => setShowAll((v) => !v)}
              className="text-[10px] font-bold uppercase tracking-widest text-accent-mint hover:underline"
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          </div>

          <div className="mt-4">
            {visibleFaqs.map((f) => {
              const isOpen = openFaq === f.q;
              return (
                <div
                  key={f.q}
                  className="border-b border-border-subtle/50 last:border-0"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : f.q)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-text-primary">
                      {f.q}
                    </span>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-subtle/60 bg-surface-dim text-text-muted transition-transform duration-300 ${
                        isOpen
                          ? "rotate-45 bg-accent-mint/10 text-accent-mint"
                          : ""
                      }`}
                    >
                      <Plus size={13} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 pr-10 text-sm leading-relaxed text-text-muted">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        <div className="flex flex-col gap-4">
          {/* SHORTCUTS */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.14,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="app-surface rounded-[var(--r-lg)] p-6"
          >
            <h2 className="font-heading text-lg font-bold tracking-[-0.04em]">
              Keyboard shortcuts
            </h2>
            <div className="mt-4 space-y-3">
              {SHORTCUTS.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-1.5">
                    {s.keys.map((k) => (
                      <Kbd key={k}>{k}</Kbd>
                    ))}
                  </span>
                  <span className="text-xs text-text-muted">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* STILL STUCK */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[var(--r-lg)] bg-primary p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/10">
              <MessageCircle size={18} className="text-background" />
            </div>
            <h2 className="font-heading text-lg font-bold tracking-[-0.04em] text-background">
              Still stuck?
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-background/70">
              Message the form below — usually answers within 2 hours.
            </p>
            <a
              href="#contact"
              className="mt-4 inline-flex rounded-full bg-background px-5 py-2.5 text-xs font-bold text-text-primary transition-transform duration-300 hover:-translate-y-0.5"
            >
              Start a message
            </a>
          </motion.section>
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 app-surface rounded-[var(--r-lg)] p-6 sm:p-8">
          <div>
            <p className="app-label mb-2">DIRECT</p>
            <h2 className="font-heading text-2xl font-bold tracking-[-0.04em]">
              reach out anytime
            </h2>
            <p className="mt-3 max-w-sm text-sm text-text-muted">
              feel free to reach out anytime. our rhythm matches yours.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href="mailto:work.prashantkhuva@gmail.com"
                className="flex items-center gap-4 rounded-2xl border border-border-subtle/60 bg-surface-dim/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-mint/30 sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="app-label">EMAIL</p>
                  <p className="text-sm font-medium">
                    work.prashantkhuva@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/prashantkhuva"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border-subtle/60 bg-surface-dim/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-mint/30 sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2a2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6M2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </div>
                <div>
                  <p className="app-label">LINKEDIN</p>
                  <p className="text-sm font-medium">prashantkhuva</p>
                </div>
              </a>

              <a
                href="https://x.com/prashantkhuva_"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-border-subtle/60 bg-surface-dim/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-mint/30 sm:p-5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6c2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4c-.9-4.2 4-6.6 7-3.8c1.1 0 3-1.2 3-1.2" />
                  </svg>
                </div>
                <div>
                  <p className="app-label">X / TWITTER</p>
                  <p className="text-sm font-medium">@prashantkhuva_</p>
                </div>
              </a>
            </div>
          </div>

          <img
            src="/help.png"
            alt="help"
            loading="lazy"
            className="hidden rounded-3xl w-full object-cover sm:block"
          />
        </div>

        <div className="app-surface rounded-[var(--r-lg)] p-5 sm:p-6 lg:p-8">
          <h2 className="font-heading mb-6 text-xl font-semibold sm:text-2xl">
            direct message
          </h2>

          {success && (
            <p className="mb-4 text-sm text-accent-mint">
              ✅ Message sent successfully!
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <Input name="name" label="Full Name" required />
            <Input name="email" type="email" label="Email Address" required />
            <Textarea name="message" rows={5} label="Your Message" required />

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? "Sending..." : "SEND MESSAGE"}
            </Button>
          </form>

          <p className="app-label mt-6 text-right">
            usually responds within 2 hours
          </p>
        </div>
      </div>
    </div>
  );
}
