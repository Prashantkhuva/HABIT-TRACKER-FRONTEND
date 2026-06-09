"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Philosophy", href: "#philosophy" },
];


const FULL_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Archive", href: "#archive" },
  { label: "Philosophy", href: "#philosophy" },
];

function scrollToSection(href) {
  const target = document.querySelector(href);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}

function LandNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-[#FAFAF5]/90 dark:bg-[#141218]/90 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-20 py-2.5 sm:py-3">
          <Link href={"/"} className="group inline-flex flex-col">
            <span className="font-[Epilogue] text-lg sm:text-xl md:text-2xl lowercase tracking-[-0.06em] leading-none text-[#1A1A1A] dark:text-[#E6E1E5]">
              habitflow
            </span>
            <span className="mt-0.5 hidden sm:block uppercase tracking-[0.25em] text-[8px] text-[#555555] dark:text-[#938F99] group-hover:text-[#1A1A1A] dark:group-hover:text-[#E6E1E5] transition-colors">
              Editorial Rituals
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {NAV_LINKS.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(link.href);
                  }}
                  className="relative text-[7px] uppercase tracking-[0.28em] text-[#555555] dark:text-[#938F99] transition-colors hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-[7px] uppercase tracking-[0.28em] text-[#555555] dark:text-[#938F99] transition-colors hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/signin"
              className="hidden sm:inline-flex uppercase tracking-[0.22em] text-[8px] text-[#555555] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center gap-1.5 uppercase tracking-[0.22em] text-[8px] bg-[#1A1A1A] dark:bg-[#D0BCFF] text-white dark:text-[#1A1A1A] rounded-full px-4 py-2 hover:opacity-80 transition-opacity"
            >
              Begin
              <ArrowRight size={10} strokeWidth={2} />
            </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            key="mobile-menu-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-[300px] sm:w-[360px] bg-[#FAFAF5] dark:bg-[#141218] border-l border-black/10 dark:border-white/10 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 dark:border-white/10">
              <span className="font-[Epilogue] text-lg lowercase tracking-[-0.06em] leading-none text-[#1A1A1A] dark:text-[#E6E1E5]">
                habitflow
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Close menu"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-8">
              <div className="space-y-2">
                {FULL_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {link.href.startsWith("#") ? (
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setMenuOpen(false);
                          setTimeout(() => scrollToSection(link.href), 250);
                        }}
                        className="block font-[Epilogue] text-[clamp(1.3rem,4vw,2rem)] lowercase tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5] py-2 hover:opacity-50 transition-opacity"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="block font-[Epilogue] text-[clamp(1.3rem,4vw,2rem)] lowercase tracking-[-0.04em] text-[#1A1A1A] dark:text-[#E6E1E5] py-2 hover:opacity-50 transition-opacity"
                      >
                        {link.label}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-6 py-6 border-t border-black/10 dark:border-white/10 space-y-3">
              <Link
                href="/signup"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between w-full uppercase tracking-[0.22em] text-[9px] bg-[#1A1A1A] dark:bg-[#D0BCFwF] text-white dark:text-[#1A1A1A] rounded-full px-6 py-3 hover:opacity-80 transition-opacity"
              >
                Begin the ritual
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
              <Link
                href="/signin"
                onClick={() => setMenuOpen(false)}
                className="block text-center uppercase tracking-[0.22em] text-[8px] text-[#555555] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors py-1"
              >
                Sign In
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export default LandNav;
