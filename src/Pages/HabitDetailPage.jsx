import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Trash2, Pause, Play, Archive } from "lucide-react";
import {
  completeHabit,
  getHabitLogs,
  getHabitStreak,
  deleteHabit,
  pauseHabit,
  resumeHabit,
  archiveHabit,
} from "../api/habits-api";
import { getTextColor } from "../lib/habit-utils";
import Button from "../components/Button";
import HabitCalendar from "../components/Habit/HabitCelender";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteReduxHabit } from "../store/habitSlice";

export default function HabitDetailPage() {
  const { id } = useParams();
  const habits = useSelector((state) => state.habit.habits);

  const [habit, setHabit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isDoneToday, setIsDoneToday] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (habits.length) {
      const found = habits.find((h) => h._id === id);
      setHabit(found);
    }
  }, [habits, id]);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteHabit(id);

      dispatch(deleteReduxHabit(id));

      navigate("/rituals");
    } catch (err) {
      console.error(err);
    }
  };
  const fetchData = async () => {
    try {
      const [logsRes, streakRes] = await Promise.all([
        getHabitLogs(id, 1, 30),
        getHabitStreak(id),
      ]);

      const logsData = logsRes.data.data.logs;

      setLogs(logsData);
      setStreak(streakRes.data.data.currentStreak || 0);

      const today = new Date().toDateString();
      const doneToday = logsData.some(
        (l) => l.completed && new Date(l.date).toDateString() === today,
      );

      setIsDoneToday(doneToday);
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async () => {
    if (isDoneToday) return;
    await completeHabit(id);
    fetchData();
  };

  if (!habit) return <p className="p-10">Loading...</p>;

  // 🎯 WEEKLY LOGIC
  const last7Days = logs.slice(0, 7);
  const weeklyCompleted = last7Days.filter((l) => l.completed).length;
  const weeklyTarget = 7;

  const textColor = getTextColor(habit.color);
  const isDark = textColor === "#FAFAF5";

  const btnBg = isDark ? "#FAFAF5" : "#1A1A1A";
  const btnColor = isDark ? "#1A1A1A" : "#FAFAF5";

  const subBg = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";

  const completionRate = Math.min((logs.length / 30) * 100, 100);

  return (
    <>
      <div className="p-10 grid grid-cols-3 gap-10 max-w-[1400px] mx-auto">
        {/* LEFT */}
        <div className="col-span-2 flex flex-col justify-center items-start">
          <h1 className="text-5xl font-bold mb-8">{habit.title}</h1>

          {/* 🔥 CARD */}
          <div
            className="relative aspect-square w-full max-w-162.5 rounded-[40px] flex flex-col items-center justify-center shadow-lg"
            style={{ background: habit.color }}
          >
            {/* NUMBER */}
            <h1
              className="text-[400px] mt-25 font-normal leading-none text-center"
              style={{
                color: textColor,
                fontFamily: "Epilogue, sans-serif",
              }}
            >
              {weeklyCompleted}
            </h1>

            {/* TEXT */}
            <p
              className="mt-2 text-sm tracking-widest opacity-80"
              style={{ color: textColor }}
            >
              {weeklyCompleted} of {weeklyTarget} this week
            </p>

            {/* STREAK */}
            <div
              className="mt-6 px-5 py-2 rounded-full text-sm font-medium"
              style={{
                background: subBg,
                color: textColor,
              }}
            >
              {streak > 0 ? `🔥 ${streak} day streak` : "Start your streak 🚀"}
            </div>

            {/* BUTTON */}
            <AnimatePresence mode="wait">
              <motion.button
                key={isDoneToday ? "done" : "plus"}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleComplete}
                className="absolute right-30 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: btnBg,
                  color: btnColor,
                }}
              >
                {isDoneToday ? <Check size={28} /> : <Plus size={28} />}
              </motion.button>
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-8 flex-wrap">
            <Button
              variant="ghost"
              color="red"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={16} />
              Delete
            </Button>

            <Button variant="ghost" color="gray" onClick={() => pauseHabit(id)}>
              <Pause size={16} />
              Pause
            </Button>

            <Button
              variant="ghost"
              color="green"
              onClick={() => resumeHabit(id)}
            >
              <Play size={16} />
              Resume
            </Button>

            <Button
              variant="ghost"
              color="default"
              onClick={() => archiveHabit(id)}
            >
              <Archive size={16} />
              Archive
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#F7F7F7] p-8 rounded-[32px] flex flex-col gap-6 h-fit">
          <h2 className="font-semibold text-lg">History</h2>

          {/* 🔥 CALENDAR */}
          <HabitCalendar logs={logs} />

          {/* COMPLETION */}
          <div>
            <p className="text-sm mb-2">Completion Rate</p>

            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-[#4F6F64]"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold">
              {completionRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-[320px] shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Delete habit?</h2>

            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              {/* Cancel */}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full text-sm bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              {/* Delete */}
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-full text-sm bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
