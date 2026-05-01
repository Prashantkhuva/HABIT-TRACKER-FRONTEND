import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { createHabit } from "../../api/habits-api";
import { useNavigate } from "react-router-dom";
import { categoryMap } from "./categoryMap";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { addReduxHabit } from "../../store/habitSlice";
import { useToast } from "../Toast/ToastProvider";

function Create({ onClose }) {
  const navigate = useNavigate();
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const colors = ["#4F6F64", "#C2B280", "#BFD8D2", "#E0DED9", "#000", "#4D4465", "#36343A", "#8069bf"];

  const handleCreate = async () => {
    if (!title.trim()) {
      addToast({
        type: "error",
        title: "Missing title",
        message: "Please enter a habit name",
      });
      return; // ⛔ yaha ruk jayega
    }

    const isDuplicate = habits.some(
      (h) => h.title.toLowerCase() === title.trim().toLowerCase()
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
        title,
        description,
        frequency,
        category,
        color,
        type: habitType,
      });

      const newHabit = createdHabit?.data?.data;

      if (newHabit) {
        dispatch(addReduxHabit(newHabit));

        // ✅ SUCCESS TOAST
        addToast({
          type: "success",
          title: "Habit created",
          message: `${title} added successfully`,
        });
      }

      onClose?.();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);

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
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={isMobile ? { y: "100%" } : { scale: 0.9, opacity: 0, y: 50 }}
        animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="w-full max-sm:h-full sm:w-170 sm:h-180 bg-[#F5F3EE] dark:bg-[#0E0E0E] max-sm:rounded-none sm:rounded-4xl overflow-hidden flex flex-col sm:flex-row shadow-2xl relative"
      >
        {/* MOBILE HEADER */}
        <div className="sm:hidden w-full h-15 bg-[#1A1A1A] text-white px-6 flex justify-between items-center shrink-0">
          <h1 className="text-lg font-semibold">new habit</h1>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-400">RITUAL V1.0</span>
            <button onClick={handleClose} className="p-1 bg-white/10 rounded-full">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* DESKTOP SIDEBAR */}
        <div className="max-sm:hidden w-[30%] bg-[#1A1A1A] text-white p-10 flex flex-col justify-between shrink-0">
          <h1 className="text-3xl leading-snug">
            design <br /> your <br /> daily <br /> rhythm.
          </h1>
          <p className="text-xs text-gray-400">RITUAL V1.0</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full sm:w-[70%] max-sm:px-6 max-sm:py-6 max-sm:pb-32 sm:p-12 relative flex flex-col gap-8 overflow-y-auto custom-scroll flex-1">
          {/* DESKTOP CLOSE & TITLE */}
          <div className="max-sm:hidden">
            <button onClick={handleClose} className="absolute right-6 top-6 z-10 p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-[#1A1A1A] dark:text-[#FAFAF5]">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#FAFAF5]">new habit</h2>
          </div>

          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 uppercase">Habit Identity</p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. morning meditation"
              className="w-full border-b border-gray-300 dark:border-[#2A2A2A] bg-transparent outline-none py-2 text-sm text-[#1A1A1A] dark:text-[#FAFAF5]"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 uppercase">RITUAL INTENTION</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. read 10 pages every night"
              className="w-full border-b border-gray-300 dark:border-[#2A2A2A] bg-transparent outline-none py-2 text-sm text-[#1A1A1A] dark:text-[#FAFAF5]"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">Symbol</p>

            <div className="flex flex-wrap gap-4">

              {Object.entries(categoryMap).map(([key, Icon]) => (
                <div key={key} className="relative group">
                  <div
                    onClick={() => setCategory(key)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition
                      ${category === key ? "bg-black dark:bg-[#FAFAF5] text-white dark:text-[#1A1A1A]" : "bg-gray-200 dark:bg-[#2A2A2A] text-gray-600 dark:text-[#8A8A7A]"}`}
                  >
                    <Icon size={18} />
                  </div>

                  {/* TOOLTIP */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                    px-3 py-1 text-xs rounded-full bg-black text-white 
                    opacity-0 group-hover:opacity-100 
                    translate-y-1 group-hover:translate-y-0
                    transition-all duration-200 pointer-events-none whitespace-nowrap"
                  >
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">
              Thematic Palette
            </p>

            <div className="flex flex-wrap gap-4">

              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className="relative shrink-0 max-sm:w-10 max-sm:h-10 sm:w-8 sm:h-8 rounded-full cursor-pointer"
                  style={{ background: c }}
                >

                  {color === c && (
                    <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white scale-125" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 TEMPORAL CADENCE */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">
              Temporal Cadence
            </p>

            <div className="relative flex bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-full p-1 max-sm:w-full sm:w-fit">
              {["daily", "weekly"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`relative z-10 px-5 py-2 text-sm transition-all max-sm:flex-1 text-center ${frequency === freq ? "text-black dark:text-white font-medium" : "text-gray-500"
                    }`}
                >
                  {frequency === freq && (
                    <motion.div
                      layoutId="frequencyPill"
                      className="absolute inset-0 rounded-full bg-white dark:bg-[#4A4A4A] shadow -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {freq.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">Habit Type</p>
            <div className="relative flex flex-wrap bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-2xl sm:rounded-full p-1 max-sm:w-full sm:w-fit">

              {["boolean", "streak", "quantity"].map((type) => (
                <button
                  key={type}
                  onClick={() => setHabitType(type)}
                  className={`relative z-10 px-2 sm:px-5 py-2 text-[11px] sm:text-xs transition-all max-sm:flex-1 sm:w-22.5 text-center ${habitType === type ? "text-black dark:text-white font-medium" : "text-gray-500"
                    }`}
                >
                  {habitType === type && (
                    <motion.div
                      layoutId="habitTypePill"
                      className="absolute inset-0 rounded-full bg-white dark:bg-[#4A4A4A] shadow -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Type Description */}
          <div className="rounded-2xl p-4 bg-[#EEEAE0] dark:bg-[#1A1A1A]">
            {habitType === "boolean" && (
              <p className="text-xs" style={{ color: "#6A6A5A" }}>
                ✓ &nbsp; Simple yes/no habit — mark complete each day
              </p>
            )}
            {habitType === "streak" && (
              <p className="text-xs" style={{ color: "#6A6A5A" }}>
                🔥 &nbsp; Track consecutive days — streak grows with consistency
              </p>
            )}
            {habitType === "quantity" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs" style={{ color: "#6A6A5A" }}>
                  📊 &nbsp; Track a daily amount — water, pages, minutes, km
                </p>
                <input
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="unit e.g. liters, pages, minutes"
                  className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-xs"
                />
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="max-sm:fixed max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:p-6 max-sm:bg-linear-to-t max-sm:from-[#F5F3EE] dark:max-sm:from-[#0E0E0E] max-sm:via-[#F5F3EE] dark:max-sm:via-[#0E0E0E] max-sm:to-transparent sm:mt-auto flex justify-end gap-6 z-20">
            <button onClick={handleClose} className="max-sm:hidden text-gray-500">
              Cancel
            </button>

            <Button variant="primary" onClick={handleCreate} className="max-sm:w-full">
              {loading ? "Creating..." : "CREATE HABIT"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Create;
