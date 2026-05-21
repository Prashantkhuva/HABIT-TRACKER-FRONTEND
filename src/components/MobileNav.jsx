import { NavLink, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
      <div
        className="relative mx-auto flex h-[72px] max-w-md items-center justify-around rounded-[28px] border border-white/70 bg-[#F8F6EF]/88 px-2 shadow-[0_24px_70px_-34px_rgba(26,26,26,0.9)] backdrop-blur-2xl"
        style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90" />
      {navItems.map(({ to, icon: Icon, label, short }) => {
        // Center Plus Button
        if (to === "add") {
          return (
            <div
              key="add"
              className="relative flex flex-1 items-center justify-center"
            >
              <motion.button
                onClick={() => navigate("/create-habit")}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                className="absolute -top-8 flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#F8F6EF] bg-[#111111] text-[#FAFAF5] shadow-[0_24px_44px_-22px_rgba(17,17,17,0.95)]"
                aria-label="Create ritual"
              >
                <Plus size={25} strokeWidth={2} />
              </motion.button>
            </div>
          );
        }

        return (
          <NavLink key={to} to={to} className="flex flex-1 justify-center">
            {({ isActive }) => (
              <motion.div
                whileTap={{ scale: 0.94 }}
                className={`relative flex h-14 min-w-12 flex-col items-center justify-center gap-1 rounded-2xl px-2 transition-colors duration-200 ${
                  isActive ? "text-[#111111]" : "text-[#918B80]"
                }`}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="mobileNavGlow"
                      className="absolute inset-0 rounded-2xl bg-white shadow-[0_12px_30px_-24px_rgba(26,26,26,0.8)]"
                      initial={{ opacity: 0, scale: 0.86 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.86 }}
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <Icon className="relative z-10" size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="relative z-10 text-[9px] font-bold uppercase tracking-[0.14em]">
                  {short}
                </span>
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="mobileNavIndicator"
                      className="relative z-10 h-1 w-4 rounded-full bg-[#111111]"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      exit={{ scaleX: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </NavLink>
        );
      })}
      </div>
    </nav>
  );
}
