import { useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { setAuthChecked, signin } from "./store/authSlice";
import { getCurrentUser } from "./api/auth-api";
import MobileNav from "./components/MobileNav";
import ToastProvider from "./components/Toast/ToastProvider";
import { setTheme } from "./store/themeSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);

  const hideHeaderOn = ["/", "/signin", "/signup", "/verify-email"];
  const shouldHide = hideHeaderOn.includes(location.pathname);

  // ✅ LOAD SAVED THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      dispatch(setTheme(saved));
    }
  }, [dispatch]);

  // ✅ APPLY THEME TO DOM
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t) => {
      if (t === "dark") {
        root.classList.add("dark");
        root.style.colorScheme = "dark";
      } else if (t === "light") {
        root.classList.remove("dark");
        root.style.colorScheme = "light";
      } else {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        root.classList.toggle("dark", isDark);
        root.style.colorScheme = isDark ? "dark" : "light";
      }
    };

    applyTheme(theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = (e) => {
        root.classList.toggle("dark", e.matches);
        root.style.colorScheme = e.matches ? "dark" : "light";
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // ✅ AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await getCurrentUser();
        const user = res?.data?.data;

        if (user) {
          dispatch(signin({ userData: user }));
        } else {
          dispatch(setAuthChecked());
        }
      } catch (error) {
        dispatch(setAuthChecked());
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <ToastProvider>
      <div className="flex min-h-dvh overflow-x-hidden bg-[#FAFAF5] text-[#1A1A1A] dark:bg-[#141218] dark:text-[#E6E1E5]">
        {/* Sidebar - Visible only on lg (1024px) and above */}
        {!shouldHide && <Sidebar />}

        {/* Content Area */}
        <div
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
            !shouldHide ? "lg:ml-56" : ""
          }`}
        >
          {/* Header */}
          {!shouldHide && <Header />}

          {/* Main Content */}
          <main
            className={`flex-1 w-full mx-auto max-w-screen-2xl min-w-0 ${
              !shouldHide
                ? "px-4 sm:px-8 lg:px-10 py-6 pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-6"
                : ""
            }`}
          >
            <Outlet />
          </main>

          {/* Mobile Nav - Hidden on lg and above */}
          {!shouldHide && location.pathname !== "/create-habit" && (
            <MobileNav />
          )}
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
