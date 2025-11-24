import React from "react";

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={
        "px-3 py-2 rounded-md border border-neutral-300 bg-neutral-900 text-white text-sm hover:bg-neutral-800 transition " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
