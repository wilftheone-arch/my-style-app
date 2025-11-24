import React from "react";

export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-500 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition ${className}`}
      {...props}
    />
  );
}
