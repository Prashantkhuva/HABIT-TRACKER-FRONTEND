import { NavLink, useNavigate, Link } from "react-router-dom";
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
import { resetHabitState } from "../store/habitSlice";
import Button from "./Button";
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
      await logout(); 
    } catch (err) {
      console.log(err);
    }

    dispatch(resetHabitState());
    dispatch(signout());
    window.location.href = "/";
  };

  return (
    <aside
      className="fixed left-0 top-0 z-40 hidden h-full w-56 flex-col border-r border-border-subtle bg-surface-dim lg:flex"
    >

      {/* Logo */}
      <div className="flex flex-col items-center px-0 pb-6 pt-8 lg:items-start lg:px-6">
        <Link to={"/dashboard"}>
          <h1
            className="hidden font-heading text-2xl font-semibold lowercase tracking-[-0.055em] text-text-primary lg:block"
          >
            habitflow
          </h1>
          <h1
            className="font-heading text-2xl font-bold tracking-tight text-text-primary lg:hidden"
          >
            h.
          </h1>
        </Link>
        <p
          className="app-label mt-1 hidden lg:block"
        >
          EDITORIAL TRACKING
        </p>
      </div>

      {/* New Ritual Button */}
      <div className="lg:px-4 px-2 mb-6">
        <Button
          onClick={() => navigate("/create-habit")}
          className="w-full px-4 py-3 text-[10px]"
        >
          <span className="hidden lg:inline">NEW RITUAL</span>
          <Plus className="lg:hidden" size={20} />
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 lg:px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={`relative flex cursor-pointer items-center justify-center gap-3 rounded-xl px-0 py-3 transition-all duration-200 lg:justify-start lg:px-3 ${isActive
                  ? "bg-surface text-text-primary shadow-[0_14px_34px_-28px_rgba(26,26,26,0.45)]"
                  : "bg-transparent text-text-muted hover:bg-surface hover:text-text-primary"
                  }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span
                    className="absolute left-0 h-4 w-1 rounded-full bg-primary"
                  />
                )}
                <Icon size={18} className="shrink-0" />
                <span
                  className="hidden text-[11px] font-bold tracking-[0.16em] lg:block"
                >
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col gap-1 px-2 pb-8 lg:px-3">
        {/* Help */}
        <button
          className="flex w-full items-center justify-center gap-3 rounded-xl px-0 py-3 text-text-muted transition-all duration-200 hover:bg-surface hover:text-text-primary lg:justify-start lg:px-3"
          onClick={() => navigate("/help")}
        >
          <HelpCircle size={18} className="shrink-0" />
          <span
            className="hidden text-[11px] font-bold tracking-[0.16em] lg:block"
          >
            HELP
          </span>
        </button>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center justify-center gap-3 rounded-xl px-0 py-3 text-text-muted transition-all duration-200 hover:bg-danger-soft hover:text-danger lg:justify-start lg:px-3"
        >
          <LogOut size={18} className="shrink-0" />
          <span
            className="hidden text-[11px] font-bold tracking-[0.16em] lg:block"
          >
            SIGN OUT
          </span>
        </button>
      </div>
    </aside>
  );
}
