"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Flame, Star, Sparkles, X, ChevronRight } from "lucide-react";

const notifications = [
  {
    id: 1,
    icon: Flame,
    color: "#D4BB06",
    title: "3-day streak!",
    message: "You're building momentum. Keep going.",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: Sparkles,
    color: "#4B6B63",
    title: "Evening ritual reminder",
    message: "You haven't completed your evening habits yet.",
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: Star,
    color: "#8069bf",
    title: "Weekly summary available",
    message: "Check your stats to see how this week went.",
    time: "1 day ago",
  },
];

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
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-white">
          {notifications.length}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-3 w-[340px] sm:w-[380px] overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border-subtle/50 px-5 py-4">
              <h3 className="font-heading text-sm font-bold tracking-[-0.03em] text-text-primary">
                notifications
              </h3>
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary transition-colors">
                <X size={14} />
              </button>
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-start gap-3 border-b border-border-subtle/30 px-5 py-4 transition-colors hover:bg-surface-dim/50 cursor-pointer"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: n.color + "18" }}>
                    <n.icon size={16} style={{ color: n.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text-primary">{n.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">{n.message}</p>
                    <p className="mt-1 text-[9px] font-medium tracking-wide text-text-muted/60">{n.time}</p>
                  </div>

                  <ChevronRight size={14} className="mt-2 shrink-0 text-text-muted/30 opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border-subtle/50 px-5 py-3 text-center">
              <button className="text-[10px] font-bold tracking-[0.15em] uppercase text-text-muted hover:text-text-primary transition-colors">
                view all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
