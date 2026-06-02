"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getHabits, getHabitLogs } from "../api/habits-api";
import { setReduxHabits } from "../store/habitSlice";
import HabitListCard from "../components/Habit/HabitListCard";
import EditHabit from "../components/Habit/EditHabit";
import { Button } from "../components";
import { HabitsPageSkeleton } from "../components/loading/LoadingSkeletons";
import { isLogFromToday } from "../lib/habit-utils";

const filters = ["ALL", "ACTIVE", "COMPLETED"];

export default function HabitsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const habits = useSelector((state) => state.habit.habits);
  const [completedIds, setCompletedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingHabit, setEditingHabit] = useState(null);

  const getFilterFromPath = () => {
    if (pathname === "/rituals/active") return "ACTIVE";
    if (pathname === "/rituals/completed") return "COMPLETED";
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

              const doneToday = logs.some(isLogFromToday);

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

  const filteredHabits = useMemo(() => {
    return habits.filter((h) => {
      if (activeFilter === "ACTIVE" && h.status !== "active") return false;
      if (activeFilter === "COMPLETED" && !completedIds.includes(h._id)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!h.title.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [habits, activeFilter, completedIds, searchQuery]);

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
          onClick={() => router.push("/create-habit")}
          className="mt-2 px-4 py-2 sm:px-6 sm:py-3 text-[10px]"
        >
          ADD NEW
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search rituals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-border-subtle bg-surface py-3 pl-11 pr-5 text-sm text-text-primary placeholder:text-text-muted/55 transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-8 flex items-center gap-8 border-b border-border-subtle">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              if (filter === "ALL") router.push("/rituals");
              if (filter === "ACTIVE") router.push("/rituals/active");
              if (filter === "COMPLETED") router.push("/rituals/completed");
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
            {searchQuery.trim() || activeFilter !== "ALL" ? (
              <>
                <p className="font-heading mb-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                  no matching rituals.
                </p>
                <p className="text-sm text-text-muted">
                  try a different search or filter.
                </p>
              </>
            ) : (
              <>
                <p className="font-heading mb-2 text-3xl font-semibold tracking-[-0.04em] text-text-primary">
                  no rituals yet.
                </p>
                <p className="text-sm text-text-muted">
                  design your first daily rhythm.
                </p>
              </>
            )}
          </div>
          <Button variant="primary" onClick={() => router.push("/create-habit")}>NEW RITUAL</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit, i) => (
            <HabitListCard key={habit._id} habit={habit} index={i} onEdit={setEditingHabit} />
          ))}
        </div>
      )}

      {editingHabit && (
        <EditHabit habit={editingHabit} onClose={() => setEditingHabit(null)} />
      )}
    </div>
  );
}
