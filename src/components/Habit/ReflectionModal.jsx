import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { NotebookPen, Sparkles, ArrowRight } from "lucide-react";

import Button from "../Button";

export default function ReflectionModal({
  open,
  onClose,
  onSave,
  onSkip,
  habit,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) {
      setNote("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        className="
          fixed inset-0 z-[100]

          bg-black/50
          backdrop-blur-md

          flex
          items-end
          sm:items-center
          justify-center

          px-0
          sm:px-6
        "
      >
        <motion.div
          initial={{
            y: 40,
            opacity: 0,
            scale: 0.98,
          }}
          animate={{
            y: 0,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            y: 40,
            opacity: 0,
            scale: 0.98,
          }}
          transition={{
            type: "spring",
            damping: 26,
            stiffness: 240,
          }}
          className="
            relative

            w-full
            sm:w-[540px]

            rounded-t-[36px]
            sm:rounded-[36px]

            overflow-hidden

            bg-[#FAFAF5]
            dark:bg-[#141218]

            border
            border-[#E8E4DC]
            dark:border-[#2A2A2A]

            shadow-[0_20px_80px_rgba(0,0,0,0.25)]

            p-6
            sm:p-8
          "
        >
          {/* BACKGROUND GLOW */}
          <div
            className="
              absolute
              -top-20
              -right-20

              w-56
              h-56

              rounded-full

              bg-[#C8E6DF]/40
              dark:bg-[#D0BCFF]/10

              blur-3xl
            "
          />

          {/* GRID TEXTURE */}
          <div
            className="
              absolute inset-0 opacity-[0.03]

              [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
              dark:[background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]

              [background-size:28px_28px]
            "
          />

          <div className="relative z-10">
            {/* TOP */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="
                    flex items-center gap-2

                    text-[11px]
                    uppercase
                    tracking-[0.25em]

                    text-[#888888]
                    dark:text-[#938F99]
                  "
                >
                  <Sparkles size={13} />
                  Session Reflection
                </div>

                <h2
                  className="
                    mt-4

                    text-2xl
                    sm:text-3xl

                    font-black

                    tracking-[-0.04em]

                    text-[#1A1A1A]
                    dark:text-[#FAFAF5]
                  "
                  style={{
                    fontFamily: "Epilogue, sans-serif",
                  }}
                >
                  {habit?.title} completed
                </h2>

                <p
                  className="
                    mt-3

                    max-w-md

                    text-sm
                    leading-relaxed

                    text-[#888888]
                    dark:text-[#938F99]
                  "
                >
                  Capture anything worth remembering from today’s session.
                </p>
              </div>

              {/* ICON */}
              <div
                className="
                  shrink-0

                  w-12
                  h-12

                  rounded-2xl

                  flex
                  items-center
                  justify-center

                  bg-[#1A1A1A]
                  dark:bg-[#D0BCFF]

                  text-[#FAFAF5]
                  dark:text-[#1A1A1A]
                "
              >
                <NotebookPen size={20} />
              </div>
            </div>

            {/* TEXTAREA */}
            <div className="mt-7">
              <textarea
                value={note}
                maxLength={300}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Felt more focused during deep work today..."
                className="
                  w-full
                  h-36

                  resize-none

                  rounded-[28px]

                  border
                  border-[#E8E4DC]
                  dark:border-[#2A2A2A]

                  bg-white/80
                  dark:bg-[#1A1A1A]

                  px-5
                  py-4

                  outline-none

                  text-sm
                  leading-relaxed

                  text-[#1A1A1A]
                  dark:text-[#FAFAF5]

                  placeholder:text-[#AAAAAA]
                  dark:placeholder:text-[#666666]

                  focus:border-[#1A1A1A]
                  dark:focus:border-[#D0BCFF]

                  transition-all
                "
              />

              {/* FOOTER */}
              <div className="flex items-center justify-between mt-3 px-1">
                <p
                  className="
                    text-[11px]

                    text-[#888888]
                    dark:text-[#938F99]
                  "
                >
                  Reflection is optional
                </p>

                <p
                  className="
                    text-[11px]

                    text-[#888888]
                    dark:text-[#938F99]
                  "
                >
                  {note.length}/300
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between items-center mt-8 gap-4">
              {/* SKIP */}
              <button
                onClick={async () => {
                  setNote("");

                  await onSkip();
                }}
                className="
                  flex items-center gap-2

                  text-sm
                  font-medium

                  text-[#888888]
                  dark:text-[#938F99]

                  hover:text-[#1A1A1A]
                  dark:hover:text-[#FAFAF5]

                  transition-colors
                "
              >
                Skip reflection
                <ArrowRight size={15} />
              </button>

              {/* SAVE */}
              <Button
                variant="primary"
                onClick={async () => {
                  const currentNote = note;

                  setNote("");

                  await onSave(currentNote);
                }}
              >
                SAVE NOTE
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
