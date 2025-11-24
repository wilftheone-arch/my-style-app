import React from "react";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black disabled:opacity-50 disabled:pointer-events-none";

const variants = {
  default: "bg-black text-white hover:bg-neutral-900",
  outline:
    "border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50",
  ghost: "bg-transparent text-neutral-900 hover:bg-neutral-100",
};

const sizes = {
  sm: "h-8 px-3",
  default: "h-10 px-4",
  lg: "h-12 px-5 text-base",
  icon: "h-10 w-10",
};

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.default;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
