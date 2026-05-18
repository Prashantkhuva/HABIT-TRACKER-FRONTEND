import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];

const DISABLE_SWIPE_ON = ["/create-habit"];

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const currentIndex = routes.indexOf(location.pathname);

  // Swipe is only valid on known routes that aren't blacklisted
  const swipeDisabled =
    DISABLE_SWIPE_ON.includes(location.pathname) || currentIndex === -1;

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (!swipeDisabled && currentIndex < routes.length - 1) {
        navigate(routes[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (!swipeDisabled && currentIndex > 0) {
        navigate(routes[currentIndex - 1]);
      }
    },
    delta: 70,
    trackTouch: true,
    preventScrollOnSwipe: true, // ← fix: blocks accidental nav while scrolling
    touchEventOptions: { passive: false },
  });

  return (
    <div {...handlers} className="flex-1 flex flex-col min-h-0">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex-1 flex flex-col min-h-0"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
