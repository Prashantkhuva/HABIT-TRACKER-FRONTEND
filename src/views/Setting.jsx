"use client";

import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ProfileCard from "../components/settings/ProfileCard";
import AppearanceCard from "../components/settings/AppearanceCard";
import DangerZone from "../components/settings/DangerZone";
import { HelpCircle, LogOut, Download } from "lucide-react";
import { exportAsJSON, exportAsCSV } from "../lib/data-export";

import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { signout } from "../store/authSlice";
import { resetHabitState } from "../store/habitSlice";
import { logout } from "../api/auth-api";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const habits = useSelector((state) => state.habit.habits);

  const handleSignOut = async () => {
    try {
      await logout(); // 🔥 IMPORTANT (cookie clear karega)
    } catch (err) {
      // Silently ignore — session cleared or already expired
    }

    dispatch(resetHabitState());
    dispatch(signout());
    window.location.href = "/";
  };

  return (
    <div className="text-text-primary">
      <div className="w-full max-w-[1400px] mx-auto pb-4">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-6 sm:mb-10"
        >
          <h1
            className="app-heading text-[clamp(2.5rem,5vw,4rem)] text-text-primary"
          >
            settings
          </h1>
          <p className="app-label mt-2">
            Configure your creative space
          </p>
        </motion.div>

        {/* 70 / 30 layout */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="grid grid-cols-1 gap-4 sm:gap-6 mb-4 sm:mb-6 xl:grid-cols-[2fr_1fr]"
        >
          <ProfileCard />
          <AppearanceCard />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mb-4 sm:mb-6"
        >
          <button
            onClick={() => router.push("/change-password")}
            className="app-surface flex w-full items-center justify-between gap-6 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-dim sm:w-auto"
          >
            <span className="text-sm font-semibold text-text-primary">
              Change Password
            </span>

            <span className="text-xs text-text-muted">→</span>
          </button>
        </motion.div>

        {/* Data Export */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mb-4 sm:mb-6"
        >
          <div className="app-surface rounded-2xl p-6">
            <p className="app-label mb-2">DATA</p>
            <h2 className="font-heading text-2xl font-semibold tracking-[-0.04em] text-text-primary mb-4">
              export
            </h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => exportAsJSON(habits, "habitflow-habits.json")}
                disabled={!habits.length}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-dim px-5 py-2.5 text-xs font-bold tracking-wider text-text-primary transition-all hover:bg-surface hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Export as JSON
              </button>
              <button
                onClick={() => exportAsCSV(habits, "habitflow-habits.csv")}
                disabled={!habits.length}
                className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-dim px-5 py-2.5 text-xs font-bold tracking-wider text-text-primary transition-all hover:bg-surface hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Export as CSV
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mb-4 sm:mb-6"
        >
          <DangerZone />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="flex flex-row flex-wrap justify-end items-start gap-2"
        >
          {/* Help */}
          <button
            aria-label="Help"
            onClick={() => router.push("/help")}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-text-muted transition-all duration-200 hover:bg-surface-dim hover:text-text-primary"
          >
            <HelpCircle size={16} />
            <span>Help</span>
          </button>

          {/* Logout */}
          <button
            aria-label="Logout"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-danger transition-all duration-200 hover:bg-danger-soft"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
