import React from "react";

export function Slider({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}) {
  const current = Array.isArray(value) ? value[0] : Number(value) || 0;

  const handleChange = (event) => {
    const nextValue = Number(event.target.value);
    onValueChange?.([nextValue]);
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={handleChange}
      className={`w-full accent-black ${className}`}
    />
  );
}
