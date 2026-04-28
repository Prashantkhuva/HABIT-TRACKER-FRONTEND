import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export default function Heatmap({ data }) {
  const [hovered, setHovered] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const map = useMemo(() => {
    const m = {};
    data.forEach((d) => {
      const day = parseInt(d._id.split("-")[2], 10);
      m[day] = d.count;
    });
    return m;
  }, [data]);

  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayRaw = new Date(year, month, 1).getDay();
  const offset = firstDayRaw === 0 ? 6 : firstDayRaw - 1;

  const cells = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const getColor = (count) => {
    if (!count) return "#E8E4DC";
    if (count === 1) return "#C8DAD6";
    if (count === 2) return "#8FA8A3";
    return "#4F6F64";
  };

  return (
    <div style={{ maxWidth: "420px" }}>
      {/* Day labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0px",
          marginBottom: "4px",
        }}
      >
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "#9A9A8A",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {cells.map((day, i) => {
          if (!day)
            return <div key={`empty-${i}`} style={{ aspectRatio: "1" }} />;

          const count = map[day] || 0;

          return (
            <div
              key={day}
              style={{ position: "relative" }}
              onMouseEnter={() => setHovered({ day, count })}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  aspectRatio: "1",
                  borderRadius: "4px",
                  background: getColor(count),
                  cursor: "pointer",
                  maxWidth: "40px",
                  maxHeight: "40px",
                }}
              />

              {/* 🔥 CUSTOM TOOLTIP */}
              {hovered?.day === day && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "110%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#1A1A1A",
                    color: "#FAFAF5",
                    fontSize: "10px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  Day {day} — {count} habits
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
