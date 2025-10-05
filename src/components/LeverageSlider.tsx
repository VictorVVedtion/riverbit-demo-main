import React from "react";

interface LeverageSliderProps {
  value: number; // current leverage, e.g. 10
  onChange: (val: number) => void;
}

const leverageOptions = [5, 10, 20, 50, 100];

const LeverageSlider: React.FC<LeverageSliderProps> = ({ value, onChange }) => {
  // Map current value -> index
  const currentIndex = leverageOptions.indexOf(value);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = Number(e.target.value);
    onChange(leverageOptions[idx]);
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {/* Slider */}
      <input
        type="range"
        min={0}
        max={leverageOptions.length - 1}
        step={1}
        value={currentIndex}
        onChange={handleSliderChange}
        className="w-full accent-fuchsia-800 h-2 rounded-lg appearance-none bg-zinc-700"
      />

      {/* Shortcut buttons */}
      <div className="flex items-start gap-2 w-full">
        {leverageOptions.map((lev) => (
          <button
            key={lev}
            type="button"
            className={`w-full flex flex-col items-center py-[11px] px-2 rounded ${
              value === lev
                ? "border-2 border-fuchsia-800 font-bold text-white bg-[#0D1117]"
                : "border border-[#30363D] text-white bg-[#0D1117]"
            }`}
            onClick={() => onChange(lev)}
          >
            {lev}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeverageSlider;
