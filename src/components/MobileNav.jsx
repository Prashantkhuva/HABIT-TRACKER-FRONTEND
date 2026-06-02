"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BarChart2,
  Settings,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/rituals", icon: Sparkles, label: "Rituals", short: "Rituals" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", short: "Home" },
  { to: "add", icon: Plus, label: "Add" },
  { to: "/statistics", icon: BarChart2, label: "Statistics", short: "Stats" },
  { to: "/settings", icon: Settings, label: "Settings", short: "Profile" },
];

export default function MobileNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 lg:hidden">
      <div
        className="relative mx-auto flex h-[68px] max-w-md items-center justify-around rounded-full border border-border-subtle/50 bg-[#FAFAF5]/90 dark:bg-[#141218]/90 px-3 shadow-[0_16px_40px_-16px_rgba(26,26,26,0.25)] backdrop-blur-xl"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/40" />

        {navItems.map(({ to, icon: Icon, label, short }) => {
          // Center Plus Button
          if (to === "add") {
            return (
              <div
                key="add"
                className="relative flex flex-1 items-center justify-center"
              >
                <motion.button
                  onClick={() => router.push("/create-habit")}
                  whileHover={{ y: -2, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute -top-5 flex h-13 w-13 items-center justify-center rounded-full border-[4px] border-[#FAFAF5] dark:border-[#141218] bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A] shadow-[0_10px_20px_-6px_rgba(26,26,26,0.4)]"
                  aria-label="Create ritual"
                >
                  <Plus size={22} strokeWidth={2.5} />
                </motion.button>
              </div>
            );
          }

          return (
            <Link key={to} href={to} prefetch={false} className="flex flex-1 justify-center z-10">
              <motion.div
                whileTap={{ scale: 0.94 }}
                className={`relative flex h-12 w-full max-w-[72px] flex-col items-center justify-center gap-0.5 rounded-full transition-colors duration-200 ${
                  pathname === to ? "text-text-primary font-bold" : "text-text-muted hover:text-text-primary"
                }`}
              >
                {pathname === to && (
                  <motion.span
                    layoutId="mobileActivePill"
                    className="absolute inset-0 rounded-full bg-white dark:bg-[#1D1B20] border border-border-subtle/30 shadow-[0_4px_12px_rgba(0,0,0,0.03)] z-0"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <Icon className="relative z-10" size={17} strokeWidth={pathname === to ? 2.2 : 1.8} />
                <span className="relative z-10 text-[8.5px] font-bold uppercase tracking-[0.14em] scale-95 sm:scale-100">
                  {short}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
