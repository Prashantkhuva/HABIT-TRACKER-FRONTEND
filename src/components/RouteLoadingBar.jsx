"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const START_PROGRESS = "route-loading:start";
const STOP_PROGRESS = "route-loading:stop";

export function startRouteProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(START_PROGRESS));
  }
}

export function stopRouteProgress() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(STOP_PROGRESS));
  }
}

export default function RouteLoadingBar() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const loadingRef = useRef(false);
  const timerRef = useRef(null);

  const show = () => {
    loadingRef.current = true;
    document.documentElement.style.setProperty("--route-loading", "1");
    document.documentElement.style.setProperty("--route-loading-width", "70%");
  };

  const hide = () => {
    loadingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    document.documentElement.style.setProperty("--route-loading-width", "100%");
    timerRef.current = setTimeout(() => {
      document.documentElement.style.setProperty("--route-loading", "0");
      document.documentElement.style.setProperty("--route-loading-width", "0%");
    }, 250);
  };

  useEffect(() => {
    if (prevPath.current !== pathname) {
      hide();
      prevPath.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    const handleStart = () => {
      show();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, 8000);
    };
    const handleStop = () => hide();

    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    const wrap = (original) => function (...args) {
      handleStart();
      const result = original.apply(this, args);
      return result;
    };

    window.history.pushState = wrap(originalPush);
    window.history.replaceState = wrap(originalReplace);

    window.addEventListener(START_PROGRESS, handleStart);
    window.addEventListener(STOP_PROGRESS, handleStop);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener(START_PROGRESS, handleStart);
      window.removeEventListener(STOP_PROGRESS, handleStop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[99999] h-[3px] bg-accent-mint"
      style={{
        width: "var(--route-loading-width, 0%)",
        opacity: "var(--route-loading, 0)",
        boxShadow: "0 0 8px rgba(75, 107, 99, 0.4)",
        transition: "width 4s ease-out, opacity 0.25s ease",
      }}
    />
  );
}
