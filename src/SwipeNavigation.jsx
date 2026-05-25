import { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];
const DISABLE_SWIPE_ON = ["/create-habit"];

const variants = {
  // FIX 1: dir >= 0 instead of dir > 0
  // When dir === 0 (initial), it now defaults to "enter from right" instead of wrong side
  enter: (dir) => ({
    x: dir >= 0 ? "30%" : "-30%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? "-30%" : "30%",
    opacity: 0,
  }),
};

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  // FIX 2: Initialize to 1 (forward) so first render has a clean default
  const directionRef = useRef(1);

  const currentIndex = routes.indexOf(location.pathname);
  const swipeDisabled =
    DISABLE_SWIPE_ON.includes(location.pathname) || currentIndex === -1;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!swipeDisabled && currentIndex < routes.length - 1) {
        directionRef.current = 1;
        navigate(routes[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (!swipeDisabled && currentIndex > 0) {
        directionRef.current = -1;
        navigate(routes[currentIndex - 1]);
      }
    },
    delta: 60,
    trackTouch: true,
    preventScrollOnSwipe: true,
    touchEventOptions: { passive: false },
  });

  return (
    <div {...handlers} className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/*
        FIX 3: Removed mode="wait"
        mode="wait" causes the exit to fully finish before enter starts —
        this created the "blank flash" / late-loading feel.
        Without it (default sync mode), enter and exit overlap, which looks
        natural and instant — exactly like a native swipe.
      */}
      <AnimatePresence initial={false} custom={directionRef.current}>
        <motion.div
          key={location.pathname}
          custom={directionRef.current}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            /*
              FIX 4: Smoother spring physics
              Old: stiffness 380, damping 35, mass 0.7 → bouncy, heavy
              New: tween with custom ease → clean, controlled, no overshoot
              This gives it that "premium native app" slide feel.
            */
            x: {
              type: "tween",
              duration: 0.28,
              ease: [0.4, 0.0, 0.2, 1], // Material Design standard easing
            },
            opacity: { duration: 0.15 },
          }}
          // FIX 5: GPU acceleration hint — prevents jank on lower-end devices
          style={{ willChange: "transform, opacity" }}
          className="flex-1 flex flex-col min-h-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
