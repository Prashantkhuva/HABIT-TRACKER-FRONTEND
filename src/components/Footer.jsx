import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border-subtle bg-surface-dim px-8 pb-10 pt-28 lg:px-20">
      {/* GRAIN */}
      <div
        className="
        absolute inset-0
        bg-[url('/grain.png')]
        opacity-[0.035]
        pointer-events-none
      "
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-28">
          {/* BRAND */}
          <div className="md:col-span-2">
            <Link to="/">
              <h2 className="font-heading mb-8 text-5xl lowercase tracking-[-0.06em] text-text-primary">
                habitflow
              </h2>
            </Link>

            <p className="max-w-md text-lg leading-relaxed text-text-muted">
              The premium editorial tracking experience for rhythmic living.
              Designed for intentional people seeking clarity, stillness, and
              consistency.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <p className="app-label mb-8">
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
            <p className="app-label mb-8">
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
        <div className="flex flex-col items-center justify-between gap-6 border-t border-border-subtle pt-8 md:flex-row">
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
