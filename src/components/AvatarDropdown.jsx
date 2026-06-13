"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, FileText, Settings, LogOut, User } from "lucide-react";
import { signout } from "../store/authSlice";
import { resetHabitState } from "../store/habitSlice";
import { logout } from "../api/auth-api";
import { isAdmin } from "../lib/admin";

export default function AvatarDropdown() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    try { await logout(); } catch { /* silent */ }
    dispatch(resetHabitState());
    dispatch(signout());
    window.location.href = "/";
  };

  const items = [
    { label: "Blog", icon: BookOpen, href: "/blog" },
    ...(isAdmin(user) ? [{ label: "Blog Admin", icon: FileText, href: "/blog-admin" }] : []),
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div ref={ref} className="relative">
      <motion.button
        aria-label="User menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-soft text-sm font-bold text-background shadow-lg transition-shadow duration-200 hover:shadow-xl"
      >
        {user?.username?.charAt(0)?.toUpperCase() || "U"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-full mt-3 w-52 overflow-hidden rounded-2xl border border-border-subtle/60 bg-surface shadow-2xl"
          >
            <div className="border-b border-border-subtle/50 px-4 py-3">
              <p className="text-sm font-bold text-text-primary truncate">
                {user?.username || "User"}
              </p>
              <p className="mt-0.5 text-[10px] text-text-muted truncate">
                {user?.email || ""}
              </p>
            </div>

            <div className="py-1.5">
              {items.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] font-medium text-text-muted transition-colors hover:bg-surface-dim hover:text-text-primary"
                >
                  <item.icon size={15} strokeWidth={1.5} />
                  {item.label}
                </button>
              ))}
            </div>

            <div className="border-t border-border-subtle/50 py-1.5">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[12px] font-medium text-text-muted transition-colors hover:bg-danger-soft hover:text-danger"
              >
                <LogOut size={15} strokeWidth={1.5} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
