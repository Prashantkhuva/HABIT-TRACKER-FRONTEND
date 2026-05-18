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
import SwipeNavigation from "./SwipeNavigation";

const HIDE_CHROME_ON = ["/", "/signin", "/signup", "/verify-email"];

// function AppLoader() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAFAF5] dark:bg-[#141218]">
//       <div className="flex flex-col items-center gap-4">
//         <div className="w-10 h-10 rounded-full border-2 border-[#1A1A1A]/10 border-t-[#1A1A1A] dark:border-[#E6E1E5]/10 dark:border-t-[#E6E1E5] animate-spin" />
//         <p className="text-sm text-[#1A1A1A]/40 dark:text-[#E6E1E5]/40 tracking-wide">
//           Loading...
//         </p>
//       </div>
//     </div>
//   );
// }

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const theme = useSelector((state) => state.theme.theme);
  const authChecked = useSelector((state) => state.auth.authChecked);

  const shouldHide = HIDE_CHROME_ON.includes(location.pathname);
  const shouldHideMobileNav =
    shouldHide || location.pathname === "/create-habit";

  // ─── Load saved theme ─────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) dispatch(setTheme(saved));
  }, [dispatch]);

  // ─── Apply theme to <html> ────────────────────────────────────────────────
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
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        root.classList.toggle("dark", e.matches);
        root.style.colorScheme = e.matches ? "dark" : "light";
      };
      mq.addEventListener("change", handleChange);
      return () => mq.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // ─── Auth check ───────────────────────────────────────────────────────────
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
      } catch {
        dispatch(setAuthChecked());
      }
    };
    checkAuth();
  }, [dispatch]);

  // ─── Block render until auth resolves ────────────────────────────────────
  // if (!authChecked) return <AppLoader />;

  return (
    <ToastProvider>
      <div className="flex min-h-dvh overflow-x-hidden bg-[#FAFAF5] text-[#1A1A1A] dark:bg-[#141218] dark:text-[#E6E1E5]">
        {!shouldHide && <Sidebar />}

        <div
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${
            !shouldHide ? "lg:ml-56" : ""
          }`}
        >
          {!shouldHide && <Header />}

          <SwipeNavigation>
            <main
              className={`flex-1 w-full mx-auto max-w-screen-2xl min-w-0 ${
                !shouldHide
                  ? "px-4 sm:px-8 lg:px-10 py-6 pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-6"
                  : ""
              }`}
            >
              <Outlet />
            </main>
          </SwipeNavigation>

          {!shouldHideMobileNav && <MobileNav />}
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
