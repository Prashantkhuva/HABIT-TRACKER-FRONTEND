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
import { useToast } from "../components/Toast/ToastProvider";
import ConfirmModal from "../components/ConfirmModal";

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
  const { addToast } = useToast();

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

      addToast({
        type: "success",
        title: "Habit deleted",
        message: `${habit.title} removed successfully`,
      });

      navigate("/rituals");
    } catch (err) {
      addToast({
        type: "error",
        title: "Delete failed",
        message: "Could not delete habit",
      });
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
    if (isDoneToday) {
      addToast({
        type: "error",
        title: "Already done",
        message: "You already completed this today",
      });
      return;
    }

    try {
      await completeHabit(id);
      await fetchData();

      addToast({
        type: "success",
        title: "Ritual completed",
        message: `${habit.title} done for today`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not complete habit",
      });
    }
  };

  const handlePause = async () => {
    try {
      await pauseHabit(id);

      addToast({
        type: "success",
        title: "Habit paused",
        message: `${habit.title} is now paused`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not pause habit",
      });
    }
  };

  const handleResume = async () => {
    try {
      await resumeHabit(id);

      addToast({
        type: "success",
        title: "Habit resumed",
        message: `${habit.title} is active again`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not resume habit",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveHabit(id);

      addToast({
        type: "success",
        title: "Habit archived",
        message: `${habit.title} moved to archive`,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not archive habit",
      });
    }
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
      <div className="p-4 sm:p-10 flex flex-col lg:grid lg:grid-cols-3 gap-10 w-full max-w-[1400px] mx-auto">
        {/* LEFT */}
        <div className="col-span-2 flex flex-col justify-center items-start">
          <h1 className="text-3xl sm:text-5xl font-bold mb-8 text-[#1A1A1A] dark:text-[#E6E1E5]">{habit.title}</h1>

          {/* 🔥 CARD */}
          <div
            className="relative aspect-square w-full max-w-162.5 rounded-[40px] flex flex-col items-center justify-center shadow-lg"
            style={{ background: habit.color }}
          >
            {/* NUMBER */}
            <h1
              className="text-[150px] sm:text-[400px] mt-10 sm:mt-25 font-normal leading-none text-center"
              style={{
                color: textColor,
                fontFamily: "Epilogue, sans-serif",
              }}
            >
              {weeklyCompleted}
            </h1>

            {/* TEXT */}
            <p
              className="mt-2 text-xs sm:text-sm tracking-widest opacity-80"
              style={{ color: textColor }}
            >
              {weeklyCompleted} of {weeklyTarget} this week
            </p>

            {/* STREAK */}
            <div
              className="mt-6 px-5 py-2 rounded-full text-xs sm:text-sm font-medium"
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
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl"
                style={{
                  background: btnBg,
                  color: btnColor,
                }}
              >
                {isDoneToday ? <Check size={24} className="sm:w-7 sm:h-7" /> : <Plus size={24} className="sm:w-7 sm:h-7" />}
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

            <Button variant="ghost" color="gray" onClick={handlePause}>
              <Pause size={16} />
              Pause
            </Button>

            <Button variant="ghost" color="green" onClick={handleResume}>
              <Play size={16} />
              Resume
            </Button>

            <Button variant="ghost" color="default" onClick={handleArchive}>
              <Archive size={16} />
              Archive
            </Button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-[#F4F4EF] dark:bg-[#1D1B20] border border-[#E8E4DC] dark:border-[#49454F] p-8 rounded-4xl flex flex-col gap-6 h-fit">
          <h2 className="font-semibold text-lg text-[#1A1A1A] dark:text-[#E6E1E5]">History</h2>

          {/* 🔥 CALENDAR */}
          <HabitCalendar logs={logs} />

          {/* COMPLETION */}
          <div>
            <p className="text-sm mb-2 text-[#888888] dark:text-[#938F99]">Completion Rate</p>

            <div className="w-full h-2 bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-full overflow-hidden">
              <div
                className="h-2 bg-[#1A1A1A] dark:bg-[#D0BCFF]"
                style={{ width: `${completionRate}%` }}
              />
            </div>

            <p className="mt-2 text-sm font-semibold text-[#1A1A1A] dark:text-[#E6E1E5]">
              {completionRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete habit?"
        description="This action cannot be undone."
        confirmText="DELETE"
      />
    </>
  );
}
