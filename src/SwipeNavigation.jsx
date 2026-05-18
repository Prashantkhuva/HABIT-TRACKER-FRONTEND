import { useSwipeable } from "react-swipeable";
import { useLocation, useNavigate } from "react-router-dom";

const routes = ["/rituals", "/dashboard", "/statistics", "/settings"];

export default function SwipeNavigation({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

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
    <div {...handlers} className="h-full">
      {children}
    </div>
  );
}
