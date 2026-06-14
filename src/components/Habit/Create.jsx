"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import { createHabit } from "../../api/habits-api";

import { useRouter } from "next/navigation";
import { categoryMap } from "./categoryMap";
import Button from "../Button";
import Input from "../Input";
import { useDispatch, useSelector } from "react-redux";
import { addReduxHabit } from "../../store/habitSlice";
import { useToast } from "../Toast/ToastProvider";

function Create({ onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const habits = useSelector((state) => state.habit.habits);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Productivity");
  const [color, setColor] = useState("#4F6F64");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [habitType, setHabitType] = useState("boolean");
  const [unit, setUnit] = useState("");

  const { addToast } = useToast();

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const colors = [
    "#4F6F64",
    "#C2B280",
    "#8069bf",
    "#D4BB06",
    "#B7B7A5",
    "#36343A",
  ];
  const [customPickerOpen, setCustomPickerOpen] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      addToast({
        type: "error",
        title: "Missing title",
        message: "Please enter a habit name",
      });
      return;
    }

    if (habitType === "quantity" && !unit.trim()) {
      addToast({
        type: "error",
        title: "Missing unit",
        message: "Please enter a measurement unit",
      });
      return;
    }

    const isDuplicate = habits.some(
      (h) => h.title.toLowerCase() === title.trim().toLowerCase(),
    );

    if (isDuplicate) {
      addToast({
        type: "error",
        title: "Duplicate title",
        message: "A ritual with this name already exists",
      });
      return;
    }

    try {
      setLoading(true);

      const createdHabit = await createHabit({
        title: title.trim(),
        description: description.trim(),
        frequency,
        category,
        color,
        type: habitType,
        unit: habitType === "quantity" ? unit.trim() : "",
      });

      const newHabit = createdHabit?.data?.data;

      if (newHabit) {
        dispatch(addReduxHabit(newHabit));
        addToast({
          type: "success",
          title: "Habit created",
          message: `${title} added successfully`,
        });
      }

      onClose?.();
      router.push("/dashboard");
    } catch (err) {
      addToast({
        type: "error",
        title: "Creation failed",
        message: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
    router.push("/dashboard");
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={isMobile ? { y: "100%" } : { scale: 0.96, opacity: 0 }}
        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="
          w-full h-[100dvh]
          sm:w-[680px] sm:h-[90dvh]
          bg-[#F5F3EE] dark:bg-[#0E0E0E]
          max-sm:rounded-none sm:rounded-[32px]
          overflow-hidden
          flex flex-col sm:flex-row
          shadow-2xl relative
        "
      >
        {/* MOBILE HEADER */}
        <div className="sm:hidden w-full h-16 bg-[#1A1A1A] text-white px-6 flex justify-between items-center shrink-0 pt-[env(safe-area-inset-top)]">
          <h1 className="text-lg font-semibold">new habit</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-400">RITUAL V1.0</span>
            <button
              onClick={handleClose}
              className="p-1 bg-white/10 rounded-full"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* DESKTOP SIDEBAR */}
        <div className="hidden sm:flex w-[30%] bg-[#1A1A1A] text-white p-10 flex-col justify-between shrink-0">
          <h1 className="text-3xl leading-snug">
            design <br />
            your <br />
            daily <br />
            rhythm.
          </h1>
          <p className="text-xs text-gray-400">RITUAL V1.0</p>
        </div>

        {/* RIGHT PANEL — flex-col wrapper */}
        <div className="w-full sm:w-[70%] flex flex-col flex-1 overflow-hidden">
          {/* SCROLLABLE CONTENT */}
          <div
            className="
              flex-1
              overflow-y-auto
              overflow-x-hidden
              px-6 py-6
              sm:p-12 sm:pb-6
              flex flex-col gap-8
              custom-scroll
            "
          >
            {/* DESKTOP CLOSE */}
            <div className="hidden sm:block">
              <button
                onClick={handleClose}
                className="
                  absolute right-6 top-6 z-10
                  p-2 rounded-full
                  transition-colors
                  hover:bg-black/5 dark:hover:bg-white/10
                  text-[#1A1A1A] dark:text-[#FAFAF5]
                "
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#FAFAF5]">
                new habit
              </h2>
            </div>

            <Input
              label="Habit Identity"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. morning meditation"
            />

            <Input
              label="Ritual Intention"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. read 10 pages every night"
            />

            {/* CATEGORY */}
            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">Symbol</p>
              <div className="flex flex-wrap gap-4">
                {Object.entries(categoryMap).map(([key, Icon]) => (
                  <div key={key} className="relative group">
                    <div
                      onClick={() => setCategory(key)}
                      className={`
                        w-12 h-12 rounded-full
                        flex items-center justify-center
                        cursor-pointer transition-all duration-200
                        hover:scale-105
                        ${
                          category === key
                            ? "bg-black dark:bg-[#FAFAF5] text-white dark:text-[#1A1A1A]"
                            : "bg-gray-200 dark:bg-[#2A2A2A] text-gray-600 dark:text-[#8A8A7A]"
                        }
                      `}
                    >
                      <Icon size={18} />
                    </div>
                    <div
                      className="
                        absolute left-1/2 -translate-x-1/2 -top-10
                        px-3 py-1.5 rounded-full
                        text-[10px] uppercase tracking-wider whitespace-nowrap
                        opacity-0 pointer-events-none
                        translate-y-1 group-hover:translate-y-0 group-hover:opacity-100
                        transition-all duration-200
                        bg-[#1A1A1A] text-[#FAFAF5]
                        dark:bg-[#FAFAF5] dark:text-[#1A1A1A]
                        shadow-lg z-20
                      "
                    >
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLORS */}
            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">
                Thematic Palette
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => { setColor(c); setCustomPickerOpen(false); }}
                    className="relative shrink-0 w-10 h-10 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                    style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}, 0 0 20px ${c}40` : '0 2px 8px rgba(0,0,0,0.08)' }}
                  >
                    {color === c && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-white/80 dark:border-[#1A1A1A]/80 scale-[1.3]" />
                        <div className="absolute inset-0 rounded-full border border-white dark:border-[#1A1A1A] scale-[1.15]" />
                      </>
                    )}
                  </button>
                ))}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCustomPickerOpen(!customPickerOpen)}
                    className="relative shrink-0 w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95 overflow-hidden"
                    style={{
                      background: colors.includes(color) ? 'transparent' : color,
                      border: `2px dashed ${colors.includes(color) ? '#888' : color}`,
                    }}
                  >
                    <span className={`text-lg font-light ${colors.includes(color) ? 'text-gray-400 dark:text-gray-500' : 'text-white'}`}>
                      +
                    </span>
                    {!colors.includes(color) && (
                      <>
                        <div className="absolute inset-0 rounded-full border-2 border-white/80 dark:border-[#1A1A1A]/80 scale-[1.3]" />
                        <div className="absolute inset-0 rounded-full border border-white dark:border-[#1A1A1A] scale-[1.15]" />
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {customPickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full mt-4 z-20 right-0 p-5 rounded-2xl bg-surface border border-border-subtle/60 shadow-2xl backdrop-blur-xl"
                      >
                        <div className="absolute -top-1.5 right-6 w-3 h-3 rotate-45 bg-surface border-l border-t border-border-subtle/60" />

                        <div className="relative flex flex-col items-center gap-4">
                          <div className="w-full max-w-[calc(90vw-48px)] sm:w-56">
                            <HexColorPicker
                              color={color}
                              onChange={setColor}
                              style={{ width: '100%', height: 172 }}
                            />
                          </div>

                          <div className="flex items-center gap-3 w-full pt-1">
                            <div className="w-9 h-9 rounded-xl shrink-0 border border-border-subtle/40 shadow-sm" style={{ background: color }} />
                            <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl bg-background/50 border border-border-subtle/30">
                              <span className="text-[10px] font-bold tracking-widest text-text-muted/70">#</span>
                              <input
                                type="text"
                                value={color.replace('#', '').toUpperCase()}
                                onChange={(e) => {
                                  const raw = e.target.value.replace('#', '');
                                  if (/^[0-9A-Fa-f]{0,6}$/.test(raw)) setColor('#' + raw.toUpperCase());
                                }}
                                className="flex-1 bg-transparent text-xs font-mono font-bold text-text-primary outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* FREQUENCY */}
            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">
                Temporal Cadence
              </p>
              <div className="relative flex bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-full p-1 w-full sm:w-fit">
                {["daily", "weekly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`
                      relative z-10 px-5 py-2 text-sm flex-1 text-center transition-all
                      ${frequency === freq ? "text-black dark:text-white font-medium" : "text-gray-500"}
                    `}
                  >
                    {frequency === freq && (
                      <motion.div
                        layoutId="frequencyPill"
                        className="absolute inset-0 rounded-full bg-white dark:bg-[#4A4A4A] shadow -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                      />
                    )}
                    {freq.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* HABIT TYPE */}
            <div>
              <p className="text-xs text-gray-400 uppercase mb-3">Habit Type</p>
              <div className="relative flex flex-wrap bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-2xl sm:rounded-full p-1 w-full sm:w-fit">
                {["boolean", "streak"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setHabitType(type)}
                    className={`
                      relative z-10 px-3 sm:px-5 py-2 text-xs flex-1 text-center transition-all
                      ${habitType === type ? "text-black dark:text-white font-medium" : "text-gray-500"}
                    `}
                  >
                    {habitType === type && (
                      <motion.div
                        layoutId="habitTypePill"
                        className="absolute inset-0 rounded-full bg-white dark:bg-[#4A4A4A] shadow -z-10"
                      />
                    )}
                    {type.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {habitType === "quantity" && (
              <Input
                label="Measurement Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. pages, liters, km"
              />
            )}
          </div>

          {/* FOOTER — always pinned at bottom */}
          <div
            className="
              shrink-0
              flex justify-end items-center gap-4
              px-6 py-4 sm:px-12 sm:py-5
              pb-[calc(0.5rem+env(safe-area-inset-bottom))]
              bg-[#F5F3EE] dark:bg-[#0E0E0E]
              border-t border-black/5 dark:border-white/5
            "
          >
            <button
              onClick={handleClose}
              className="hidden sm:block text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Cancel
            </button>

            <Button
              variant="primary"
              onClick={handleCreate}
              className="w-full sm:w-auto"
            >
              {loading ? "Creating..." : "CREATE HABIT"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default Create;
