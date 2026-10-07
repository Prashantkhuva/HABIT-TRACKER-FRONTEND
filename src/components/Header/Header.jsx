"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";
import NotificationDropdown from "../NotificationDropdown";
import AvatarDropdown from "../AvatarDropdown";
import { OPEN_PALETTE_EVENT } from "../CommandPalette";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function Header() {
  const user = useSelector((state) => state.auth.userData);

  const openPalette = () =>
    window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 h-16 w-full border-b border-border-subtle/50 bg-background/80 backdrop-blur-2xl lg:h-20"
    >
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between gap-4 px-5 lg:px-10">
        <div className="min-w-0">
          <h1 className="truncate font-heading text-lg font-semibold tracking-[-0.03em] text-text-primary sm:text-xl lg:text-2xl">
            {getGreeting()}
            {user?.username && (
              <span className="text-accent-mint">, {user.username}</span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search (Ctrl+K)"
            className="group flex items-center gap-2 rounded-full border border-border-subtle/60 bg-surface px-3 py-2 text-text-muted transition-all hover:border-accent-mint/40 hover:text-text-primary sm:px-4 sm:py-2.5"
          >
            <Search size={15} />
            <span className="hidden text-xs font-medium md:inline">
              Search rituals &amp; pages
            </span>
            <kbd className="hidden rounded-md border border-border-subtle bg-surface-dim px-1.5 py-0.5 text-[10px] font-bold text-text-muted md:inline">
              Ctrl K
            </kbd>
          </button>
          <NotificationDropdown />
          <AvatarDropdown />
        </div>
      </div>
    </motion.header>
  );
}

export default Header;
