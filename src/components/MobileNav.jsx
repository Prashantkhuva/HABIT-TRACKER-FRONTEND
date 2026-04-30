import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  BarChart2,
  Settings,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

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
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden flex justify-around items-center px-2 py-3 bg-[#F4F4EF] dark:bg-[#0F0D13] border-t border-[#E8E4DC] dark:border-[#49454F]"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 12px)",
      }}
    >
      {navItems.map(({ to, icon: Icon, label }) => {
        if (to === "add") {
          return (
            <button
              key="add"
              onClick={() => navigate("/create-habit")}
              className="flex items-center justify-center w-12 h-12 rounded-full -mt-6 shadow-lg bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A] hover:bg-[#333333] dark:hover:bg-[#B69DF8] transition-colors duration-200"
            >
              <Plus size={24} />
            </button>
          );
        }

        return (
          <NavLink key={to} to={to} className="flex-1 flex justify-center">
            {({ isActive }) => (
              <div
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ${
                  isActive ? "text-[#1A1A1A] dark:text-[#D0BCFF]" : "text-[#888888] dark:text-[#938F99]"
                }`}
              >
                <Icon size={20} />
                {isActive && (
                  <motion.span
                    layoutId="mobileNavIndicator"
                    className="w-1 h-1 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF]"
                  />
                )}
              </div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
