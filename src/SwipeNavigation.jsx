import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const disableSwipeRoutes = ["/create-habit"];

  const swipeDisabled = disableSwipeRoutes.includes(location.pathname);

  const currentIndex = routes.indexOf(location.pathname);

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
    preventScrollOnSwipe: false,
  });

  return (
    <div {...handlers} className="h-full overflow-x-hidden">
      <motion.div
        key={location.pathname}
        initial={{
          opacity: 0.96,
          scale: 0.995,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.12,
        }}
        className="h-full"
      >
        {children}
      </motion.div>
    </div>
  );
}
