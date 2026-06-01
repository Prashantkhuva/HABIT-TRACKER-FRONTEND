import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

function LandNav() {
  const navLinks = [
    { label: "HOW IT WORKS", href: "#how-it-works" },
    { label: "FEATURES", href: "#features" },
    { label: "ARCHIVE", href: "#archive" },
    { label: "PHILOSOPHY", href: "#philosophy" },
  ];

  const handleNavClick = (event, href) => {
    event.preventDefault();

    const target = document.querySelector(href);

    if (!target) return;

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", href);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-[#FAFAF5]/90 dark:bg-[#141218]/90 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-20 py-2.5 sm:py-3">
        {/* Logo */}
        <Link to={"/"} className="group inline-flex flex-col">
          <span className="font-[Epilogue] text-lg sm:text-xl md:text-2xl lowercase tracking-[-0.06em] leading-none text-[#1A1A1A] dark:text-[#E6E1E5]">
            habitflow
          </span>
          <span className="mt-0.5 hidden sm:block uppercase tracking-[0.25em] text-[8px] text-[#7A7A7A] dark:text-[#938F99] group-hover:text-[#1A1A1A] dark:group-hover:text-[#E6E1E5] transition-colors">
            Editorial Rituals
          </span>
        </Link>

        {/* Nav Links - Desktop Only */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.2, duration: 0.45 }}
              className="relative text-[8px] uppercase tracking-[0.25em] text-[#6F6F6F] dark:text-[#938F99] transition-colors hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full"
            >
              {link.label}
            </motion.a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/signin"
            className="hidden sm:inline-flex uppercase tracking-[0.22em] text-[8px] text-[#6F6F6F] dark:text-[#938F99] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5] transition-colors"
          >
            Sign In
          </Link>

          <Link to="/signin">
            <Button className="uppercase">
              Begin
              <ArrowRight size={12} />
            </Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

export default LandNav;
