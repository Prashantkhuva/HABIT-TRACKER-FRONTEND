"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header/Header";
import MobileNav from "@/components/MobileNav";
import ToastProvider from "@/components/Toast/ToastProvider";
import SwipeNavigation from "@/SwipeNavigation";

const SWIPE_ROUTES = ["/dashboard", "/rituals", "/statistics", "/settings"];

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { status: authStatus, isAuthChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!authStatus) {
      router.replace("/signin");
    }
  }, [isAuthChecked, authStatus, router]);

  const hideChrome = ["/", "/signin", "/signup"].includes(pathname);
  const hideMobileNav = hideChrome || pathname === "/create-habit";
  const isSwipeRoute = SWIPE_ROUTES.includes(pathname);

  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-background focus:text-sm focus:font-semibold focus:outline-none">
        Skip to content
      </a>
      <ToastProvider>
      <div className="flex min-h-dvh overflow-x-hidden bg-background text-text-primary">
        <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 lg:ml-64">
          <Header />
          <main id="main-content" className="mx-auto flex w-full min-w-0 max-w-screen-2xl flex-1 px-4 py-6 pb-[calc(80px+env(safe-area-inset-bottom))] sm:px-8 lg:px-10 lg:pb-6">
            {isSwipeRoute ? (
              <SwipeNavigation>{children}</SwipeNavigation>
            ) : (
              <div className="flex w-full flex-1 flex-col">
                {children}
              </div>
            )}
          </main>
          {!hideMobileNav && <MobileNav />}
        </div>
      </div>
    </ToastProvider>
    </>
  );
}
