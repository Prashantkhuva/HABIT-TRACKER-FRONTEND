import React, { useId } from "react";

function Textarea({ label, className = "", ...props }) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A8A]"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`w-full rounded-[20px] border border-transparent bg-[#EEEAE0] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-[#BEBAB0] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

export default Textarea;
