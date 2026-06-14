"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, startTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const handleStart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    startTransition(() => setLoading(true));
  };

  const handleStop = () => {
    startTransition(() => setLoading(false));
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (prevPath.current !== pathname) {
      handleStop();
      prevPath.current = pathname;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const onStart = () => {
      handleStart();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleStop, 8000);
    };
    const onStop = () => handleStop();

    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    const wrap = (original) =>
      function (...args) {
        onStart();
        const result = original.apply(this, args);
        return result;
      };

    window.history.pushState = wrap(originalPush);
    window.history.replaceState = wrap(originalReplace);

    window.addEventListener(START_PROGRESS, onStart);
    window.addEventListener(STOP_PROGRESS, onStop);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener(START_PROGRESS, onStart);
      window.removeEventListener(STOP_PROGRESS, onStop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0.5 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.5 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-0 top-0 z-[99999] h-[3px] w-full overflow-hidden"
        >
          {/* Glow layer */}
          <div className="absolute inset-0 h-full w-full blur-md">
            <div className="h-full w-full origin-left animate-[loading-glow_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-accent-mint to-transparent" />
          </div>

          {/* Main bar */}
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            exit={{ width: "100%" }}
            transition={{
              duration: 4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative h-full w-0"
          >
            <div className="h-full w-full rounded-full bg-gradient-to-r from-accent-mint via-accent-mint to-accent-soft" />

            {/* Leading dot */}
            <div className="absolute -right-[3px] -top-[2.5px] h-[8px] w-[8px] rounded-full bg-accent-mint shadow-[0_0_8px_2px_rgba(75,107,99,0.6)]" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
