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
      <div className="mb-8 flex items-start justify-between gap-5">
        <div>
          <p className="app-label mb-1">
            OVERVIEW
          </p>
          <h1
            className="app-heading text-text-primary"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
            }}
          >
            my habits
          </h1>
        </div>

        <Button
          onClick={() => navigate("/create-habit")}
          className="mt-2 px-6 py-3 text-[10px]"
        >
          ADD NEW
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-8 border-b border-border-subtle">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              if (filter === "ALL") navigate("/rituals");
              if (filter === "ACTIVE") navigate("/rituals/active");
              if (filter === "COMPLETED") navigate("/rituals/completed");
            }}
            className={`relative pb-3 text-xs font-bold tracking-[0.16em] transition-all duration-200 ${
              activeFilter === filter ? "text-text-primary" : "text-text-muted"
            }`}
          >
            {filter}

            {activeFilter === filter && (
              <motion.div
                layoutId="filterLine"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredHabits.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p className="font-heading mb-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
              no rituals yet.
            </p>
            <p className="text-sm text-text-muted">
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
