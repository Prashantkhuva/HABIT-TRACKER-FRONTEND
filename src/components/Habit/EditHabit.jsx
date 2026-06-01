import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { updateHabit } from "../../api/habits-api";
import { categoryMap } from "./categoryMap";
import Button from "../Button";
import Input from "../Input";
import { useDispatch } from "react-redux";
import { updateReduxHabit } from "../../store/habitSlice";
import { useToast } from "../Toast/ToastProvider";

function EditHabit({ habit, onClose }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(habit.title || "");
  const [category, setCategory] = useState(habit.category || "Productivity");
  const [color, setColor] = useState(habit.color || "#4F6F64");
  const [frequency, setFrequency] = useState(habit.frequency || "daily");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(habit.description || "");
  const [habitType, setHabitType] = useState(habit.type || "boolean");
  const [unit, setUnit] = useState(habit.unit || "");

  const { addToast } = useToast();

  const colors = [
    "#4F6F64",
    "#C2B280",
    "#BFD8D2",
    "#E0DED9",
    "#000",
    "#4D4465",
    "#36343A",
    "#8069bf",
  ];

  const handleUpdate = async () => {
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

    try {
      setLoading(true);

      const res = await updateHabit(habit._id, {
        title: title.trim(),
        description: description.trim(),
        frequency,
        category,
        color,
        type: habitType,
        unit: habitType === "quantity" ? unit.trim() : "",
      });

      const updated = res?.data?.data;
      if (updated) {
        dispatch(updateReduxHabit(updated));
        addToast({
          type: "success",
          title: "Updated",
          message: "Ritual updated successfully",
        });
      }

      onClose?.();
    } catch (err) {
      console.error(err);
      addToast({
        type: "error",
        title: "Update failed",
        message: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 dark:bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="
          relative w-full max-w-md max-h-[90dvh] overflow-y-auto
          rounded-[28px] p-7
          bg-[#FAFAF5] text-[#1A1A1A]
          dark:bg-[#1A1A1A] dark:text-[#E6E1E5]
          border border-[#E8E4DC] dark:border-[#2A2A2A]
        "
      >
        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-[#888888] dark:text-[#938F99] hover:opacity-70"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 font-display">
          edit ritual
        </h2>

        <div className="flex flex-col gap-6">
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
            <p className="app-label mb-3">Symbol</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(categoryMap).map(([key, Icon]) => (
                <div key={key} className="relative group">
                  <div
                    onClick={() => setCategory(key)}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200
                      ${
                        category === key
                          ? "bg-black dark:bg-[#FAFAF5] text-white dark:text-[#1A1A1A]"
                          : "bg-gray-200 dark:bg-[#2A2A2A] text-gray-600 dark:text-[#8A8A7A]"
                      }
                    `}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2 -top-9 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-wider whitespace-nowrap opacity-0 pointer-events-none translate-y-1 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 bg-[#1A1A1A] text-[#FAFAF5] dark:bg-[#FAFAF5] dark:text-[#1A1A1A] shadow-lg z-20">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLORS */}
          <div>
            <p className="app-label mb-3">Thematic Palette</p>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className="relative shrink-0 w-8 h-8 rounded-full cursor-pointer"
                  style={{ background: c }}
                >
                  {color === c && (
                    <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white scale-125" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FREQUENCY */}
          <div>
            <p className="app-label mb-3">Temporal Cadence</p>
            <div className="relative flex bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-full p-1 w-full">
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
                      layoutId="editFrequencyPill"
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
            <p className="app-label mb-3">Habit Type</p>
            <div className="relative flex flex-wrap bg-[#E8E4DC] dark:bg-[#2A2A2A] rounded-xl p-1 w-full">
              {["boolean", "streak"].map((type) => (
                <button
                  key={type}
                  onClick={() => setHabitType(type)}
                  className={`
                    relative z-10 px-3 py-2 text-xs flex-1 text-center transition-all
                    ${habitType === type ? "text-black dark:text-white font-medium" : "text-gray-500"}
                  `}
                >
                  {habitType === type && (
                    <motion.div
                      layoutId="editTypePill"
                      className="absolute inset-0 rounded-xl bg-white dark:bg-[#4A4A4A] shadow -z-10"
                    />
                  )}
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* UNIT */}
          {habitType === "quantity" && (
            <Input
              label="Measurement Unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="e.g. pages, liters, km"
            />
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handleClose}
            className="text-xs tracking-widest text-[#888888] dark:text-[#938F99] hover:opacity-70"
          >
            CANCEL
          </button>

          <Button onClick={handleUpdate}>
            {loading ? "Saving..." : "SAVE CHANGES"}
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default EditHabit;
