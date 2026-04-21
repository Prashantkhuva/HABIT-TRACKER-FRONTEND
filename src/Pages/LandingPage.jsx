import { nav } from 'framer-motion/client'
import React from 'react'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const navLinks = ["PHILOSOPHY", "FEATURES", "JOURNAL"]

function Content() {
  return (
    <>

      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-between px-10 py-5 sticky top-0 z-50"
        style={{ background: "#FAFAF5", borderBottom: "1px solid #E8E4DC" }}
      >
        {/* Logo */}
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}
        >
          habitflow
        </h1>

        {/* Nav Links */}
        <div className="flex items-center gap-10">
          {navLinks.map((link, i) => (
            <motion.a
              key={link}
              href="#"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
              whileHover={{ color: "#1A1A1A" }}
              className="text-xs tracking-widest transition-colors"
              style={{ fontFamily: "Manrope, sans-serif", color: "#1A1C19" }}
            >
              {link}
            </motion.a>
          ))}
        </div>

        {/* Right — Bell + Upgrade */}
        <div className="flex items-center gap-5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full transition-all"
            style={{ background: "#F0EDE5" }}
          >
            <Bell size={16} color="#1A1A1A" />
          </motion.button>

          <motion.button
            whileHover={{ opacity: 0.8, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-full text-xs font-thin tracking-widest"
            style={{ background: "#1A1A1A", color: "#FFFFFF", fontFamily: "Manrope, sans-serif" }}
          >
            UPGRADE
          </motion.button>
        </div>
      </motion.nav>

      {/* Main */}
      <div
        className="min-h-screen p-0"
        style={{ background: "#FAFAF5", fontFamily: "Manrope, sans-serif", color: "#1A1A1A" }}
      >
        {/* ── HERO ── */}
        <section className="min-h-[92vh] grid grid-cols-1 lg:grid-cols-2 gap-10 px-6 lg:px-18 pt-14 pb-10 items-center">

          {/* Left */}
          <div className="max-w-xl"> {/* 👈 control width */}

            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="text-xs tracking-widest mb-5"
              style={{ color: "#9A9A8A" }}
            >
              THE EDITORIAL TRACKER
            </motion.p>

            <motion.h1
              variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Epilogue, sans-serif", letterSpacing: "-0.04em" }}
            >
              build habits<br />that stick
            </motion.h1>

            <motion.p
              variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="text-base leading-relaxed mb-8 max-w-sm"
              style={{ color: "#6A6A5A" }}
            >
              Designed for the intentional individual. A rhythmic workspace to
              cultivate your daily rituals with clarity and editorial elegance.
            </motion.p>

            <motion.div
              variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex items-center gap-4"
            >
              <button
                className="px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all hover:opacity-80"
                style={{ background: "#1A1A1A", color: "#FAFAF5" }}
              >
                GET STARTED
              </button>

              <button
                className="px-6 py-3 rounded-full text-sm font-medium tracking-wide border transition-all hover:bg-black/5"
                style={{ border: "1.5px solid #1A1A1A", color: "#1A1A1A" }}
              >
                WATCH STORY
              </button>
            </motion.div>
          </div>

          {/* Right — App Preview Card */}
          <div className="relative flex justify-center lg:justify-center items-center -mt-6">

            {/* Glow (thoda adjust) */}
            <div className="absolute right-0 lg:right-10 top-0 w-95 h-95 bg-[#E8D9A8] rounded-full blur-[140px] opacity-50"></div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="relative w-120 h-100 bg-white rounded-[40px] border border-[#E8E4DC] shadow-xl p-8 mx-auto"
            >

              {/* Header */}
              <div className="flex justify-between text-sm text-[#9A9A8A] mb-6">
                <span>monday ritual</span>
                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4ZM8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4ZM14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4Z" fill="#1A1C19" />
                </svg>

              </div>

              {/* Habit Row */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#C8E6DF]">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z" fill="#4D6863" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold">morning meditation</p>
                  <p className="text-sm text-[#9A9A8A]">20 MINS • STREAK 14</p>
                </div>
              </div>

              {/* Dots */}
              <div className="flex items-center gap-3 mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <div
                    key={d}
                    className="w-10 h-10 rounded-full"
                    style={{
                      background: d <= 5 ? "#4B6B63" : d === 6 ? "#FAFAF5" : "#E8E4DC",
                      border: d === 6 ? "2px solid #4B6B63" : "none"
                    }}
                  />
                ))}
              </div>

              {/* Chart */}
              <div className="bg-[#F5F0E8] rounded-2xl p-5">
                <p className="text-sm text-[#9A9A8A] mb-3">WEEKLY FLOW</p>

                <div className="flex items-end gap-2 h-24">
                  {[40, 55, 45, 70, 90, 65, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-lg"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 4 ? "#4B6B63" :
                            i === 5 ? "#C8E6DF" :
                              "#D8D4CA"
                      }}
                    />
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="px-8 lg:px-20 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "↗",
                title: "track streaks",
                desc: "Visualize consistency through organic growth patterns and rhythmic momentum.",
                bg: "#F0EDE5",
                accent: "#1A1A1A",
              },
              {
                icon: "🔔",
                title: "smart reminders",
                desc: "Gentle nudges synchronized with your biological clock and lifestyle flow.",
                bg: "#C8E6DF",
                accent: "#3D6B61",
              },
              {
                icon: "📖",
                title: "visual history",
                desc: "A digital broadsheet of your progress, curated as an editorial journey.",
                bg: "#E8E4DC",
                accent: "#1A1A1A",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="rounded-3xl p-8"
                style={{ background: f.bg }}
              >
                <span className="text-2xl mb-8 block">{f.icon}</span>
                <h3
                  className="text-2xl font-bold mb-3"
                  style={{ fontFamily: "Epilogue, sans-serif", color: f.accent }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6A6A5A" }}>
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── PHILOSOPHY ── */}
        <section className="px-8 lg:px-20 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-4xl overflow-hidden bg-[#1A1A1A] flex items-center justify-center h-65 sm:h-80 lg:h-95"
          >
            <img
              src="/meditation.png"
              alt="Meditation illustration"
              className="w-[80%] max-w-105 h-auto object-contain opacity-80"
            />
          </motion.div>

          {/* Right — Text */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="border p-8 rounded-3xl"
            style={{ borderColor: "#1A1A1A" }}
          >
            <h2
              className="text-5xl font-bold leading-tight mb-6"
              style={{ fontFamily: "Epilogue, sans-serif", letterSpacing: "-0.04em" }}
            >
              designed for<br />quiet intention.
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: "#6A6A5A" }}>
              We believe habit tracking shouldn't feel like a chore. It should feel
              like writing in a premium journal—an act of self-care and artistic
              expression.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { title: "no clutter", sub: "only what matters to your ritual." },
                { title: "tonal depth", sub: "visual hierarchy through soft layers." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "#C8E6DF" }}
                  >
                    <span className="text-xs" style={{ color: "#3D6B61" }}>✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs" style={{ color: "#9A9A8A" }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="px-8 lg:px-20 py-12 border-t"
          style={{ borderColor: "#E8E4DC" }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            <div>
              <h3
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "Epilogue, sans-serif" }}
              >
                habitflow
              </h3>
              <p className="text-xs tracking-widest" style={{ color: "#9A9A8A" }}>
                The premium editorial tracking experience for rhythmic living.
              </p>
            </div>
            <div className="flex gap-12 text-sm" style={{ color: "#6A6A5A" }}>
              <div className="flex flex-col gap-2">
                <p className="text-xs tracking-widest font-bold" style={{ color: "#1A1A1A" }}>PRODUCT</p>
                <span>Features</span>
                <span>Premium</span>
                <span>Journal</span>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs tracking-widest font-bold" style={{ color: "#1A1A1A" }}>COMPANY</p>
                <span>About</span>
                <span>Privacy</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
          <div
            className="mt-10 pt-6 border-t flex justify-between text-xs"
            style={{ borderColor: "#E8E4DC", color: "#9A9A8A" }}
          >
            <span>© 2024 HABITFLOW STUDIO. ALL RIGHTS RESERVED.</span>
            <span>MADE WITH INTENTION</span>
          </div>
        </footer>
      </div>

    </>
  )
}

export default Content
