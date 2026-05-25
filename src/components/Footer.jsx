import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface-dim px-5 pb-10 pt-16 sm:px-8 sm:pt-28 lg:px-20">
   

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP */}
        <div className="grid grid-cols-2 gap-8 mb-14 sm:gap-12 md:grid-cols-4 sm:mb-28 md:gap-20">
          {/* BRAND */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/">
              <h2 className="font-heading mb-4 text-3xl lowercase tracking-[-0.06em] text-text-primary sm:mb-8 sm:text-5xl">
                habitflow
              </h2>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-text-muted sm:text-lg">
              The premium editorial tracking experience for rhythmic living.
              Designed for intentional people seeking clarity, stillness, and
              consistency.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="app-label mb-4 sm:mb-8">
              Navigation
            </p>

            <div className="flex flex-col gap-5">
              <Link
                to="/"
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Manifesto
              </Link>

              <Link
                to="/"
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                The Ritual
              </Link>

              <Link
                to="/"
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Journal Spread
              </Link>
            </div>
          </div>

          {/* STUDIO */}
          <div>
            <p className="app-label mb-4 sm:mb-8">
              Studio
            </p>

            <div className="flex flex-col gap-5">
              <a
                href="https://withmeteoric.vercel.app/about"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                About
                <ArrowUpRight size={14} />
              </a>

              <a
                href="https://linktr.ee/prashantkhuva"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Contact
                <ArrowUpRight size={14} />
              </a>

              <a
                href="https://github.com/Prashantkhuva/HABIT-TRACKER-FRONTEND"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                Github
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 sm:gap-6 sm:pt-8 md:flex-row">
          <p className="app-label">
            © 2026 HabitFlow Studio. All rights reserved.
          </p>

          <div className="flex items-center gap-10">
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
