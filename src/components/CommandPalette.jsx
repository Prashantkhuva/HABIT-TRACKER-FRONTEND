"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  Sparkles,
  BarChart2,
  BookOpen,
  Settings,
  HelpCircle,
  Plus,
  CornerDownLeft,
  FileText,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const PAGE_ITEMS = [
  {
    id: "p-dash",
    label: "Dashboard",
    hint: "Daily overview",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "p-rit",
    label: "Rituals",
    hint: "All habits",
    icon: Sparkles,
    href: "/rituals",
  },
  {
    id: "p-stat",
    label: "Statistics",
    hint: "Charts & insights",
    icon: BarChart2,
    href: "/statistics",
  },
  {
    id: "p-blog",
    label: "Blog",
    hint: "Reading list",
    icon: BookOpen,
    href: "/blog",
  },
  {
    id: "p-set",
    label: "Settings",
    hint: "Profile & appearance",
    icon: Settings,
    href: "/settings",
  },
  {
    id: "p-help",
    label: "Help center",
    hint: "FAQ & shortcuts",
    icon: HelpCircle,
    href: "/help",
  },
];

const G_KEYS = [
  { key: "d", href: "/dashboard", label: "Dashboard" },
  { key: "r", href: "/rituals", label: "Rituals" },
  { key: "s", href: "/statistics", label: "Statistics" },
  { key: "b", href: "/blog", label: "Blog" },
  { key: "h", href: "/help", label: "Help" },
];

export const OPEN_PALETTE_EVENT = "habitflow:open-palette";

export default function CommandPalette() {
  const router = useRouter();
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habit.habits);
  const { theme, setTheme } = useTheme();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const gPressedAt = useRef(0);

  const items = useMemo(() => {
    const habitItems = (habits || []).map((h) => ({
      id: `h-${h._id}`,
      label: h.title || "Untitled ritual",
      hint: "Ritual",
      icon: Sparkles,
      href: `/rituals/${h._id}`,
    }));
    const actionItems = [
      {
        id: "a-new",
        label: "Create new ritual",
        hint: "Action",
        icon: Plus,
        run: () => router.push("/create-habit"),
      },
      {
        id: "a-theme",
        label:
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        hint: "Action",
        icon: Settings,
        run: () => setTheme(theme === "dark" ? "light" : "dark"),
      },
    ];
    return [...PAGE_ITEMS, ...habitItems, ...actionItems];
  }, [habits, theme, router, setTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.label.toLowerCase().includes(q) ||
        (i.hint || "").toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => setActive(0), [query]);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
  }, []);

  useEffect(() => {
    const onOpen = () => openPalette();
    window.addEventListener(OPEN_PALETTE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PALETTE_EVENT, onOpen);
  }, [openPalette]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const runItem = useCallback(
    (item) => {
      if (!item) return;
      setOpen(false);
      if (item.run) item.run();
      else if (item.href) router.push(item.href);
    },
    [router],
  );

  useEffect(() => {
    const isTyping =
      document.activeElement &&
      ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !isTyping && !open) {
        e.preventDefault();
        openPalette();
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      // G-then-key navigation (only when not typing, palette closed)
      if (!isTyping && !open) {
        const now = Date.now();
        if (e.key.toLowerCase() === "g") {
          gPressedAt.current = now;
          return;
        }
        if (now - gPressedAt.current < 1200) {
          const target = G_KEYS.find((k) => k.key === e.key.toLowerCase());
          if (target) {
            e.preventDefault();
            gPressedAt.current = 0;
            router.push(target.href);
            return;
          }
        }
        gPressedAt.current = 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, openPalette, router]);

  const onInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(filtered[active]);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: "nearest" });
  }, [active, filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-[8px]"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-[var(--r-lg)] border border-border-subtle/60 bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border-subtle/50 px-5 py-4">
              <Search size={16} className="shrink-0 text-text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search pages, rituals and actions..."
                className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted/70"
              />
              <kbd className="rounded-md border border-border-subtle bg-surface-dim px-1.5 py-0.5 text-[10px] font-bold text-text-muted">
                ESC
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-text-muted">
                  No results for “{query}”.
                </p>
              )}
              {filtered.map((item, i) => {
                const Icon = item.icon;
                const isActive = i === active;
                return (
                  <button
                    key={item.id}
                    data-active={isActive}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => runItem(item)}
                    className={`flex w-full items-center gap-3 rounded-[var(--r-sm)] px-3 py-2.5 text-left transition-colors duration-150 ${
                      isActive
                        ? "bg-accent-mint/10 text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    <Icon
                      size={15}
                      className={isActive ? "text-accent-mint" : ""}
                    />
                    <span className="flex-1 truncate text-sm font-semibold">
                      {item.label}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted/70">
                      {item.hint}
                    </span>
                    {isActive && (
                      <CornerDownLeft size={12} className="text-text-muted" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4 border-t border-border-subtle/50 bg-surface-dim/50 px-5 py-2.5 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>g d dashboard</span>
              <span>g r rituals</span>
              <span className="ml-auto hidden sm:inline">Ctrl K toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
