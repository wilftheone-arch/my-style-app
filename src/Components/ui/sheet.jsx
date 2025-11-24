import React from "react";

export function Sheet({ children }) {
  return <>{children}</>;
}

export function SheetTrigger({ children, asChild = false, ...props }) {
  if (asChild && React.isValidElement(children)) {
    // Render the child directly so we don't nest native buttons.
    return React.cloneElement(children, {
      ...children.props,
      ...props,
    });
  }

  return <button {...props}>{children}</button>;
}

export function SheetContent({ children, className = "" }) {
  return (
    <div className={"fixed inset-y-0 left-0 w-72 bg-white shadow-lg " + className}>
      {children}
    </div>
  );
}
