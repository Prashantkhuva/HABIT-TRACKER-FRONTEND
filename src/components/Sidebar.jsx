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
import Button from "./Button";
import { Link } from "react-router-dom";
import { logout } from "../api/auth-api";

const navItems = [
  { to: "/rituals", icon: Sparkles, label: "RITUALS" },
  { to: "/dashboard", icon: LayoutDashboard, label: "DASHBOARD" },
  { to: "/statistics", icon: BarChart2, label: "STATISTICS" },
  { to: "/settings", icon: Settings, label: "SETTINGS" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await logout(); // 🔥 IMPORTANT (cookie clear karega)
    } catch (err) {
      console.log(err);
    }

    dispatch(signout());
    navigate("/signin", { replace: true });
  };

  return (
    <aside
      className="hidden sm:flex fixed top-0 left-0 h-full w-16 lg:w-56 z-40 flex-col bg-[#F4F4EF] dark:bg-[#0F0D13] border-r border-[#E8E4DC] dark:border-[#49454F]"
    >
      {/* Logo */}
      <div className="lg:px-6 px-0 pt-8 pb-6 flex flex-col lg:items-start items-center">
        <Link to={"/dashboard"}>
          <h1
            className="hidden lg:block text-2xl font-medium tracking-tight text-[#1A1A1A] dark:text-[#E6E1E5]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            habitflow
          </h1>
          <h1
            className="lg:hidden text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#E6E1E5]"
            style={{ fontFamily: "Epilogue, sans-serif" }}
          >
            h.
          </h1>
        </Link>
        <p
          className="hidden lg:block text-[10px] tracking-widest mt-1 text-[#888888] dark:text-[#938F99]"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          PREMIUM EDITORIAL TRACKING
        </p>
      </div>

      {/* New Ritual Button */}
      <div className="lg:px-4 px-2 mb-6">
        <Button
          onClick={() => navigate("/create-habit")}
         
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          <span className="hidden lg:inline">NEW RITUAL</span>
          <Plus className="lg:hidden" size={20} />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 lg:px-3 px-2 flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={`flex items-center lg:justify-start justify-center gap-3 lg:px-3 px-0 py-3 rounded-lg cursor-pointer transition-all duration-200 relative ${isActive
                  ? "bg-white text-[#1A1A1A] dark:bg-[#1D1B20] dark:text-[#D0BCFF]"
                  : "bg-transparent text-[#888888] dark:text-[#938F99] hover:bg-white dark:hover:bg-[#1D1B20] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5]"
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 w-1 h-4 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF]"
                  />
                )}
                <Icon size={18} className="shrink-0" />
                <span
                  className="hidden lg:block text-xs font-semibold tracking-widest"
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
      <div className="lg:px-3 px-2 pb-8 flex flex-col gap-1">
        {/* Help */}
        <button
          className="w-full flex items-center lg:justify-start justify-center gap-3 lg:px-3 px-0 py-3 rounded-lg transition-all duration-200 text-[#888888] dark:text-[#938F99] hover:bg-white dark:hover:bg-[#1D1B20] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5]"
          onClick={() => navigate("/help")}
        >
          <HelpCircle size={18} className="shrink-0" />
          <span
            className="hidden lg:block text-xs font-semibold tracking-widest"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            HELP
          </span>
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center lg:justify-start justify-center gap-3 lg:px-3 px-0 py-3 rounded-lg transition-all duration-200 text-[#888888] dark:text-[#938F99] hover:bg-white dark:hover:bg-[#1D1B20] hover:text-[#1A1A1A] dark:hover:text-[#E6E1E5]"
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className="hidden lg:block text-xs font-semibold tracking-widest"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            SIGN OUT
          </span>
        </button>
      </div>
    </aside>
  );
}
