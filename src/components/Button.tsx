import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`
        py-3 px-4
        rounded-lg
        font-semibold
        transition-all duration-200
        active:scale-95
        bg-red-600 hover:bg-red-700
        text-white
        shadow-md
        ${className}
      `}
    />
  );
}
