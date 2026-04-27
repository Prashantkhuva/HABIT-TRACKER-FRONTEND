import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getHabits, getHabitLogs } from "../api/habits-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitListCard from "../components/Habit/HabitListCard";

const filters = ["ALL", "ACTIVE", "COMPLETED"];

export default function HabitsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const habits = useSelector((state) => state.habit.habits);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [completedIds, setCompletedIds] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getHabits();
        const fetchedHabits = res.data.data;
        dispatch(setReduxHabits(fetchedHabits));

        const doneIds = [];
        await Promise.all(
          fetchedHabits.map(async (habit) => {
            try {
              const logRes = await getHabitLogs(habit._id, 1, 5);
              const logs = logRes.data.data.logs;
              const doneToday = logs.some((log) => {
                const logDate = new Date(Number(log.date));
                const today = new Date();
                return (
                  logDate.getDate() === today.getDate() &&
                  logDate.getMonth() === today.getMonth() &&
                  logDate.getFullYear() === today.getFullYear()
                );
              });
              if (doneToday) doneIds.push(habit._id);
            } catch (err) {
              console.error(err);
            }
          }),
        );
        setCompletedIds(doneIds);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAll();
  }, []);

  const filteredHabits = habits.filter((h) => {
    if (activeFilter === "ALL") return h.status === "active";
    if (activeFilter === "ACTIVE") return h.status === "active";
    if (activeFilter === "COMPLETED") return completedIds.includes(h._id);
    return true;
  });

  return (
    <div
      className="min-h-screen px-8 py-10"
      style={{ background: "#FAFAF5", color: "#1A1A1A" }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p
            className="text-xs tracking-widest mb-1"
            style={{ color: "#9A9A8A" }}
          >
            OVERVIEW
          </p>
          <h1
            className="font-bold"
            style={{
              fontFamily: "Epilogue, sans-serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              letterSpacing: "-0.04em",
            }}
          >
            my habits
          </h1>
        </div>
        <button
          onClick={() => navigate("/create-habit")}
          className="px-6 py-3 rounded-full text-xs font-bold tracking-widest mt-2"
          style={{
            background: "#1A1A1A",
            color: "#FAFAF5",
            fontFamily: "Manrope, sans-serif",
          }}
        >
          ADD NEW
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex items-center gap-8 mb-8 border-b"
        style={{ borderColor: "#E8E4DC" }}
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="relative pb-3 text-xs font-semibold tracking-widest transition-all"
            style={{
              color: activeFilter === filter ? "#1A1A1A" : "#9A9A8A",
              fontFamily: "Manrope, sans-serif",
            }}
          >
            {filter}
            {activeFilter === filter && (
              <motion.div
                layoutId="filterLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "#1A1A1A" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 gap-4">
          <p
            className="text-2xl font-bold"
            style={{ fontFamily: "Epilogue, sans-serif", color: "#E8E4DC" }}
          >
            {activeFilter === "COMPLETED"
              ? "no habits completed today."
              : "no habits yet."}
          </p>
          {activeFilter !== "COMPLETED" && (
            <button
              onClick={() => navigate("/create-habit")}
              className="px-6 py-3 rounded-full text-xs font-bold tracking-widest"
              style={{ background: "#1A1A1A", color: "#FAFAF5" }}
            >
              ADD NEW
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit, i) => (
            <HabitListCard key={habit._id} habit={habit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
