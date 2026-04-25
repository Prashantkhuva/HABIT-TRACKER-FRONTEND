import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { createHabit } from "../../api/habits-api";
import { useNavigate } from "react-router-dom";
import { categoryMap } from "./categoryMap";
import Button from "../Button";
import { useDispatch } from "react-redux";
import { addReduxHabit } from "../../store/habitSlice";

function Create({ onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Productivity");
  const [color, setColor] = useState("#4F6F64");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");

  const colors = ["#4F6F64", "#C2B280", "#BFD8D2", "#E0DED9", "#000"];

  const handleCreate = async () => {
    if (!title.trim()) return alert("Enter habit name");

    try {
      setLoading(true);

      const createdHabit = await createHabit({
        title,
        description,
        frequency,
        category,
        color,
      });

      const newHabit = createdHabit?.data?.data;

      if (newHabit) {
        dispatch(addReduxHabit(newHabit));
      }

      onClose?.();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-170 h-180 rounded-4xl overflow-hidden flex"
      >
        {/* LEFT PANEL */}
        <div className="w-[30%] bg-[#1A1A1A] text-white p-10 flex flex-col justify-between">
          <h1 className="text-3xl leading-snug">
            design <br /> your <br /> daily <br /> rhythm.
          </h1>

          <p className="text-xs text-gray-400">RITUAL V1.0</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-[70%] bg-[#F5F3EE] p-12 relative flex flex-col gap-8">
          {/* CLOSE */}
          <button onClick={handleClose} className="absolute right-6 top-6">
            <X />
          </button>

          <h2 className="text-2xl font-semibold">new habit</h2>

          {/* TITLE */}
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 uppercase">Habit Identity</p>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. morning meditation"
              className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-sm"
            />
          </div>

          {/* DESCRIPTION */}

          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400 uppercase">RITUAL INTENTION</p>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. read 10 pages every night"
              className="w-full border-b border-gray-300 bg-transparent outline-none py-2 text-sm"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-xs text-gray-400 uppercase mb-3">Symbol</p>

            <div className="flex gap-4">
              {Object.entries(categoryMap).map(([key, Icon]) => (
                <div key={key} className="relative group">
                  <div
                    onClick={() => setCategory(key)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition
                      ${category === key ? "bg-black text-white" : "bg-gray-200"}`}
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

            <div className="flex gap-4">
              {colors.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className="relative w-8 h-8 rounded-full cursor-pointer"
                  style={{ background: c }}
                >
                  {color === c && (
                    <div className="absolute inset-0 rounded-full border-2 border-black scale-125" />
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

            <div className="relative flex bg-[#E8E4DC] rounded-full p-1 w-fit">
              {/* 🔥 Animated Background Pill */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-1 bottom-1 rounded-full bg-white shadow"
                style={{
                  width: frequency === "daily" ? "80px" : "90px",
                  left: frequency === "daily" ? "4px" : "84px",
                }}
              />

              {/* DAILY */}
              <button
                onClick={() => setFrequency("daily")}
                className={`relative z-10 px-5 py-2 text-sm transition-all
        ${
          frequency === "daily"
            ? "text-black scale-105 font-medium"
            : "text-gray-500"
        }`}
              >
                DAILY
              </button>

              {/* WEEKLY */}
              <button
                onClick={() => setFrequency("weekly")}
                className={`relative z-10 px-5 py-2 text-sm transition-all
        ${
          frequency === "weekly"
            ? "text-black scale-105 font-medium"
            : "text-gray-500"
        }`}
              >
                WEEKLY
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-auto flex justify-end gap-6">
            <button onClick={handleClose} className="text-gray-500">
              Cancel
            </button>

            <Button variant="primary" onClick={handleCreate}>
              {loading ? "Creating..." : "CREATE HABIT"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Create;
