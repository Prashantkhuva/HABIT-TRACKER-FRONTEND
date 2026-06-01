import { useEffect, useMemo } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import { useDispatch } from "react-redux";
import { setAuthChecked, signin } from "./store/authSlice";
import { getCurrentUser } from "./api/auth-api";
import MobileNav from "./components/MobileNav";
import ToastProvider from "./components/Toast/ToastProvider";
import SwipeNavigation from "./SwipeNavigation";
import { usePageSeo } from "./hooks/usePageSeo";
import { getStructuredData } from "./lib/seo-config";
import { motion, AnimatePresence } from "framer-motion";

const HIDE_CHROME_ON = ["/", "/signin", "/signup"];

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  const homeJsonLd = useMemo(
    () => (location.pathname === "/" ? getStructuredData() : null),
    [location.pathname],
  );

  usePageSeo(location.pathname, { jsonLd: homeJsonLd });

  const shouldHide = HIDE_CHROME_ON.includes(location.pathname);
  const shouldHideMobileNav =
    shouldHide || location.pathname === "/create-habit";

  // ─── Keep dark theme disabled ─────────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }, []);

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

          <main
            className={`flex-1 w-full mx-auto max-w-screen-2xl min-w-0 ${
              !shouldHide
                ? "px-4 sm:px-8 lg:px-10 py-6 pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-6"
                : ""
            }`}
          >
            {["/dashboard", "/rituals", "/statistics", "/settings"].includes(
              location.pathname,
            ) ? (
              <SwipeNavigation>
                <Outlet />
              </SwipeNavigation>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            )}
          </main>

          {!shouldHideMobileNav && <MobileNav />}
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
