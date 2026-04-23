import { nav } from "framer-motion/client";
import React from "react";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import LandNav from "../components/LandNav";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function LandingPage() {
  return (
    <>
      {/* Nav */}
      <LandNav />

      {/* Main */}
      <div
        className="min-h-screen p-0"
        style={{
          background: "#FAFAF5",
          fontFamily: "Manrope, sans-serif",
          color: "#1A1A1A",
        }}
      >
        {/* ── HERO ── */}
        <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-16 px-8 lg:px-24 items-center">
          {/* LEFT */}
          <div className="max-w-130">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="text-[11px] tracking-[0.25em] mb-6 text-[#9A9A8A]"
            >
              THE EDITORIAL TRACKER
            </motion.p>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="text-[64px] leading-[1.05] tracking-[-0.04em] mb-6"
              style={{ fontFamily: "Epilogue, sans-serif" }}
            >
              build habits
              <br />
              that stick
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="text-[15px] leading-relaxed mb-10 max-w-90 text-[#6A6A5A]"
            >
              Designed for the intentional individual. A rhythmic workspace to
              cultivate your daily rituals with clarity and editorial elegance.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="flex items-center gap-4"
            >
              <Link to={"/signin"}>
                <Button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full text-sm">
                  GET STARTED
                </Button>
              </Link>

              <Button variant="outline" className="">
                WATCH STORY
              </Button>
            </motion.div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center">
            {/* Glow */}
            <div className="absolute right-0 top-10 w-105 h-105 bg-[#E8D9A8] rounded-full blur-[140px] opacity-40" />

            {/* Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="relative bg-white rounded-[40px] border border-[#E8E4DC] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10 w-130 h-165 flex flex-col justify-start"
            >
              {/* Header */}
              <div className="flex justify-between items-center text-sm tracking-widest text-[#9A9A8A] mb-8">
                <span>monday ritual</span>
                <svg width="18" height="4" viewBox="0 0 16 4" fill="none">
                  {" "}
                  <path
                    d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4ZM8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4ZM14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4Z"
                    fill="#1A1C19"
                  />{" "}
                </svg>
              </div>

              {/* Habit */}
              <div className="flex items-center gap-4 mb-10">
                {/* Circle + Icon */}
                <div className="w-14 h-14 rounded-full bg-[#C8E6DF] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path
                      d="M18 8L16.75 5.25L14 4L16.75 2.75L18 0L19.25 2.75L22 4L19.25 5.25L18 8ZM18 22L16.75 19.25L14 18L16.75 16.75L18 14L19.25 16.75L22 18L19.25 19.25L18 22ZM8 19L5.5 13.5L0 11L5.5 8.5L8 3L10.5 8.5L16 11L10.5 13.5L8 19ZM8 14.15L9 12L11.15 11L9 10L8 7.85L7 10L4.85 11L7 12L8 14.15Z"
                      fill="#4D6863"
                    />
                  </svg>
                </div>

                {/* Text */}
                <div>
                  <p
                    className="text-[22px] font-medium tracking-tight"
                    style={{ fontFamily: "Epilogue, sans-serif" }}
                  >
                    morning meditation
                  </p>
                  <p className="text-xs tracking-widest text-[#9A9A8A]">
                    20 MINS • STREAK 14
                  </p>
                </div>
              </div>
              {/* Dots */}
              <div className="flex items-center gap-4 mb-10">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <div
                    key={d}
                    className="w-12 h-12 rounded-full"
                    style={{
                      background:
                        d <= 5 ? "#4B6B63" : d === 6 ? "#FAFAF5" : "#E8E4DC",
                      border: d === 6 ? "2px solid #4B6B63" : "none",
                    }}
                  />
                ))}
              </div>

              {/* Chart */}
              <div className="bg-[#F5F0E8] rounded-3xl p-5">
                <p className="text-xs tracking-widest text-[#9A9A8A] mb-3">
                  WEEKLY FLOW
                </p>

                <div className="flex items-end gap-2 h-28">
                  {[40, 55, 45, 70, 90, 65, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-lg"
                      style={{
                        height: `${h}%`,
                        background:
                          i === 4 ? "#4B6B63" : i === 5 ? "#C8E6DF" : "#D8D4CA",
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
          <div className="grid  grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg
                    width="33"
                    height="26"
                    viewBox="0 0 33 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 25.5C2.175 25.5 1.46875 25.2062 0.88125 24.6187C0.29375 24.0312 0 23.325 0 22.5C0 21.675 0.29375 20.9688 0.88125 20.3813C1.46875 19.7938 2.175 19.5 3 19.5C3.15 19.5 3.28125 19.5 3.39375 19.5C3.50625 19.5 3.625 19.525 3.75 19.575L10.575 12.75C10.525 12.625 10.5 12.5063 10.5 12.3938C10.5 12.2812 10.5 12.15 10.5 12C10.5 11.175 10.7938 10.4688 11.3813 9.88125C11.9688 9.29375 12.675 9 13.5 9C14.325 9 15.0312 9.29375 15.6187 9.88125C16.2062 10.4688 16.5 11.175 16.5 12C16.5 12.05 16.475 12.3 16.425 12.75L20.25 16.575C20.375 16.525 20.4938 16.5 20.6063 16.5C20.7188 16.5 20.85 16.5 21 16.5C21.15 16.5 21.2812 16.5 21.3937 16.5C21.5062 16.5 21.625 16.525 21.75 16.575L27.075 11.25C27.025 11.125 27 11.0063 27 10.8938C27 10.7812 27 10.65 27 10.5C27 9.675 27.2938 8.96875 27.8813 8.38125C28.4688 7.79375 29.175 7.5 30 7.5C30.825 7.5 31.5313 7.79375 32.1188 8.38125C32.7063 8.96875 33 9.675 33 10.5C33 11.325 32.7063 12.0312 32.1188 12.6187C31.5313 13.2062 30.825 13.5 30 13.5C29.85 13.5 29.7188 13.5 29.6063 13.5C29.4938 13.5 29.375 13.475 29.25 13.425L23.925 18.75C23.975 18.875 24 18.9938 24 19.1063C24 19.2188 24 19.35 24 19.5C24 20.325 23.7062 21.0312 23.1187 21.6187C22.5312 22.2062 21.825 22.5 21 22.5C20.175 22.5 19.4688 22.2062 18.8813 21.6187C18.2938 21.0312 18 20.325 18 19.5C18 19.35 18 19.2188 18 19.1063C18 18.9938 18.025 18.875 18.075 18.75L14.25 14.925C14.125 14.975 14.0063 15 13.8938 15C13.7812 15 13.65 15 13.5 15C13.45 15 13.2 14.975 12.75 14.925L5.925 21.75C5.975 21.875 6 21.9938 6 22.1063C6 22.2188 6 22.35 6 22.5C6 23.325 5.70625 24.0312 5.11875 24.6187C4.53125 25.2062 3.825 25.5 3 25.5ZM4.5 10.4625L3.5625 8.4375L1.5375 7.5L3.5625 6.5625L4.5 4.5375L5.4375 6.5625L7.4625 7.5L5.4375 8.4375L4.5 10.4625ZM21 9L19.575 5.925L16.5 4.5L19.575 3.075L21 0L22.425 3.075L25.5 4.5L22.425 5.925L21 9Z"
                      fill="black"
                    />
                  </svg>
                ),
                title: "track streaks",
                desc: "Visualize consistency through organic growth patterns and rhythmic momentum.",
                bg: "#F0EDE5",
                accent: "#1A1A1A",
              },
              {
                icon: (
                  <svg
                    width="30"
                    height="31"
                    viewBox="0 0 30 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 12.075C0 9.575 0.55625 7.28125 1.66875 5.19375C2.78125 3.10625 4.275 1.375 6.15 0L7.9125 2.4C6.4125 3.5 5.21875 4.8875 4.33125 6.5625C3.44375 8.2375 3 10.075 3 12.075H0ZM27 12.075C27 10.075 26.5563 8.2375 25.6688 6.5625C24.7812 4.8875 23.5875 3.5 22.0875 2.4L23.85 0C25.725 1.375 27.2188 3.10625 28.3312 5.19375C29.4437 7.28125 30 9.575 30 12.075H27ZM3 25.575V22.575H6V12.075C6 10 6.625 8.15625 7.875 6.54375C9.125 4.93125 10.75 3.875 12.75 3.375V2.325C12.75 1.7 12.9688 1.16875 13.4062 0.73125C13.8438 0.29375 14.375 0.075 15 0.075C15.625 0.075 16.1562 0.29375 16.5938 0.73125C17.0312 1.16875 17.25 1.7 17.25 2.325V3.375C19.25 3.875 20.875 4.93125 22.125 6.54375C23.375 8.15625 24 10 24 12.075V22.575H27V25.575H3ZM15 30.075C14.175 30.075 13.4688 29.7812 12.8813 29.1938C12.2938 28.6063 12 27.9 12 27.075H18C18 27.9 17.7062 28.6063 17.1187 29.1938C16.5312 29.7812 15.825 30.075 15 30.075ZM9 22.575H21V12.075C21 10.425 20.4125 9.0125 19.2375 7.8375C18.0625 6.6625 16.65 6.075 15 6.075C13.35 6.075 11.9375 6.6625 10.7625 7.8375C9.5875 9.0125 9 10.425 9 12.075V22.575Z"
                      fill="#4D6863"
                    />
                  </svg>
                ),
                title: "smart reminders",
                desc: "Gentle nudges synchronized with your biological clock and lifestyle flow.",
                bg: "#C8E6DF",
                accent: "#3D6B61",
              },
              {
                icon: (
                  <svg
                    width="33"
                    height="24"
                    viewBox="0 0 33 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19.5 8.85V6.3C20.325 5.95 21.1688 5.6875 22.0312 5.5125C22.8937 5.3375 23.8 5.25 24.75 5.25C25.4 5.25 26.0375 5.3 26.6625 5.4C27.2875 5.5 27.9 5.625 28.5 5.775V8.175C27.9 7.95 27.2937 7.78125 26.6812 7.66875C26.0688 7.55625 25.425 7.5 24.75 7.5C23.8 7.5 22.8875 7.61875 22.0125 7.85625C21.1375 8.09375 20.3 8.425 19.5 8.85ZM19.5 17.1V14.55C20.325 14.2 21.1688 13.9375 22.0312 13.7625C22.8937 13.5875 23.8 13.5 24.75 13.5C25.4 13.5 26.0375 13.55 26.6625 13.65C27.2875 13.75 27.9 13.875 28.5 14.025V16.425C27.9 16.2 27.2937 16.0312 26.6812 15.9187C26.0688 15.8062 25.425 15.75 24.75 15.75C23.8 15.75 22.8875 15.8625 22.0125 16.0875C21.1375 16.3125 20.3 16.65 19.5 17.1ZM19.5 12.975V10.425C20.325 10.075 21.1688 9.8125 22.0312 9.6375C22.8937 9.4625 23.8 9.375 24.75 9.375C25.4 9.375 26.0375 9.425 26.6625 9.525C27.2875 9.625 27.9 9.75 28.5 9.9V12.3C27.9 12.075 27.2937 11.9062 26.6812 11.7937C26.0688 11.6812 25.425 11.625 24.75 11.625C23.8 11.625 22.8875 11.7437 22.0125 11.9812C21.1375 12.2188 20.3 12.55 19.5 12.975ZM8.25 18C9.425 18 10.5687 18.1312 11.6812 18.3937C12.7937 18.6562 13.9 19.05 15 19.575V4.8C13.975 4.2 12.8875 3.75 11.7375 3.45C10.5875 3.15 9.425 3 8.25 3C7.35 3 6.45625 3.0875 5.56875 3.2625C4.68125 3.4375 3.825 3.7 3 4.05V18.9C3.875 18.6 4.74375 18.375 5.60625 18.225C6.46875 18.075 7.35 18 8.25 18ZM18 19.575C19.1 19.05 20.2063 18.6562 21.3188 18.3937C22.4312 18.1312 23.575 18 24.75 18C25.65 18 26.5312 18.075 27.3937 18.225C28.2562 18.375 29.125 18.6 30 18.9V4.05C29.175 3.7 28.3188 3.4375 27.4312 3.2625C26.5437 3.0875 25.65 3 24.75 3C23.575 3 22.4125 3.15 21.2625 3.45C20.1125 3.75 19.025 4.2 18 4.8V19.575ZM16.5 24C15.3 23.05 14 22.3125 12.6 21.7875C11.2 21.2625 9.75 21 8.25 21C7.2 21 6.16875 21.1375 5.15625 21.4125C4.14375 21.6875 3.175 22.075 2.25 22.575C1.725 22.85 1.21875 22.8375 0.73125 22.5375C0.24375 22.2375 0 21.8 0 21.225V3.15C0 2.875 0.06875 2.6125 0.20625 2.3625C0.34375 2.1125 0.55 1.925 0.825 1.8C1.975 1.2 3.175 0.75 4.425 0.45C5.675 0.15 6.95 0 8.25 0C9.7 0 11.1188 0.1875 12.5063 0.5625C13.8938 0.9375 15.225 1.5 16.5 2.25C17.775 1.5 19.1062 0.9375 20.4937 0.5625C21.8813 0.1875 23.3 0 24.75 0C26.05 0 27.325 0.15 28.575 0.45C29.825 0.75 31.025 1.2 32.175 1.8C32.45 1.925 32.6562 2.1125 32.7938 2.3625C32.9313 2.6125 33 2.875 33 3.15V21.225C33 21.8 32.7562 22.2375 32.2687 22.5375C31.7812 22.8375 31.275 22.85 30.75 22.575C29.825 22.075 28.8563 21.6875 27.8438 21.4125C26.8312 21.1375 25.8 21 24.75 21C23.25 21 21.8 21.2625 20.4 21.7875C19 22.3125 17.7 23.05 16.5 24Z"
                      fill="black"
                    />
                  </svg>
                ),
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
                className="h-87 rounded-[50px] p-8 flex flex-col justify-between"
                style={{ background: f.bg }}
              >
                <span className="text-2xl block">{f.icon}</span>
                <div>
                  <h3
                    className="text-2xl  font-medium mb-3"
                    style={{
                      fontFamily: "Epilogue, sans-serif",
                      color: f.accent,
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="text-md leading-relaxed"
                    style={{ color: "#6A6A5A" }}
                  >
                    {f.desc}
                  </p>
                </div>
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
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="border p-8 rounded-3xl"
            style={{ borderColor: "#1A1A1A" }}
          >
            <h2
              className="text-5xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "Epilogue, sans-serif",
                letterSpacing: "-0.04em",
              }}
            >
              designed for
              <br />
              quiet intention.
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: "#6A6A5A" }}
            >
              We believe habit tracking shouldn't feel like a chore. It should
              feel like writing in a premium journal—an act of self-care and
              artistic expression.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  title: "no clutter",
                  sub: "only what matters to your ritual.",
                },
                {
                  title: "tonal depth",
                  sub: "visual hierarchy through soft layers.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "#C8E6DF" }}
                  >
                    <span className="text-xs" style={{ color: "#3D6B61" }}>
                      ✓
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.title}</p>
                    <p className="text-xs" style={{ color: "#9A9A8A" }}>
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER ── */}
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
