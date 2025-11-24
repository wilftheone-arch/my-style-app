import React from "react";

export function Sheet({ children }) {
  return <>{children}</>;
}

export function SheetTrigger({ children, asChild = false, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      ...props,
    });
  }

  return (
    <button type="button" {...props}>
      {children}
    </button>
  );
}

export function SheetContent({ children, className = "", side = "left" }) {
  const sideClasses =
    side === "left" ? "left-0" : side === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`fixed inset-y-0 ${sideClasses} w-72 bg-white shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
