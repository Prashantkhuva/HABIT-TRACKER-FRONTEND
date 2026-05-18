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
  { to: "/rituals", icon: Sparkles, label: "Rituals" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "add", icon: Plus, label: "Add" },
  { to: "/statistics", icon: BarChart2, label: "Statistics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export default function MobileNav() {
  const navigate = useNavigate();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 lg:hidden
        h-[calc(64px+env(safe-area-inset-bottom))] flex items-center justify-around
        bg-[#F4F4EF] dark:bg-[#0F0D13]
        border-t border-[#E8E4DC] dark:border-[#49454F]
        px-2
      "
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {navItems.map(({ to, icon: Icon, label }) => {
        // Center Plus Button
        if (to === "add") {
          return (
            <div
              key="add"
              className="relative flex justify-center items-center flex-1"
            >
              <button
                onClick={() => navigate("/create-habit")}
                className="
                  absolute -top-7
                  w-14 h-14 rounded-full
                  flex items-center justify-center
                  shadow-xl
                  bg-[#1A1A1A] dark:bg-[#D0BCFF]
                  text-[#FAFAF5] dark:text-[#1A1A1A]
                  hover:scale-105 active:scale-95
                  transition-all duration-200
                "
              >
                <Plus size={24} />
              </button>
            </div>
          );
        }

        return (
          <NavLink key={to} to={to} className="flex-1 flex justify-center">
            {({ isActive }) => (
              <div
                className={`
                  flex flex-col items-center justify-center gap-1 h-full
                  transition-colors duration-200
                  ${
                    isActive
                      ? "text-[#1A1A1A] dark:text-[#D0BCFF]"
                      : "text-[#888888] dark:text-[#938F99]"
                  }
                `}
              >
                <Icon size={20} />

                {/* Active dot — AnimatePresence for clean mount/unmount */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      layoutId="mobileNavIndicator"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      className="w-1 h-1 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF]"
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
