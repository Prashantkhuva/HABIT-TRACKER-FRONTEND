import React, { useId } from 'react'

function Input({
  label, type = "text", className = "", placeholder = "", ...props
}, ref) {

  const id = useId();

  return (
    <div className='w-full'>
      {label && (
        <label
          htmlFor={id}
          className='mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A8A]'
        >
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-full border border-transparent bg-[#EEEAE0] px-5 py-4 text-sm text-[#1A1A1A] outline-none transition-all duration-300 placeholder:text-[#BEBAB0] focus:border-[#1A1A1A] focus:ring-1 focus:ring-[#1A1A1A] focus:-translate-y-0.5 ${className}`}
        ref={ref}
        id={id}
        {...props}
      />
    </div>
  )
}

export default React.forwardRef(Input)