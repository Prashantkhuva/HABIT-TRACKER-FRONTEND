import { useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];
const DISABLE_SWIPE_ON = ["/create-habit"];

const variants = {
  enter: (dir) => ({
    x: dir > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? "-60%" : "60%",
    opacity: 0,
  }),
};

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const directionRef = useRef(0); // 1 = forward (swipe left), -1 = backward (swipe right)

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
      <AnimatePresence mode="wait" initial={false} custom={directionRef.current}>
        <motion.div
          key={location.pathname}
          custom={directionRef.current}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 32, mass: 0.8 },
            opacity: { duration: 0.15 },
          }}
          className="flex-1 flex flex-col min-h-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}