import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";

function Input(
  { label, type = "text", className = "", placeholder = "", ...props },
  ref,
) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="app-label mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          ref={ref}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className={`w-full rounded-full border border-border-subtle bg-surface px-5 py-4 ${
            isPassword ? "pr-14" : ""
          } text-sm text-text-primary outline-none transition-all duration-200 placeholder:text-text-muted/55 focus:border-primary/40 focus:bg-background focus:ring-4 focus:ring-primary/8 ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

export default React.forwardRef(Input);
