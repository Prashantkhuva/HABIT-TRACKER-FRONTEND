import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { getHabits, getHabitLogs } from "../api/habits-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitListCard from "../components/Habit/HabitListCard";
import { Button } from "../components";
import { HabitsPageSkeleton } from "../components/loading/LoadingSkeletons";

const filters = ["ALL", "ACTIVE", "COMPLETED"];

export default function HabitsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const habits = useSelector((state) => state.habit.habits);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFilterFromPath = () => {
    if (location.pathname === "/rituals/active") return "ACTIVE";
    if (location.pathname === "/rituals/completed") return "COMPLETED";
    return "ALL";
  };

  const activeFilter = getFilterFromPath();

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
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [dispatch]);

  const filteredHabits = habits.filter((h) => {
    if (activeFilter === "ALL") return true;

    if (activeFilter === "ACTIVE") return h.status === "active";

    if (activeFilter === "COMPLETED") return completedIds.includes(h._id);

    return true;
  });

  if (loading) return <HabitsPageSkeleton />;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs tracking-widest mb-1 text-[#888888] dark:text-[#938F99]">
            OVERVIEW
          </p>
          <h1
            className="font-bold text-[#1A1A1A] dark:text-[#E6E1E5]"
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
          className="px-6 py-3 rounded-full text-xs font-bold tracking-widest mt-2 bg-[#1A1A1A] dark:bg-[#D0BCFF] text-[#FAFAF5] dark:text-[#1A1A1A] hover:bg-[#333333] dark:hover:bg-[#B69DF8] transition-colors duration-200"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          ADD NEW
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-8 mb-8 border-b border-[#E8E4DC] dark:border-[#49454F]">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              if (filter === "ALL") navigate("/rituals");
              if (filter === "ACTIVE") navigate("/rituals/active");
              if (filter === "COMPLETED") navigate("/rituals/completed");
            }}
            className={`relative pb-3 text-xs font-semibold tracking-widest transition-all duration-200 ${
              activeFilter === filter ? "text-[#1A1A1A] dark:text-[#D0BCFF]" : "text-[#888888] dark:text-[#938F99]"
            }`}
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {filter}

            {activeFilter === filter && (
              <motion.div
                layoutId="filterLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1A1A1A] dark:bg-[#D0BCFF]"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="text-center">
            <p className="text-3xl font-semibold mb-2 text-[#1A1A1A] dark:text-[#E6E1E5]" style={{ fontFamily: "Epilogue, sans-serif" }}>
              no rituals yet.
            </p>
            <p className="text-sm text-[#888888] dark:text-[#938F99]">
              design your first daily rhythm.
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate("/create-habit")}>NEW RITUAL</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit, i) => (
            <HabitListCard key={habit._id} habit={habit} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
