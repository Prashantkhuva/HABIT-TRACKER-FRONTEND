export default function HabitCalendar({ logs }) {
  return (
    <div>
      {/* DAY NAMES */}
      <div className="grid grid-cols-7 gap-3 text-xs text-gray-400 mb-2">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="text-center font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* DATES */}
      <div className="grid grid-cols-7 gap-3">
        {logs.slice(0, 14).map((log) => (
          <div
            key={log._id}
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold"
            style={{
              background: log.completed ? "#4F6F64" : "#E5E5E5",
              color: log.completed ? "#fff" : "#999",
            }}
          >
            {new Date(log.date).getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}