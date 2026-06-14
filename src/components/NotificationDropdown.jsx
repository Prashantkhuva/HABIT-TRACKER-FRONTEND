"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Construction } from "lucide-react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <motion.button
        aria-label="Notifications"
        whileHover={{ y: -1, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-border-subtle bg-surface p-2.5 text-text-muted hover:text-text-primary transition-colors"
      >
        <Bell size={18} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-3 w-[300px] sm:w-[340px] overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle/50 px-5 py-4">
              <h3 className="font-heading text-sm font-bold tracking-[-0.03em] text-text-primary">
                notifications
              </h3>
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 px-5 py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-mint/10">
                <Construction size={22} className="text-accent-mint" />
              </div>
              <p className="text-sm font-bold text-text-primary">Coming Soon</p>
              <p className="text-[11px] text-center leading-relaxed text-text-muted max-w-[220px]">
                Real-time notifications are on the way. Stay tuned for updates, reminders, and streak alerts.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
