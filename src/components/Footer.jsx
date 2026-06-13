"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: footerRef.current, start: "top 90%" } }
      );
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden border-t border-border-subtle/60 bg-surface-dim px-5 pb-8 pt-12 sm:px-8 sm:pt-20 lg:px-20">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-8 mb-10 sm:gap-12 md:grid-cols-4 sm:mb-20 md:gap-16">
          <div className="col-span-2 md:col-span-2">
            <Link href="/">
              <h2 className="font-heading mb-3 text-2xl lowercase tracking-[-0.06em] text-text-primary sm:mb-6 sm:text-4xl">
                habitflow
              </h2>
            </Link>
            <p className="max-w-md text-[13px] leading-relaxed text-text-muted sm:text-[15px]">
              The premium editorial tracking experience for rhythmic living.
              Designed for intentional people seeking clarity, stillness, and consistency.
            </p>
          </div>

          <div>
            <p className="app-label mb-4 sm:mb-6">Navigation</p>
            <div className="flex flex-col gap-3.5">
              <Link href="/blog" className="text-[13px] text-text-muted transition-colors hover:text-text-primary">The Journal</Link>
              <Link href="/" className="text-[13px] text-text-muted transition-colors hover:text-text-primary">The Ritual</Link>
              <Link href="/" className="text-[13px] text-text-muted transition-colors hover:text-text-primary">Philosophy</Link>
            </div>
          </div>

          <div>
            <p className="app-label mb-4 sm:mb-6">Studio</p>
            <div className="flex flex-col gap-3.5">
              <a href="https://withmeteoric.vercel.app/about" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary">
                About <ArrowUpRight size={12} />
              </a>
              <a href="https://linktr.ee/prashantkhuva" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary">
                Contact <ArrowUpRight size={12} />
              </a>
              <a href="https://github.com/Prashantkhuva/HABIT-TRACKER-FRONTEND" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13px] text-text-muted transition-colors hover:text-text-primary">
                Github <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border-subtle/50 pt-5 sm:gap-4 sm:pt-6 md:flex-row">
          <p className="app-label">&copy; 2026 HabitFlow Studio. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="https://www.instagram.com/prashant.khuva/" target="_blank" rel="noreferrer" className="app-label transition-colors hover:text-text-primary">Instagram</a>
            <a href="https://x.com/prashantkhuva_" target="_blank" rel="noreferrer" className="app-label transition-colors hover:text-text-primary">Twitter</a>
          </div>
          <p className="app-label">made with quiet intention</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
