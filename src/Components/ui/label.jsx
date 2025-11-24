import React from "react";

export function Label({ className = "", children, htmlFor, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium text-neutral-800 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}
