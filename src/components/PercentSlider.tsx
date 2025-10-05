import React from "react";

interface PercentSliderProps {
  value: number; // 已經計算好的 percentValue
  maxAmount: number; // 例如 AMOUNT_TOTAL
  onChangeAmount: (amount: string) => void; // 更新 input2
}

const PercentSlider: React.FC<PercentSliderProps> = ({ value, maxAmount, onChangeAmount }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = Number(e.target.value);
    const amount = Math.round((percent / 100) * maxAmount);
    onChangeAmount(amount.toString());
  };

  return (
    <div className="flex flex-col w-full">
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={handleSliderChange}
        className="w-full accent-fuchsia-800 h-2 rounded-lg appearance-none bg-zinc-700 my-2"
      />

      <div className="flex justify-between gap-2 w-full mt-1">
        {[0, 25, 50, 75, 100].map((percent) => (
          <button
            key={percent}
            type="button"
            className={`py-[11px] w-full rounded-sm border ${
              value === percent
                ? "border-2 border-fuchsia-800 font-bold"
                : "border border-[#30363D]"
            } bg-zinc-900 text-white text-sm`}
            onClick={() => {
              const amount = Math.round((percent / 100) * maxAmount);
              onChangeAmount(amount.toString());
            }}
          >
            {percent}%
          </button>
        ))}
      </div>
    </div>
  );
};

export default PercentSlider;
