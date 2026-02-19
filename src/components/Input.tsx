import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`
        w-full
        px-4 py-3
        rounded-lg
        bg-neutral-900
        border border-neutral-800
        text-white
        placeholder-neutral-500
        focus:outline-none
        focus:border-red-600
        focus:ring-1 focus:ring-red-600
        transition
        ${className}
      `}
    />
  );
}
