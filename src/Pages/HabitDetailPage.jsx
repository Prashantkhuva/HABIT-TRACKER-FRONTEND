import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";

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

import { getTextColor, isLogFromToday } from "../lib/habit-utils";

import Button from "../components/Button";

import HabitCalendar from "../components/Habit/HabitCelender";

import ConfirmModal from "../components/ConfirmModal";

import ReflectionModal from "../components/Habit/ReflectionModal";

import { deleteReduxHabit } from "../store/habitSlice";

import { useToast } from "../components/Toast/ToastProvider";

export default function HabitDetailPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { addToast } = useToast();

  const habits = useSelector((state) => state.habit.habits);

  const [habit, setHabit] = useState(null);

  const [logs, setLogs] = useState([]);

  const [streak, setStreak] = useState(0);

  const [isDoneToday, setIsDoneToday] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [reflectionOpen, setReflectionOpen] = useState(false);

  const [selectedHabit, setSelectedHabit] = useState(null);

  const [completing, setCompleting] = useState(false);

  /* --------------------------------------------- */
  /* FIND HABIT */
  /* --------------------------------------------- */

  useEffect(() => {
    if (habits.length) {
      const found = habits.find((h) => h._id === id);

      setHabit(found);
    }
  }, [habits, id]);

  /* --------------------------------------------- */
  /* FETCH */
  /* --------------------------------------------- */

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [logsRes, streakRes] = await Promise.all([
        getHabitLogs(id, 1, 30),
        getHabitStreak(id),
      ]);

      const logsData = logsRes.data.data.logs || [];

      setLogs(logsData);

      setStreak(streakRes.data.data.currentStreak || 0);

      const doneToday = logsData.some(
        (l) => l.completed && isLogFromToday(l),
      );

      setIsDoneToday(doneToday);
    } catch (err) {
      console.error(err);
    }
  };

  /* --------------------------------------------- */
  /* COMPLETE */
  /* --------------------------------------------- */

  const handleComplete = (habit) => {
    if (completing || isDoneToday) return;

    setSelectedHabit(habit);

    setReflectionOpen(true);
  };

  const handleSaveReflection = async (note = "") => {
    try {
      setCompleting(true);

      await completeHabit(id, note);

      await fetchData();

      addToast({
        type: "success",
        title: "Ritual completed",
        message: `${habit.title} done for today`,
      });

      setReflectionOpen(false);

      setSelectedHabit(null);
    } catch (err) {
      console.error(err);

      addToast({
        type: "error",
        title: "Failed",
        message: "Could not complete habit",
      });
    } finally {
      setCompleting(false);
    }
  };

  /* --------------------------------------------- */
  /* DELETE */
  /* --------------------------------------------- */

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

  /* --------------------------------------------- */
  /* PAUSE */
  /* --------------------------------------------- */

  const handlePause = async () => {
    try {
      await pauseHabit(id);

      addToast({
        type: "success",
        title: "Habit paused",
        message: `${habit.title} is now paused`,
      });

      await fetchData();
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not pause habit",
      });
    }
  };

  /* --------------------------------------------- */
  /* RESUME */
  /* --------------------------------------------- */

  const handleResume = async () => {
    try {
      await resumeHabit(id);

      addToast({
        type: "success",
        title: "Habit resumed",
        message: `${habit.title} is active again`,
      });

      await fetchData();
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not resume habit",
      });
    }
  };

  /* --------------------------------------------- */
  /* ARCHIVE */
  /* --------------------------------------------- */

  const handleArchive = async () => {
    try {
      await archiveHabit(id);

      addToast({
        type: "success",
        title: "Habit archived",
        message: `${habit.title} moved to archive`,
      });

      await fetchData();
    } catch (err) {
      addToast({
        type: "error",
        title: "Failed",
        message: "Could not archive habit",
      });
    }
  };

  /* --------------------------------------------- */
  /* LOADING */
  /* --------------------------------------------- */

  if (!habit) {
    return <p className="p-10">Loading...</p>;
  }

  /* --------------------------------------------- */
  /* STATS */
  /* --------------------------------------------- */

  const last7Days = logs.slice(0, 7);

  const weeklyCompleted = last7Days.filter((l) => l.completed).length;

  const weeklyTarget = 7;

  const textColor = getTextColor(habit.color);

  const isDark = textColor === "#FAFAF5";

  const btnBg = isDark ? "#FAFAF5" : "#1A1A1A";

  const btnColor = isDark ? "#1A1A1A" : "#FAFAF5";

  const subBg = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)";

  const completedLogs = logs.filter((l) => l.completed);

  const completionRate = Math.min((completedLogs.length / 30) * 100, 100);

  const reflectionLogs = logs
    .filter((log) => log.note && log.note.trim() !== "")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <>
      <div
        className="
          p-4
          sm:p-10

          flex
          flex-col

          lg:grid
          lg:grid-cols-3

          gap-10

          w-full
          max-w-[1400px]

          mx-auto
        "
      >
        {/* LEFT */}
        <div className="col-span-2 flex flex-col justify-center items-start">
          {/* TITLE */}
          <h1
            className="
              text-3xl
              sm:text-5xl

              font-bold

              mb-8

              text-[#1A1A1A]
              dark:text-[#E6E1E5]
            "
            style={{
              fontFamily: "Epilogue, sans-serif",
            }}
          >
            {habit.title}
          </h1>

          {/* HERO CARD */}
          <div
            className="
              relative

              aspect-square

              w-full
              max-w-[650px]

              rounded-[40px]

              flex
              flex-col

              items-center
              justify-center

              overflow-hidden

              shadow-[0_20px_80px_rgba(0,0,0,0.15)]
            "
            style={{
              background: habit.color,
            }}
          >
            {/* GLOW */}
            <div
              className="
                absolute
                -top-20
                -right-20

                w-60
                h-60

                rounded-full

                bg-white/10

                blur-3xl
              "
            />

            {/* GRID */}
            <div
              className="
                absolute inset-0 opacity-[0.04]

                [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]

                [background-size:32px_32px]
              "
            />

            {/* NUMBER */}
            <h1
              className="
                relative

                text-[150px]
                sm:text-[400px]

                mt-10
                sm:mt-20

                font-normal
                leading-none

                text-center
              "
              style={{
                color: textColor,
                fontFamily: "Epilogue, sans-serif",
              }}
            >
              {weeklyCompleted}
            </h1>

            {/* TEXT */}
            <p
              className="
                relative

                mt-2

                text-xs
                sm:text-sm

                tracking-[0.25em]

                uppercase

                opacity-80
              "
              style={{
                color: textColor,
              }}
            >
              {weeklyCompleted} of {weeklyTarget} this week
            </p>

            {/* STREAK */}
            <div
              className="
                relative

                mt-6

                px-5
                py-2

                rounded-full

                text-xs
                sm:text-sm

                font-medium
              "
              style={{
                background: subBg,
                color: textColor,
              }}
            >
              {streak > 0
                ? `${streak} day streak`
                : "Complete today to begin your streak"}
            </div>

            {/* COMPLETE BUTTON */}
            <AnimatePresence mode="wait">
              <motion.button
                disabled={completing}
                key={isDoneToday ? "done" : "plus"}
                initial={{
                  scale: 0,
                  rotate: -180,
                }}
                animate={{
                  scale: 1,
                  rotate: 0,
                }}
                exit={{
                  scale: 0,
                  rotate: 180,
                }}
                whileTap={{
                  scale: 0.9,
                }}
                onClick={() => handleComplete(habit)}
                className={`
                  absolute

                  right-4
                  sm:right-10

                  top-1/2
                  -translate-y-1/2

                  w-12
                  h-12

                  sm:w-16
                  sm:h-16

                  rounded-full

                  flex
                  items-center
                  justify-center

                  shadow-xl

                  transition-opacity

                  ${completing ? "pointer-events-none opacity-60" : ""}
                `}
                style={{
                  background: btnBg,
                  color: btnColor,
                }}
              >
                {isDoneToday ? (
                  <Check size={24} className="sm:w-7 sm:h-7" />
                ) : (
                  <Plus size={24} className="sm:w-7 sm:h-7" />
                )}
              </motion.button>
            </AnimatePresence>
          </div>

          {/* ACTIONS */}
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
        <div
          className="
            bg-[#F4F4EF]
            dark:bg-[#1D1B20]

            border
            border-[#E8E4DC]
            dark:border-[#49454F]

            p-8

            rounded-[32px]

            flex
            flex-col
            gap-8

            h-fit
          "
        >
          {/* HEADER */}
          <div>
            <p
              className="
                text-[11px]
                uppercase
                tracking-[0.25em]

                text-[#888888]
                dark:text-[#938F99]
              "
            >
              Ritual Archive
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-bold

                text-[#1A1A1A]
                dark:text-[#E6E1E5]
              "
              style={{
                fontFamily: "Epilogue, sans-serif",
              }}
            >
              History & Reflections
            </h2>
          </div>

          {/* CALENDAR */}
          <HabitCalendar logs={logs} />

          {/* COMPLETION */}
          <div>
            <div className="flex justify-between mb-3">
              <p className="text-sm text-[#888888] dark:text-[#938F99]">
                Completion Rate
              </p>

              <p
                className="
                  text-sm
                  font-semibold

                  text-[#1A1A1A]
                  dark:text-[#E6E1E5]
                "
              >
                {completionRate.toFixed(0)}%
              </p>
            </div>

            <div
              className="
                w-full
                h-2.5

                rounded-full

                overflow-hidden

                bg-[#E8E4DC]
                dark:bg-[#2A2A2A]
              "
            >
              <motion.div
                initial={{
                  width: 0,
                }}
                animate={{
                  width: `${completionRate}%`,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                }}
                className="
                  h-full

                  rounded-full

                  bg-[#1A1A1A]
                  dark:bg-[#D0BCFF]
                "
              />
            </div>
          </div>

          {/* NOTES */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="
                  text-sm
                  font-semibold

                  uppercase
                  tracking-[0.18em]

                  text-[#1A1A1A]
                  dark:text-[#E6E1E5]
                "
              >
                Session Notes
              </h3>

              <span
                className="
                  text-[11px]

                  text-[#888888]
                  dark:text-[#938F99]
                "
              >
                {reflectionLogs.length} saved
              </span>
            </div>

            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
              {reflectionLogs.length === 0 ? (
                <div
                  className="
                    rounded-2xl

                    border
                    border-dashed

                    border-[#D6D1C7]
                    dark:border-[#3A3640]

                    p-6

                    text-center
                  "
                >
                  <p className="text-sm text-[#888888] dark:text-[#938F99]">
                    No reflections yet.
                  </p>

                  <p className="mt-2 text-xs text-[#AAAAAA] dark:text-[#666666]">
                    Complete a ritual and save your thoughts.
                  </p>
                </div>
              ) : (
                reflectionLogs.map((log) => (
                  <motion.div
                    key={log._id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                        rounded-2xl

                        border
                        border-[#E8E4DC]
                        dark:border-[#2A2A2A]

                        border-l-4
                        border-l-[#48645E]
                        dark:border-l-[#D0BCFF]

                        bg-white/70
                        dark:bg-[#141218]

                        p-4
                      "
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p
                          className="
                              text-[11px]

                              uppercase
                              tracking-[0.15em]

                              text-[#888888]
                              dark:text-[#938F99]
                            "
                        >
                          {new Date(log.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>

                        <p
                          className="
                              mt-1

                              text-[10px]

                              text-[#AAAAAA]
                              dark:text-[#666666]
                            "
                        >
                          {log.completedAt
                            ? new Date(log.completedAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )
                            : ""}
                        </p>
                      </div>

                      {log.completed && (
                        <div
                          className="
                              w-2.5
                              h-2.5

                              rounded-full

                              bg-[#48645E]
                              dark:bg-[#D0BCFF]
                            "
                        />
                      )}
                    </div>

                    <p
                      className="
                          text-sm
                          leading-relaxed
                          break-words

                          text-[#1A1A1A]
                          dark:text-[#FAFAF5]
                        "
                    >
                      {log.note}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DELETE MODAL */}
      <ConfirmModal
        open={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete habit?"
        description="This action cannot be undone."
        confirmText="DELETE"
      />

      {/* REFLECTION MODAL */}
      <ReflectionModal
        open={reflectionOpen}
        habit={selectedHabit}
        onClose={() => {
          setReflectionOpen(false);

          setSelectedHabit(null);
        }}
        onSkip={() => handleSaveReflection("")}
        onSave={handleSaveReflection}
      />
    </>
  );
}
