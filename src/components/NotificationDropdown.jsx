"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck, Flame, Target, CalendarDays } from "lucide-react";
import { useSelector } from "react-redux";
import { getDashboardStats } from "@/api/dashboard-api";

const READ_KEY = "habitflow-notif-read";

function readLastSeen() {
  try {
    return Number(localStorage.getItem(READ_KEY)) || 0;
  } catch {
    return 0;
  }
}

function buildNotifications(stats, habits) {
  const now = Date.now();
  const items = [];
  const total = stats?.totalHabits ?? habits?.length ?? 0;
  const done = stats?.completedToday ?? 0;
  const remaining = Math.max(total - done, 0);

  if (total > 0 && remaining > 0) {
    items.push({
      id: "daily-remaining",
      icon: Target,
      tone: "accent",
      title: `${remaining} ritual${remaining > 1 ? "s" : ""} left today`,
      body:
        done > 0
          ? `${done}/${total} done — keep the streak alive.`
          : "Start with one small ritual.",
      time: now,
    });
  }

  if (total > 0 && done >= total) {
    items.push({
      id: "perfect-day",
      icon: Flame,
      tone: "accent",
      title: "Perfect day",
      body: `All ${total} rituals completed. Tomorrow, again.`,
      time: now,
    });
  }

  if (stats?.longestStreak > 0) {
    items.push({
      id: `streak-${stats.longestStreak}`,
      icon: Flame,
      tone: "accent",
      title: `Longest streak: ${stats.longestStreak} days`,
      body: "Your strongest run so far. Protect it.",
      time: now - 3600_000,
    });
  }

  if (total > 0) {
    items.push({
      id: "week-summary",
      icon: CalendarDays,
      tone: "muted",
      title: "Weekly rhythm",
      body: `${total} active rituals tracked this week. Review your statistics.`,
      time: now - 7200_000,
    });
  }

  return items;
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [lastSeen, setLastSeen] = useState(0);
  const habits = useSelector((state) => state.habit.habits);
  const ref = useRef(null);

  const notifications = buildNotifications(stats, habits);
  const unread = notifications.filter((n) => n.time > lastSeen).length;

  useEffect(() => setLastSeen(readLastSeen()), []);

  const loadStats = useCallback(async () => {
    try {
      const res = await getDashboardStats();
      setStats(res?.data?.data ?? res?.data ?? null);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    if (open) loadStats();
  }, [open, loadStats]);

  const markAllRead = () => {
    const now = Date.now();
    try {
      localStorage.setItem(READ_KEY, String(now));
    } catch {
      // storage unavailable (private mode)
    }
    setLastSeen(now);
  };

  return (
    <div ref={ref} className="relative">
      <motion.button
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        whileHover={{ y: -1, scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full border border-border-subtle bg-surface p-2.5 text-text-muted transition-colors hover:text-text-primary"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-3 w-[300px] overflow-hidden rounded-[var(--r-md)] border border-border-subtle/60 bg-surface shadow-2xl sm:w-[340px]"
          >
            <div className="flex items-center justify-between border-b border-border-subtle/50 px-5 py-4">
              <h3 className="font-heading text-sm font-bold tracking-[-0.03em] text-text-primary">
                notifications
              </h3>
              <div className="flex items-center gap-3">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent-mint hover:underline"
                  >
                    <CheckCheck size={12} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-text-muted transition-colors hover:text-text-primary"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 && (
                <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-mint/10">
                    <Bell size={20} className="text-accent-mint" />
                  </div>
                  <p className="text-sm font-bold text-text-primary">
                    All clear
                  </p>
                  <p className="max-w-[220px] text-[11px] leading-relaxed text-text-muted">
                    Create your first ritual to start getting check-in
                    reminders.
                  </p>
                </div>
              )}

              {notifications.map((n) => {
                const Icon = n.icon;
                const isUnread = n.time > lastSeen;
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 border-b border-border-subtle/40 px-5 py-4 transition-colors last:border-0 hover:bg-surface-dim/60 ${
                      isUnread ? "bg-accent-mint/[0.04]" : ""
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        n.tone === "accent"
                          ? "bg-accent-mint/10 text-accent-mint"
                          : "bg-surface-dim text-text-muted"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-bold text-text-primary">
                          {n.title}
                        </p>
                        {isUnread && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-mint" />
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted">
                        {n.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
