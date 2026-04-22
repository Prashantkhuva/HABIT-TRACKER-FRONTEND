import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    // ✅ IMPORTANT: event delegation (React friendly)
    const handleMouseOver = (e) => {
      const target = e.target.closest("button, a");
      if (target) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    document.addEventListener("mouseover", handleMouseOver);

    // hide default cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "default";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        pointerEvents: "none",
        zIndex: 99999,
      }}
    >
      {hovered ? (
        // 👉 HAND POINTER
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{ transform: "translate(-8px, -6px)" }}
        >
          <path
            fill="#FFF"
            stroke="#000"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M10 11V8.99c0-.88.59-1.64 1.44-1.86h.05A1.99 1.99 0 0 1 14 9.05V12v-2c0-.88.6-1.65 1.46-1.87h.05A1.98 1.98 0 0 1 18 10.06V13v-1.94a2 2 0 0 1 1.51-1.94h0A2 2 0 0 1 22 11.06V14c0 .6-.08 1.27-.21 1.97a7.96 7.96 0 0 1-7.55 6.48 54.98 54.98 0 0 1-4.48 0 7.96 7.96 0 0 1-7.55-6.48C2.08 15.27 2 14.59 2 14v-1.49c0-1.11.9-2.01 2.01-2.01h0a2 2 0 0 1 2.01 2.03l-.01.97v-10c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2V11Z"
          />
        </svg>
      ) : (
        // 👉 ARROW POINTER
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          style={{ transform: "translate(-4px, -2px)" }}
        >
          <path
            fill="#FFF"
            stroke="#000"
            strokeWidth="2"
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
          />
        </svg>
      )}
    </div>
  );
}