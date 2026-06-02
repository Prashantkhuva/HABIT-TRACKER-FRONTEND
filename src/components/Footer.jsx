"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface-dim px-5 pb-8 pt-12 sm:px-8 sm:pt-20 lg:px-20">

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP */}
        <div className="grid grid-cols-2 gap-6 mb-10 sm:gap-10 md:grid-cols-4 sm:mb-20 md:gap-16">
          {/* BRAND */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/">
              <h2 className="font-heading mb-3 text-2xl lowercase tracking-[-0.06em] text-text-primary sm:mb-6 sm:text-4xl">
                habitflow
              </h2>
            </Link>

            <p className="max-w-md text-[13px] leading-[1.7] text-text-muted sm:text-[15px]">
              The premium editorial tracking experience for rhythmic living.
              Designed for intentional people seeking clarity, stillness, and
              consistency.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="app-label mb-4 sm:mb-6">
              Navigation
            </p>

            <div className="flex flex-col gap-3.5">
              <Link
                href="/"
                className="text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                Manifesto
              </Link>

              <Link
                href="/"
                className="text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                The Ritual
              </Link>

              <Link
                href="/"
                className="text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                Journal Spread
              </Link>
            </div>
          </div>

          {/* STUDIO */}
          <div>
            <p className="app-label mb-4 sm:mb-6">
              Studio
            </p>

            <div className="flex flex-col gap-3.5">
              <a
                href="https://withmeteoric.vercel.app/about"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                About
                <ArrowUpRight size={12} />
              </a>

              <a
                href="https://linktr.ee/prashantkhuva"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                Contact
                <ArrowUpRight size={12} />
              </a>

              <a
                href="https://github.com/Prashantkhuva/HABIT-TRACKER-FRONTEND"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary"
              >
                Github
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle pt-5 sm:gap-4 sm:pt-6 md:flex-row">
          <p className="app-label">
            &copy; 2026 HabitFlow Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-8">
            <a
              href="https://www.instagram.com/prashant.khuva/"
              target="_blank"
              rel="noreferrer"
              className="app-label transition-colors hover:text-text-primary"
            >
              Instagram
            </a>

            <a
              href="https://x.com/prashantkhuva_"
              target="_blank"
              rel="noreferrer"
              className="app-label transition-colors hover:text-text-primary"
            >
              Twitter
            </a>
          </div>

          <p className="app-label">
            made with quiet intention
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
