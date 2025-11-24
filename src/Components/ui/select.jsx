import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SelectContext = createContext(null);

function useSelectContext() {
  const context = useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within <Select>");
  }
  return context;
}

export function Select({
  value,
  defaultValue = "",
  onValueChange,
  children,
  className = "",
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [items, setItems] = useState([]);

  const handleValueChange = useCallback(
    (next) => {
      setInternalValue(next);
      onValueChange?.(next);
    },
    [onValueChange]
  );

  const registerItem = useCallback((item) => {
    setItems((prev) => {
      if (prev.some((existing) => existing.value === item.value)) {
        return prev;
      }
      return [...prev, item];
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      value: value ?? internalValue,
      onValueChange: handleValueChange,
      registerItem,
      items,
      className,
    }),
    [className, handleValueChange, items, registerItem, value, internalValue]
  );

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="w-full">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className = "", children }) {
  const { value, onValueChange, items } = useSelectContext();

  const handleChange = (event) => {
    onValueChange?.(event.target.value);
  };

  return (
    <select
      value={value ?? ""}
      onChange={handleChange}
      className={`w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:border-black transition ${className}`}
    >
      {items.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

export function SelectValue() {
  return null;
}

export function SelectContent({ children }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }) {
  const { registerItem } = useSelectContext();

  useEffect(() => {
    const label =
      typeof children === "string"
        ? children
        : React.Children.toArray(children).join("");
    registerItem({ value, label });
  }, [children, registerItem, value]);

  return null;
}
