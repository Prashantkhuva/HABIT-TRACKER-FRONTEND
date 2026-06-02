"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAuthChecked, signin } from "@/store/authSlice";
import { getCurrentUser } from "@/api/auth-api";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header/Header";
import MobileNav from "@/components/MobileNav";
import ToastProvider from "@/components/Toast/ToastProvider";
import SwipeNavigation from "@/SwipeNavigation";
import { Skeleton } from "@/components/loading/LoadingSkeletons";
import { motion, AnimatePresence } from "framer-motion";

const SWIPE_ROUTES = ["/dashboard", "/rituals", "/statistics", "/settings"];

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

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

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!authStatus) {
      router.replace("/signin");
    }
  }, [isAuthChecked, authStatus, router]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.style.colorScheme = "light";
  }, []);

  const hideChrome = ["/", "/signin", "/signup"].includes(pathname);
  const hideMobileNav = hideChrome || pathname === "/create-habit";
  const isSwipeRoute = SWIPE_ROUTES.includes(pathname);

  if (!isAuthChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-72 rounded-xl" />
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-[24px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!authStatus) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-6">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <Skeleton className="h-6 w-48 rounded-full" />
          <Skeleton className="h-12 w-72 rounded-xl" />
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-44 rounded-[24px]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="flex min-h-dvh overflow-x-hidden bg-background text-text-primary">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 lg:ml-56">
          <Header />
          <main className="mx-auto flex w-full min-w-0 max-w-screen-2xl flex-1 px-4 py-6 pb-[calc(80px+env(safe-area-inset-bottom))] sm:px-8 lg:px-10 lg:pb-6">
            {isSwipeRoute ? (
              <SwipeNavigation>{children}</SwipeNavigation>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full flex-1 flex-col"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
          {!hideMobileNav && <MobileNav />}
        </div>
      </div>
    </ToastProvider>
  );
}
