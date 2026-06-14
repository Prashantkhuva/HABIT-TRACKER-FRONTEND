import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isPointerFine, setIsPointerFine] = useState(false);
  const cursorRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mediaQuery.matches);
    const handler = (e) => setIsPointerFine(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;

    const updateCursor = () => {
      if (cursorEl) {
        cursorEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      rafId = null;
    };

    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(updateCursor);
    };

    const handleMouseOver = (e) => {
      setHovered(!!e.target.closest("button, a, [role='button'], input, select, textarea"));
    };

    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.15s ease",
      }}
    >
      <svg
        width={hovered ? 24 : 20}
        height={hovered ? 24 : 20}
        viewBox="0 0 24 24"
        style={{ transform: hovered ? "translate(-8px, -6px)" : "translate(-4px, -2px)" }}
      >
        {hovered ? (
          <path
            fill="#FFF"
            stroke="#000"
            strokeWidth="2"
            strokeLinejoin="round"
            d="M10 11V8.99c0-.88.59-1.64 1.44-1.86h.05A1.99 1.99 0 0 1 14 9.05V12v-2c0-.88.6-1.65 1.46-1.87h.05A1.98 1.98 0 0 1 18 10.06V13v-1.94a2 2 0 0 1 1.51-1.94h0A2 2 0 0 1 22 11.06V14c0 .6-.08 1.27-.21 1.97a7.96 7.96 0 0 1-7.55 6.48 54.98 54.98 0 0 1-4.48 0 7.96 7.96 0 0 1-7.55-6.48C2.08 15.27 2 14.59 2 14v-1.49c0-1.11.9-2.01 2.01-2.01h0a2 2 0 0 1 2.01 2.03l-.01.97v-10c0-1.1.9-2 2-2h0a2 2 0 0 1 2 2V11Z"
          />
        ) : (
          <path
            fill="#FFF"
            stroke="#000"
            strokeWidth="2"
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
          />
        )}
      </svg>
    </div>
  );
}
