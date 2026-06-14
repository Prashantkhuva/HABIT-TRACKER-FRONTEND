"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Archive, Trash2, X, CheckSquare } from "lucide-react";
import { getHabits, getHabitLogs, deleteHabit, archiveHabit } from "../api/habits-api";
import { setReduxHabits, deleteReduxHabit } from "../store/habitSlice";
import HabitListCard from "../components/Habit/HabitListCard";
import EditHabit from "../components/Habit/EditHabit";
import { Button } from "../components";
import { HabitsPageSkeleton } from "../components/loading/LoadingSkeletons";
import { useToast } from "../components/Toast/ToastProvider";
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
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const { addToast } = useToast();

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
        const raw = res.data.data;
        const fetchedHabits = Array.isArray(raw) ? raw : raw?.habits ?? [];
        dispatch(setReduxHabits(fetchedHabits));

        const doneIds = [];
        if (fetchedHabits.length > 0) {
          await Promise.all(
            fetchedHabits.map(async (habit) => {
              try {
                const logRes = await getHabitLogs(habit._id, 1, 5);
                const logs = logRes.data.data.logs;
                if (logs.some(isLogFromToday)) doneIds.push(habit._id);
              } catch (err) { console.error("[HabitsPage] Log fetch error:", err); }
            }),
          );
        }
        setCompletedIds(doneIds);
      } catch (err) {
        const msg = err?.response?.data?.message || err?.message || "Unknown error";
        console.error("[HabitsPage] Failed to fetch habits:", msg);
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
      <div className="mb-8 flex items-start justify-between gap-5">
        <div>
          <p className="app-label mb-1">OVERVIEW</p>
          <h1 className="app-heading text-text-primary" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)" }}>
            my habits
          </h1>
        </div>
        <Button onClick={() => router.push("/create-habit")} className="mt-2 px-4 py-2 sm:px-6 sm:py-3 text-[10px]">
          ADD NEW
        </Button>
      </div>

      <div className="relative mb-6">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search rituals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-border-subtle bg-surface py-3.5 pl-11 pr-5 text-sm text-text-primary placeholder:text-text-muted/55 transition-all focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-4 focus:ring-primary/8"
        />
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-border-subtle/60">
        <div className="flex items-center gap-8">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setSelectedIds([]);
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
                <motion.div layoutId="filterLine" className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            setSelectedIds(selectedIds.length === filteredHabits.length ? [] : filteredHabits.map((h) => h._id));
          }}
          className={`flex items-center gap-1.5 pb-3 text-[10px] font-bold tracking-wider transition-colors ${
            selectedIds.length > 0 ? "text-accent-mint" : "text-text-muted hover:text-text-primary"
          }`}
        >
          <CheckSquare size={13} />
          {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select all"}
        </button>
      </div>

      {/* Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-6 flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-dim p-3"
          >
            <span className="text-xs font-medium text-text-muted mr-2">
              {selectedIds.length} selected
            </span>
            <button
              onClick={async () => {
                setBulkLoading(true);
                try {
                  await Promise.all(selectedIds.map((id) => archiveHabit(id)));
                  selectedIds.forEach((id) => dispatch(deleteReduxHabit(id)));
                  addToast({ type: "success", title: "Archived", message: `${selectedIds.length} habits archived` });
                  setSelectedIds([]);
                } catch (err) {
                  addToast({ type: "error", title: "Failed", message: "Could not archive habits" });
                } finally {
                  setBulkLoading(false);
                }
              }}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 py-2 text-[10px] font-bold tracking-wider text-text-primary transition-all hover:bg-surface disabled:opacity-40"
            >
              <Archive size={13} />
              Archive
            </button>
            <button
              onClick={async () => {
                if (!confirm(`Delete ${selectedIds.length} habits?`)) return;
                setBulkLoading(true);
                try {
                  await Promise.all(selectedIds.map((id) => deleteHabit(id)));
                  selectedIds.forEach((id) => dispatch(deleteReduxHabit(id)));
                  addToast({ type: "success", title: "Deleted", message: `${selectedIds.length} habits deleted` });
                  setSelectedIds([]);
                } catch (err) {
                  addToast({ type: "error", title: "Failed", message: "Could not delete habits" });
                } finally {
                  setBulkLoading(false);
                }
              }}
              disabled={bulkLoading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 py-2 text-[10px] font-bold tracking-wider text-danger transition-all hover:bg-danger-soft disabled:opacity-40"
            >
              <Trash2 size={13} />
              Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="ml-auto rounded-full p-2 text-text-muted hover:bg-surface hover:text-text-primary transition-all"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredHabits.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
          <div className="text-center">
            {searchQuery.trim() || activeFilter !== "ALL" ? (
              <>
                <p className="font-heading mb-2 text-3xl font-bold tracking-[-0.04em] text-text-primary">
                  no matching rituals.
                </p>
                <p className="text-sm text-text-muted">try a different search or filter.</p>
              </>
            ) : (
              <>
                <p className="font-heading mb-2 text-3xl font-bold tracking-[-0.04em] text-text-primary">
                  no rituals yet.
                </p>
                <p className="text-sm text-text-muted">design your first daily rhythm.</p>
              </>
            )}
          </div>
          <Button variant="primary" onClick={() => router.push("/create-habit")}>NEW RITUAL</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHabits.map((habit, i) => (
            <HabitListCard
              key={habit._id}
              habit={habit}
              index={i}
              onEdit={setEditingHabit}
              isSelected={selectedIds.includes(habit._id)}
              onToggleSelect={(id) =>
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                )
              }
            />
          ))}
        </div>
      )}

      {editingHabit && (
        <EditHabit habit={editingHabit} onClose={() => setEditingHabit(null)} />
      )}
    </div>
  );
}
