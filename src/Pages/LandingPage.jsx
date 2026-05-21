import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Waves,
  Sparkles,
  Play,
  Clock3,
  Leaf,
} from "lucide-react";

import Footer from "../components/Footer";
import LandNav from "../components/LandNav";
import Button from "../components/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function LandingPage() {
  return (
    <>
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
        {/* HERO */}
        <section className="min-h-screen pt-40 pb-24 px-8 lg:px-20 relative overflow-hidden">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-[#C58B5D] blur-[120px] opacity-20" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            {/* LEFT */}
            <div className="lg:col-span-7">
              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0}
                className="uppercase tracking-[0.35em] text-[10px] text-[#7A7A7A] dark:text-[#938F99] mb-8"
              >
                Volume 01 — The Editorial Ritual
              </motion.p>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={1}
                className="font-[Epilogue] text-6xl sm:text-7xl lg:text-[120px] leading-[0.85] tracking-[-0.07em] lowercase mb-10"
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
                className="max-w-xl text-[17px] leading-relaxed text-[#6F6F6F] dark:text-[#938F99] mb-12"
              >
                A rhythmic workspace crafted for intentional living. Transform
                habits into a quiet editorial journey of consistency, clarity,
                and stillness.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="flex flex-wrap items-center gap-5"
              >
                <Link to="/signin">
                  <Button className="rounded-full px-10 py-5 uppercase tracking-[0.2em] text-[10px]">
                    Start The Ritual
                  </Button>
                </Link>

                <button className="group flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                    <Play size={18} strokeWidth={1.5} />
                  </div>

                  <span className="uppercase tracking-[0.2em] text-[10px]">
                    The Philosophy
                  </span>
                </button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="lg:col-span-5 relative"
            >
              <div className="absolute -top-20 -right-10 w-72 h-72 bg-[#E8D9A8] dark:bg-[#D0BCFF] blur-[120px] opacity-30 dark:opacity-10 rounded-full" />

              <div className="relative overflow-hidden rounded-[36px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] group">
                <img
                  src="./workspace.png"
                  alt="workspace"
                  className="w-full aspect-[4/5] object-cover grayscale contrast-125 group-hover:scale-[1.03] transition-transform duration-1000"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="font-[Epilogue] text-4xl lowercase tracking-[-0.05em]">
                    morning stillness
                  </h3>

                  <p className="uppercase tracking-[0.25em] text-[10px] opacity-70 mt-3">
                    Ritual № 01 • 6:00 AM
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FEATURE GRID */}
        <section
          id="features"
          className="scroll-mt-28 py-32 px-8 lg:px-20 bg-[#F4F4EF] dark:bg-[#1A171D]"
        >
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
            <div className="max-w-xl">
              <p className="uppercase tracking-[0.35em] text-[10px] text-[#6F6F6F] dark:text-[#938F99] mb-6">
                Curated Experience
              </p>

              <h2 className="font-[Epilogue] text-5xl lg:text-7xl tracking-[-0.06em] lowercase leading-[0.9] mb-6">
                designed for
                <br />
                quiet intention.
              </h2>

              <p className="text-[#6F6F6F] dark:text-[#938F99] leading-relaxed">
                Every interaction is designed to feel tactile, calm, and
                editorial. No clutter. No noise. Just rhythm.
              </p>
            </div>

            <button className="uppercase tracking-[0.25em] text-[10px] border-b border-black dark:border-white pb-2">
              Explore Ecosystem
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* BIG CARD */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="md:col-span-8 bg-white dark:bg-[#1D1B20] rounded-[36px] p-10 lg:p-14 flex flex-col justify-between min-h-[350px]"
            >
              <div>
                <BookOpen
                  size={42}
                  strokeWidth={1.5}
                  className="mb-10 text-[#1A1A1A] dark:text-[#D0BCFF]"
                />

                <h3 className="font-[Epilogue] text-5xl tracking-[-0.05em] lowercase mb-5">
                  visual narrative
                </h3>

                <p className="max-w-md text-[#6F6F6F] dark:text-[#938F99] leading-relaxed">
                  Every completed habit becomes part of your personal archive —
                  a quiet visual story of consistency.
                </p>
              </div>

              <div className="mt-14 h-15 overflow-hidden rounded-[28px] group">
                <img
                  src="./journal.png"
                  alt=""
                  className="w-full h-72 object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>
            </motion.div>

            {/* STAT CARD */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
              className="md:col-span-4 rounded-[36px] bg-[#1A1A1A] dark:bg-[#D0BCFF] text-white dark:text-black p-12 flex flex-col justify-center"
            >
              <h3 className="font-[Epilogue] text-7xl tracking-[-0.06em] mb-4">
                94%
              </h3>

              <p className="uppercase tracking-[0.25em] text-[10px] mb-8 opacity-70">
                Retention Rate
              </p>

              <p className="leading-relaxed opacity-80 italic">
                “HabitFlow transformed my chaotic mornings into a calm ritual of
                focus.”
              </p>
            </motion.div>

            {/* SMALL FEATURE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
              className="md:col-span-4 bg-[#EAEAE4] dark:bg-[#1D1B20] rounded-[36px] p-10 min-h-[300px] flex flex-col justify-between"
            >
              <Waves
                size={36}
                strokeWidth={1.5}
                className="text-[#1A1A1A] dark:text-[#D0BCFF]"
              />

              <div>
                <h3 className="font-[Epilogue] text-3xl tracking-[-0.05em] lowercase mb-3">
                  rhythmic pacing
                </h3>

                <p className="uppercase tracking-[0.2em] text-[10px] text-[#6F6F6F] dark:text-[#938F99]">
                  Natural Flow
                </p>
              </div>
            </motion.div>

            {/* IMAGE CARD */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={3}
              className="md:col-span-8 overflow-hidden rounded-[36px] relative group"
            >
              <img
                src="./minimal-desk.png"
                alt=""
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.03] transition-transform duration-1000"
              />

              <div className="absolute inset-0 bg-black/25" />

              <div className="absolute bottom-10 left-10 text-white">
                <h3 className="font-[Epilogue] text-5xl tracking-[-0.05em] lowercase mb-4">
                  digital stillness
                </h3>

                <p className="max-w-sm text-white/70 leading-relaxed">
                  No distractions. No clutter. Just your intentions and the
                  rhythm of the day.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* BROADSHEET */}
        <section
          id="archive"
          className="scroll-mt-28 py-40 px-8 lg:px-20 bg-white dark:bg-[#141218]"
        >
          <div className="text-center mb-28">
            <p className="uppercase tracking-[0.35em] text-[10px] text-[#6F6F6F] dark:text-[#938F99] mb-8">
              The Archive
            </p>

            <h2 className="font-[Epilogue] text-6xl lg:text-8xl tracking-[-0.06em] lowercase leading-[0.9]">
              the broadsheet
              <br />
              spread.
            </h2>
          </div>

          <div className="border-y border-black/10 dark:border-white/10 py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* LEFT */}
            <div className="space-y-10">
              <div className="border-b border-black/5 dark:border-white/5 pb-8">
                <p className="uppercase tracking-[0.2em] text-[9px] opacity-50 mb-5">
                  Volume 01 • Issue 04
                </p>

                <h3 className="font-[Epilogue] text-3xl lowercase tracking-[-0.04em] mb-4">
                  monday composition
                </h3>

                <p className="text-sm leading-relaxed text-[#6F6F6F] dark:text-[#938F99]">
                  Meditation completed at dawn. Focus remains the primary
                  objective. Silence became the framework for clarity.
                </p>
              </div>

              <div className="overflow-hidden rounded-sm group">
                <img
                  src="./writing.png"
                  alt=""
                  className="w-full aspect-square object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>
            </div>

            {/* CENTER */}
            <div className="lg:border-x border-black/10 dark:border-white/10 lg:px-12">
              <div className="text-center">
                <p className="uppercase tracking-[0.35em] text-[10px] mb-10">
                  Weekly Distribution
                </p>

                <div className="flex items-end gap-3 h-72 mb-10">
                  {[30, 50, 40, 90, 70, 60, 35].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i === 3
                          ? "bg-black dark:bg-[#D0BCFF]"
                          : "bg-black/20 dark:bg-white/20"
                      }`}
                      style={{
                        height: `${h}%`,
                      }}
                    />
                  ))}
                </div>

                <p className="font-[Epilogue] text-2xl italic lowercase">
                  “consistency is the only metric that matters.”
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="space-y-10">
              <div className="overflow-hidden rounded-sm group">
                <img
                  src="./tea.png"
                  alt=""
                  className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                />
              </div>

              <div>
                <h3 className="font-[Epilogue] text-3xl lowercase tracking-[-0.04em] mb-4">
                  evening wind-down
                </h3>

                <p className="text-sm leading-relaxed text-[#6F6F6F] dark:text-[#938F99]">
                  Closing the loop of the day through silence, reflection, and
                  intentional rest.
                </p>

                <button className="mt-6 uppercase tracking-[0.2em] text-[10px] border-b border-black dark:border-white pb-1">
                  View Full Journal
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section
          id="philosophy"
          className="scroll-mt-28 relative px-8 lg:px-20 py-32 lg:py-40 bg-[#FAFAF5] dark:bg-[#141218] overflow-hidden"
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

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* IMAGE */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative mx-auto w-full max-w-[380px] sm:max-w-[420px] lg:mx-0 lg:max-w-[460px]"
            >
              <div className="absolute -top-6 -left-6 w-36 h-36 border border-black/10 dark:border-white/10 rounded-full" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#C58B5D]/20 dark:bg-[#D0BCFF]/15 blur-[70px] rounded-full" />

              <div className="relative overflow-hidden rounded-[28px] bg-black shadow-[0_30px_80px_-35px_rgba(0,0,0,0.35)]">
                <img
                  src="/grain.png"
                  alt="A quiet monochrome ritual scene"
                  className="w-full aspect-[3/4] object-cover opacity-90"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                <div className="absolute bottom-7 left-7 right-7 text-white">
                  <p className="uppercase tracking-[0.25em] text-[10px] opacity-70 mb-3">
                    Ritual Study
                  </p>

                  <h3 className="font-[Epilogue] text-3xl sm:text-4xl lowercase tracking-[-0.05em] leading-none">
                    quiet focus
                  </h3>
                </div>
              </div>
            </motion.div>

            {/* CONTENT */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
            >
              <p className="uppercase tracking-[0.35em] text-[10px] text-[#6F6F6F] dark:text-[#938F99] mb-8">
                The Philosophy
              </p>

              <h2 className="font-[Epilogue] text-6xl lg:text-7xl tracking-[-0.06em] lowercase leading-[0.9] mb-10">
                the luxury
                <br />
                of intentionality.
              </h2>

              <div className="space-y-9">
                <div className="flex gap-6">
                  <div className="mt-1">
                    <Sparkles
                      size={22}
                      strokeWidth={1.5}
                      className="text-[#1A1A1A] dark:text-[#D0BCFF]"
                    />
                  </div>

                  <div>
                    <h3 className="font-[Epilogue] text-2xl lowercase mb-3">
                      tactile feedback
                    </h3>

                    <p className="text-[#6F6F6F] dark:text-[#938F99] leading-relaxed">
                      Interactions designed to feel like premium paper, ink, and
                      thoughtful composition.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="mt-1">
                    <Clock3
                      size={22}
                      strokeWidth={1.5}
                      className="text-[#1A1A1A] dark:text-[#D0BCFF]"
                    />
                  </div>

                  <div>
                    <h3 className="font-[Epilogue] text-2xl lowercase mb-3">
                      rhythmic cadence
                    </h3>

                    <p className="text-[#6F6F6F] dark:text-[#938F99] leading-relaxed">
                      Built around natural momentum rather than overwhelming
                      productivity systems.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="mt-1">
                    <Leaf
                      size={22}
                      strokeWidth={1.5}
                      className="text-[#1A1A1A] dark:text-[#D0BCFF]"
                    />
                  </div>

                  <div>
                    <h3 className="font-[Epilogue] text-2xl lowercase mb-3">
                      quiet aesthetics
                    </h3>

                    <p className="text-[#6F6F6F] dark:text-[#938F99] leading-relaxed">
                      A calm visual language designed to disappear into your
                      ritual.
                    </p>
                  </div>
                </div>
              </div>

              <Link to="/signin" className="inline-flex mt-12">
                <Button className="px-8 py-4 uppercase text-xs tracking-[0.18em]">
                  Start The Ritual
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-8 lg:px-20 pb-32">
          <div className="relative overflow-hidden rounded-[48px] bg-[#111111] text-white px-8 py-28 lg:p-32 text-center">
            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-10">
              <h2 className="font-[Epilogue] text-6xl lg:text-8xl tracking-[-0.07em] lowercase leading-[0.9] mb-12">
                begin your
                <br />
                first ritual.
              </h2>

              <Link to="/signin">
                <Button
                  variant="secondary"
                  className="mx-auto px-10 sm:px-14 py-5 sm:py-6 uppercase tracking-[0.24em] text-[10px]"
                >
                  Join The Collective
                  <ArrowRight size={16} />
                </Button>
              </Link>

              <p className="mt-10 uppercase tracking-[0.25em] text-[10px] opacity-50">
                limited invites released weekly
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

export default LandingPage;
