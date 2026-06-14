"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  BarChart2,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../store/authSlice";
import { resetHabitState } from "../store/habitSlice";
import Button from "./Button";
import { logout } from "../api/auth-api";
import { isAdmin } from "../lib/admin";
import { motion } from "framer-motion";

const navItems = [
  { to: "/rituals", icon: Sparkles, label: "RITUALS" },
  { to: "/dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
  { to: "/statistics", icon: BarChart2, label: "STATISTICS" },
  { to: "/blog", icon: BookOpen, label: "BLOG" },
  { to: "/settings", icon: Settings, label: "SETTINGS" },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try { await logout(); } catch (err) { console.error("[Sidebar] Logout failed:", err); }
    dispatch(resetHabitState());
    dispatch(signout());
    window.location.href = "/";
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-border-subtle/60 bg-surface/90 backdrop-blur-xl lg:flex"
    >
      <div className="flex flex-col px-6 pb-6 pt-8">
        <Link href="/dashboard" prefetch={true}>
          <h1 className="font-heading text-3xl font-bold lowercase tracking-[-0.06em] text-text-primary">
            habitflow
          </h1>
        </Link>
        <p className="app-label mt-1.5">editorial tracking</p>
      </div>

      <div className="px-4 mb-6">
        <Button
          onClick={() => router.push("/create-habit")}
          className="w-full py-3.5 text-[11px] font-bold"
        >
          <Plus size={15} />
          NEW RITUAL
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ to, icon: Icon, label }, i) => {
          const isActive = pathname === to || pathname === to + "/" || (to !== "/" && pathname.startsWith(to + "/"));
          return (
            <Link key={to} href={to} prefetch={true}>
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-300 ${
                  isActive
                    ? "bg-accent-mint/10 text-accent-mint font-semibold"
                    : "text-text-muted hover:bg-surface-dim hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-accent-mint" />
                )}
                <Icon size={18} className="shrink-0" />
                <span className="text-[11px] font-bold tracking-[0.15em]">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-border-subtle/40 px-3 pb-8 pt-4">
        {isAdmin(user) && (
          <Link href="/blog-admin" prefetch={true}>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-text-muted transition-all duration-200 hover:bg-surface-dim hover:text-text-primary">
              <FileText size={18} className="shrink-0" />
              <span className="text-[11px] font-bold tracking-[0.15em]">BLOG ADMIN</span>
            </div>
          </Link>
        )}

        <Link href="/help" prefetch={true}>
          <div className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-text-muted transition-all duration-200 hover:bg-surface-dim hover:text-text-primary">
            <HelpCircle size={18} className="shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.15em]">HELP</span>
          </div>
        </Link>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-text-muted transition-all duration-200 hover:bg-danger-soft hover:text-danger"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="text-[11px] font-bold tracking-[0.15em]">SIGN OUT</span>
        </button>
      </div>
    </motion.aside>
  );
}
