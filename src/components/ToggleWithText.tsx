import React, { useRef, useEffect, useState } from "react";

interface ToggleWithTextProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

const ToggleWithText: React.FC<ToggleWithTextProps> = ({ options, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    // 找到被選中 button
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = Array.from(container.children).find(
      (child) => (child as HTMLElement).dataset.value === value
    ) as HTMLElement;

    if (activeBtn) {
      setHighlightStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
      });
    }
  }, [value, options]);

  return (
    <div className="relative flex items-center gap-2 shrink-0 bg-[#0D1117] p-1 rounded-sm border border-[#30363D]" ref={containerRef}>
      {/* Sliding Rectangle */}
      <div
        className="absolute top-1 bottom-1 bg-fuchsia-800 rounded-sm transition-all duration-300"
        style={{ left: highlightStyle.left, width: highlightStyle.width }}
      />

      {options.map((option) => (
        <button
          key={option}
          data-value={option}
          className={`flex-1 flex flex-col items-center py-3 px-3 rounded border-0 text-sm text-white z-10`}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleWithText;
