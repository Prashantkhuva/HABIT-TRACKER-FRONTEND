import React, { useId } from "react";

function Textarea({ label, className = "", ...props }) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-text-muted dark:text-dark-text-muted"
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`w-full rounded-[20px] border border-transparent bg-surface-dim dark:bg-black px-5 py-4 text-sm text-text-primary dark:text-white outline-none transition-all duration-300 placeholder:text-text-muted/50 dark:placeholder:text-dark-text-muted/50 focus:border-text-primary dark:focus:border-dark-text-primary focus:ring-1 focus:ring-text-primary dark:focus:ring-dark-text-primary resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

export default Textarea;
