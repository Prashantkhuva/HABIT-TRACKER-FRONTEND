import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  BarChart2,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { signout } from "../store/authSlice";

const navItems = [
  { to: "/rituals", icon: Sparkles, label: "RITUALS" },
  { to: "/dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
  { to: "/statistics", icon: BarChart2, label: "STATISTICS" },
  { to: "/journal", icon: BookOpen, label: "JOURNAL" },
  { to: "/settings", icon: Settings, label: "SETTINGS" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(signout());
    navigate("/signin");
  };

  return (
    <aside
      className="hidden lg:flex fixed top-0 left-0 h-full w-56 z-40 flex-col"
      style={{
        background: "#FAFAF5",
        borderRight: "1px solid #E8E4DC",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <h1
          className="text-2xl font-medium tracking-tight"
          style={{ fontFamily: "Epilogue, sans-serif", color: "#1A1A1A" }}
        >
          habitflow
        </h1>
        <p
          className="text-xs tracking-widest mt-1"
          style={{ fontFamily: "Manrope, sans-serif", color: "#9A9A8A" }}
        >
          PREMIUM EDITORIAL TRACKING
        </p>
      </div>

      {/* New Ritual Button */}
      <div className="px-4 mb-6">
        <button
          onClick={() => navigate("/rituals/new")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold tracking-widest transition-all"
          style={{
            background: "#1A1A1A",
            color: "#FAFAF5",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          NEW RITUAL
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className="flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 relative"
                style={{
                  background: isActive ? "#EEEAE0" : "transparent",
                  color: isActive ? "#1A1A1A" : "#9A9A8A",
                }}
              >
                {/* Active dot */}
                {isActive && (
                  <span
                    className="absolute left-0 w-1 h-4 rounded-full"
                    style={{ background: "#1A1A1A" }}
                  />
                )}
                <Icon size={16} />
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{ fontFamily: "Manrope, sans-serif" }}
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-8 flex flex-col gap-1">
        {/* Help */}
        <button
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
          style={{ color: "#9A9A8A" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#EEEAE0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <HelpCircle size={16} />
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            HELP
          </span>
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all"
          style={{ color: "#9A9A8A" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#EEEAE0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={16} />
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            SIGN OUT
          </span>
        </button>
      </div>
    </aside>
  );
}