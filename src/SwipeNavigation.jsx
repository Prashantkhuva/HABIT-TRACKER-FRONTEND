import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";

import { AnimatePresence, motion } from "framer-motion";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  // ❌ Disable swipe on forms
  const disableSwipeRoutes = ["/create-habit"];

  if (disableSwipeRoutes.includes(location.pathname)) {
    return children;
  }

  const currentIndex = routes.indexOf(location.pathname);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < routes.length - 1) {
        navigate(routes[currentIndex + 1]);
      }
    },

    onSwipedRight: () => {
      if (currentIndex > 0) {
        navigate(routes[currentIndex - 1]);
      }
    },

    delta: 80,
    trackTouch: true,
    preventScrollOnSwipe: false,
  });

  return (
    <div {...handlers} className="h-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{
            x: 80,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{
            x: -80,
            opacity: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 25,
          }}
          className="h-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
