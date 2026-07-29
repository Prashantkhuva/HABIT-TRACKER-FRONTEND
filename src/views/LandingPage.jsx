"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Waves,
  Sparkles,
  Play,
  Clock3,
  Leaf,
  Flame,
  CalendarCheck,
  BarChart3,
  Target,
  ListChecks,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

import { useSelector } from "react-redux";
import Footer from "../components/Footer";
import LandNav from "../components/LandNav";
import Button from "../components/Button";

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

const viewportConfig = { once: true, margin: "-60px" };

const gridContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function AnimatedNumber({ to, suffix = "", duration = 1600 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

const bars = [
  { h: 55, day: "M" },
  { h: 70, day: "T" },
  { h: 60, day: "W" },
  { h: 100, day: "T" },
  { h: 85, day: "F" },
  { h: 75, day: "S" },
  { h: 50, day: "S" },
];

function AnimatedBarChart() {
  return (
    <div className="flex items-end gap-2 h-64 mb-6">
      {bars.map((bar, i) => (
        <div
          key={i}
          className="flex-1 h-full flex flex-col items-center gap-1.5 relative"
        >
          <motion.div
            className={`w-full rounded-full mt-auto ${
              i === 3
                ? "bg-black dark:bg-[#D0BCFF]"
                : "bg-black/20 dark:bg-white/20"
            }`}
            initial={{ height: 0 }}
            whileInView={{ height: `${bar.h}%` }}
            style={{ minHeight: 4, willChange: "height" }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          <span className="uppercase text-[7px] tracking-[0.15em] opacity-40">
            {bar.day}
          </span>
        </div>
      ))}
    </div>
  );
}

function AuthRedirect() {
  const router = useRouter();
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthChecked && authStatus) {
      router.replace("/dashboard");
    }
  }, [isAuthChecked, authStatus, router]);

  return null;
}

function LandingPage() {
  return (
    <>
      <AuthRedirect />
      <LandNav />

      <main
        className="
        bg-[#FAFAF5]
        dark:bg-[#141218]
        text-[#1A1A1A]
        dark:text-[#E6E1E5]
        overflow-hidden
        selection:bg-black
        selection:text-white
      "
      >
        {/* ─── HERO ─────────────────────────────────────────────────────────── */}
        <section className="min-h-screen pt-8 sm:pt-12 pb-14 sm:pb-20 px-5 sm:px-8 lg:px-20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[700px] h-[200px] sm:h-[300px] bg-[#C58B5D] blur-[120px] opacity-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-center relative z-10">
            <div className="lg:col-span-7">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0}
                className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-5"
              >
                HabitFlow — Mindful Habit Tracking
              </motion.p>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="font-[Epilogue] text-[clamp(2rem,6vw,4.5rem)] leading-[0.92] tracking-[-0.06em] lowercase mb-4 sm:mb-5"
              >
                cultivate
                <br />
                your daily
                <br />
                rituals.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2}
                className="max-w-xl text-[12px] sm:text-[13px] leading-[1.75] text-[#555555] dark:text-[#938F99] mb-4"
              >
                A premium habit tracker designed for intentional living. Create
                daily routines, track streaks, visualize progress — and transform
                your habits into lasting rituals.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={2.5}
                className="flex flex-wrap gap-1.5 mb-5 sm:mb-8"
              >
                {[
                  { icon: Flame, label: "Streak Tracking" },
                  { icon: BarChart3, label: "Progress Charts" },
                  { icon: BookOpen, label: "Daily Journal" },
                  { icon: ListChecks, label: "Habit Categories" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[8px] uppercase tracking-[0.12em]"
                  >
                    <Icon size={9} strokeWidth={2} />
                    {label}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="flex flex-wrap items-center gap-4"
              >
                <Link href="/signin">
                  <Button className="rounded-full uppercase">
                    Start The Ritual
                  </Button>
                </Link>

                <a
                  href="#how-it-works"
                  className="group flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300">
                    <Play size={12} strokeWidth={1.5} />
                  </div>
                  <span className="uppercase tracking-[0.2em] text-[8px]">
                    See How It Works
                  </span>
                </a>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute -top-20 -right-10 w-64 h-64 bg-[#E8D9A8] dark:bg-[#D0BCFF] blur-[120px] opacity-30 dark:opacity-10 rounded-full" />
              <div className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group">
                <img
                  src="/workspace.png"
                  alt="A quiet editorial workspace for ritual tracking"
                  fetchPriority="high"
                  decoding="async"
                  className="w-full aspect-[4/5] object-cover grayscale contrast-125 group-hover:scale-[1.03] transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 text-white">
                  <h2 className="font-[Epilogue] text-lg sm:text-2xl lowercase tracking-[-0.05em]">
                    your dashboard
                  </h2>
                  <p className="uppercase tracking-[0.25em] text-[8px] opacity-70 mt-1.5">
                    Track everything in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ───────────────────────────────────────────────── */}
        <section
          id="how-it-works"
          className="scroll-mt-24 py-16 sm:py-24 px-5 sm:px-8 lg:px-20 bg-white dark:bg-[#141218]"
        >
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={fadeUp}
          >
            <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-4">
              Simple Workflow
            </p>
            <h2 className="font-[Epilogue] text-[clamp(1.4rem,4.5vw,2.8rem)] tracking-[-0.06em] lowercase leading-[0.95] mb-4">
              how it works.
            </h2>
            <p className="max-w-lg mx-auto text-[12px] sm:text-[13px] leading-[1.75] text-[#555555] dark:text-[#938F99]">
              Three simple steps to transform your daily routines into lasting
              habits.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 max-w-4xl mx-auto"
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={gridContainer}
          >
            {[
              {
                step: "01",
                icon: Target,
                title: "define your ritual",
                desc: "Create habits for any area of your life — fitness, reading, meditation, learning, and more. Set your frequency and goals.",
              },
              {
                step: "02",
                icon: CheckCircle2,
                title: "track daily",
                desc: "Mark your progress with a single tap. Each completed day adds to your streak and builds momentum.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "grow with data",
                desc: "Watch your consistency grow with beautiful charts, streak counters, and weekly insights that keep you motivated.",
              },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={gridItem} className="text-center">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#1A1A1A] dark:text-[#D0BCFF]"
                  />
                </div>
                <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-2">
                  Step {step}
                </p>
                <h3 className="font-[Epilogue] text-lg sm:text-xl lowercase tracking-[-0.04em] mb-3">
                  {title}
                </h3>
                <p className="text-[12px] leading-[1.75] text-[#555555] dark:text-[#938F99] max-w-xs mx-auto">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── STATS TICKER ─────────────────────────────────────────────────── */}
        <section className="py-10 sm:py-14 px-5 sm:px-8 lg:px-20 border-y border-black/8 dark:border-white/8 bg-[#F4F4EF] dark:bg-[#1A171D]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={gridContainer}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-14 text-center"
          >
            {[
              { icon: Flame, value: 21, suffix: "-day", label: "Average streak built" },
              { icon: CalendarCheck, value: 94, suffix: "%", label: "Habit retention rate" },
              { icon: BarChart3, value: 4, suffix: " charts", label: "Progress visualizations" },
              { icon: Sparkles, value: 12, suffix: " rituals", label: "Habit categories" },
            ].map(({ icon: Icon, value, suffix, label }, i) => (
              <motion.div key={i} variants={gridItem} className="space-y-1.5">
                <Icon size={14} strokeWidth={1.5} className="mx-auto text-[#1A1A1A] dark:text-[#D0BCFF] opacity-60" />
                <p className="font-[Epilogue] text-2xl sm:text-3xl tracking-[-0.06em]">
                  <AnimatedNumber to={value} suffix={suffix} />
                </p>
                <p className="uppercase tracking-[0.2em] text-[7px] text-[#555555] dark:text-[#938F99]">
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ─── FEATURE GRID ─────────────────────────────────────────────────── */}
        <section
          id="features"
          className="scroll-mt-24 py-16 sm:py-24 px-5 sm:px-8 lg:px-20 bg-[#F4F4EF] dark:bg-[#1A171D]"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 sm:gap-8 mb-10 sm:mb-16">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-4">
                Features
              </p>
              <h2 className="font-[Epilogue] text-[clamp(1.4rem,4.5vw,2.8rem)] tracking-[-0.06em] lowercase leading-[0.95] mb-4">
                everything you
                <br />
                need to stay
                <br />
                consistent.
              </h2>
              <p className="text-[12px] sm:text-[13px] leading-[1.75] text-[#555555] dark:text-[#938F99]">
                From streak tracking to progress charts, every feature is
                designed to help you build habits that stick.
              </p>
            </div>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-12 gap-5"
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={gridContainer}
          >
            <motion.div
              variants={gridItem}
              className="md:col-span-8 bg-white dark:bg-[#1D1B20] rounded-[20px] sm:rounded-[28px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between min-h-[260px] sm:min-h-[300px]"
            >
              <div>
                <BookOpen size={28} strokeWidth={1.5} className="mb-6 text-[#1A1A1A] dark:text-[#D0BCFF]" />
                <h3 className="font-[Epilogue] text-xl sm:text-3xl tracking-[-0.05em] lowercase mb-3">
                  habit journal
                </h3>
                <p className="max-w-md text-[12px] leading-[1.75] text-[#555555] dark:text-[#938F99]">
                  Every completed habit becomes part of your personal archive —
                  a visual story of your consistency and growth.
                </p>
              </div>
              <div className="mt-8 overflow-hidden rounded-[20px] group">
                <img
                  src="/journal.png"
                  alt="Habit journal showing completed daily rituals"
                  loading="lazy"
                  className="w-full h-52 object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>
            </motion.div>

            <motion.div
              variants={gridItem}
              className="md:col-span-4 rounded-[20px] sm:rounded-[28px] bg-[#1A1A1A] dark:bg-[#D0BCFF] text-white dark:text-black p-7 sm:p-10 flex flex-col justify-center"
            >
              <h3 className="font-[Epilogue] text-3xl sm:text-5xl tracking-[-0.06em] mb-3">
                <AnimatedNumber to={94} suffix="%" />
              </h3>
              <p className="uppercase tracking-[0.25em] text-[8px] mb-5 opacity-70">
                Retention Rate
              </p>
              <p className="leading-[1.75] text-[12px] opacity-80 italic">
                "HabitFlow transformed my chaotic mornings into a calm ritual of
                focus."
              </p>
            </motion.div>

            <motion.div
              variants={gridItem}
              className="md:col-span-4 bg-[#EAEAE4] dark:bg-[#1D1B20] rounded-[20px] sm:rounded-[28px] p-6 sm:p-8 min-h-[180px] sm:min-h-[220px] flex flex-col justify-between"
            >
              <Waves size={22} strokeWidth={1.5} className="text-[#1A1A1A] dark:text-[#D0BCFF]" />
              <div>
                <h3 className="font-[Epilogue] text-xl tracking-[-0.05em] lowercase mb-2">
                  flexible tracking
                </h3>
                <p className="uppercase tracking-[0.2em] text-[8px] text-[#555555] dark:text-[#938F99]">
                  Daily &bull; Weekly &bull; Custom
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={gridItem}
              className="md:col-span-8 overflow-hidden rounded-[20px] sm:rounded-[28px] relative group min-h-[200px] sm:min-h-0"
            >
              <img
                src="/minimal-desk.png"
                alt="Minimal desk setup for distraction-free habit tracking"
                loading="lazy"
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.03] transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 text-white">
                <h3 className="font-[Epilogue] text-xl sm:text-3xl tracking-[-0.05em] lowercase mb-2">
                  organized rituals
                </h3>
                <p className="max-w-xs sm:max-w-sm text-[12px] text-white/70 leading-[1.75]">
                  Categorize and manage all your habits in one clean, intuitive
                  interface. Filter by active, completed, or category.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ─── BROADSHEET ───────────────────────────────────────────────────── */}
        <section
          id="archive"
          className="scroll-mt-24 py-16 sm:py-28 px-5 sm:px-8 lg:px-20 bg-white dark:bg-[#141218]"
        >
          <motion.div
            className="text-center mb-10 sm:mb-20"
            initial="hidden"
            whileInView="show"
            viewport={viewportConfig}
            variants={fadeUp}
          >
            <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-5">
              Insights
            </p>
            <h2 className="font-[Epilogue] text-[clamp(1.8rem,4.5vw,3.5rem)] tracking-[-0.06em] lowercase leading-[0.95]">
              track your
              <br />
              weekly rhythm.
            </h2>
          </motion.div>

          <div className="border-y border-black/10 dark:border-white/10 py-8 sm:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-14">
            <motion.div
              className="space-y-7"
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              variants={fadeUp}
              custom={0}
            >
              <div className="border-b border-black/5 dark:border-white/5 pb-5">
                <p className="uppercase tracking-[0.2em] text-[7px] opacity-50 mb-3">
                  Track Record
                </p>
                <h3 className="font-[Epilogue] text-xl lowercase tracking-[-0.04em] mb-2">
                  morning meditation
                </h3>
                <p className="text-[12px] leading-[1.75] text-[#555555] dark:text-[#938F99]">
                  Meditation completed at dawn. Focus remains the primary
                  objective. 14-day streak and counting.
                </p>
              </div>
              <div className="overflow-hidden rounded-sm group">
                <img
                  src="/writing.png"
                  alt="Writing ritual for morning composition and focus"
                  className="w-full aspect-square object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>
            </motion.div>

            <motion.div
              className="lg:border-x border-black/10 dark:border-white/10 lg:px-10 lg:py-10"
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              variants={fadeUp}
              custom={1}
            >
              <div className="text-center">
                <p className="uppercase tracking-[0.35em] text-[8px] mb-6">
                  Weekly Distribution
                </p>
                <AnimatedBarChart />
                <p className="font-[Epilogue] text-lg italic lowercase leading-snug">
                  "consistency is the only metric that matters."
                </p>
              </div>
            </motion.div>

            <motion.div
              className="space-y-7"
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              variants={fadeUp}
              custom={2}
            >
              <div className="overflow-hidden rounded-sm group">
                <img
                  src="/tea.png"
                  alt="Evening wind-down ritual with tea and reflection"
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>
              <div>
                <h3 className="font-[Epilogue] text-xl lowercase tracking-[-0.04em] mb-2">
                  deep analytics
                </h3>
                <p className="text-[12px] leading-[1.75] text-[#555555] dark:text-[#938F99]">
                  Visualize your progress with heatmaps, weekly charts, and
                  comprehensive statistics that reveal your patterns.
                </p>
                <a
                  href="#how-it-works"
                  className="mt-4 inline-block uppercase tracking-[0.2em] text-[8px] border-b border-black dark:border-white pb-1 hover:opacity-60 transition-opacity"
                >
                  View Your Stats
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── PHILOSOPHY ───────────────────────────────────────────────────── */}
        <section
          id="philosophy"
          className="scroll-mt-24 relative px-5 sm:px-8 lg:px-20 py-16 sm:py-28 lg:py-32 bg-[#FAFAF5] dark:bg-[#141218] overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.12] dark:opacity-[0.16]"
            style={{
              backgroundImage: "url('/grain.png')",
              backgroundRepeat: "repeat",
              backgroundSize: "360px 360px",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-[#FAFAF5]/85 dark:bg-[#141218]/82 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:mx-0 lg:max-w-[400px]"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-black/10 dark:border-white/10 rounded-full" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C58B5D]/20 dark:bg-[#D0BCFF]/15 blur-[60px] rounded-full" />
              <div className="relative overflow-hidden rounded-[24px] bg-black shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)]">
                <img
                  src="/grain.png"
                  alt="A quiet monochrome ritual scene"
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="uppercase tracking-[0.25em] text-[8px] opacity-70 mb-2">
                    Clean Design
                  </p>
                  <h3 className="font-[Epilogue] text-xl sm:text-2xl lowercase tracking-[-0.05em] leading-none">
                    built for focus
                  </h3>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={viewportConfig}
              custom={1}
            >
              <p className="uppercase tracking-[0.35em] text-[8px] text-[#555555] dark:text-[#938F99] mb-5">
                The Philosophy
              </p>
              <h2 className="font-[Epilogue] text-[clamp(1.8rem,4.5vw,3.2rem)] tracking-[-0.06em] lowercase leading-[0.95] mb-5 sm:mb-7">
                the luxury
                <br />
                of intentionality.
              </h2>

              <div className="space-y-6">
                {[
                  {
                    Icon: Sparkles,
                    title: "tactile feedback",
                    desc: "Interactions designed to feel premium and thoughtful. Every tap and swipe reinforces your commitment.",
                  },
                  {
                    Icon: Clock3,
                    title: "rhythmic cadence",
                    desc: "Built around natural momentum rather than overwhelming productivity systems. Start small, grow steadily.",
                  },
                  {
                    Icon: Leaf,
                    title: "quiet aesthetics",
                    desc: "A calm visual language that disappears into your ritual — letting your habits take center stage.",
                  },
                ].map(({ Icon, title, desc }, i) => (
                  <motion.div
                    key={i}
                    className="flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportConfig}
                    transition={{
                      duration: 0.55,
                      delay: i * 0.1 + 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="mt-0.5">
                      <Icon size={16} strokeWidth={1.5} className="text-[#1A1A1A] dark:text-[#D0BCFF]" />
                    </div>
                    <div>
                      <h3 className="font-[Epilogue] text-lg lowercase mb-1.5">{title}</h3>
                      <p className="text-[12px] leading-[1.75] text-[#555555] dark:text-[#938F99]">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/signin" className="inline-flex mt-8">
                <Button className="uppercase">
                  Start The Ritual
                  <ArrowRight size={12} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ─── FINAL CTA ────────────────────────────────────────────────────── */}
        <section className="px-5 sm:px-8 lg:px-20 pb-16 sm:pb-24">
          <motion.div
            className="relative overflow-hidden rounded-[24px] sm:rounded-[40px] bg-[#111111] text-white px-6 py-14 sm:px-8 sm:py-20 lg:p-24 text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10">
              <h2 className="font-[Epilogue] text-[clamp(1.8rem,4.5vw,3.2rem)] lg:text-6xl tracking-[-0.06em] lowercase leading-[0.95] mb-5 sm:mb-8">
                begin your
                <br />
                first ritual.
              </h2>
              <Link href="/signin">
                <Button
                  variant="secondary"
                  className="mx-auto uppercase"
                >
                  Join The Collective
                  <ArrowRight size={12} />
                </Button>
              </Link>
              <p className="mt-6 uppercase tracking-[0.25em] text-[8px] opacity-50">
                Start building habits that last a lifetime
              </p>
            </div>
          </motion.div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default LandingPage;
