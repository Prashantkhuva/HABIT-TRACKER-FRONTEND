import React, { useId } from "react";

function Input(
  { label, type = "text", className = "", placeholder = "", ...props },
  ref,
) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-[#938F99]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-full border border-gray-300 dark:border-[#2A2A2A] bg-gray-200 dark:bg-[#1D1B20] px-5 py-4 text-sm text-[#1A1A1A] dark:text-[#E6E1E5] outline-none transition-all duration-300 placeholder:text-gray-400/50 dark:placeholder:text-[#938F99]/50 focus:border-[#1A1A1A] dark:focus:border-[#E6E1E5] focus:ring-1 focus:ring-[#1A1A1A] dark:focus:ring-[#E6E1E5] focus:-translate-y-0.5 ${className}`}
        {...props}
      />
    </div>
  );
}

export default React.forwardRef(Input);
