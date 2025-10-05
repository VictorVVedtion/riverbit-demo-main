import React from "react";

interface ToggleButtonProps {
  label: string;
  value: boolean;
  onChange: (val: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ label, value, onChange }) => {
  return (
    <button
      type="button"
      className="py-2 flex items-center w-full justify-between focus:outline-none"
      onClick={() => onChange(!value)}
    >
      <span className="text-[#C9D1D9] text-sm">{label}</span>
      <div
        className={`shrink-0 flex items-center transition-colors duration-200 rounded-full ${
          value ? "bg-fuchsia-800" : "bg-zinc-700"
        } py-0.5 pl-2 pr-0.5`}
        style={{ width: 48, height: 28 }}
      >
        <div
          className="bg-white w-5 h-5 rounded-full border border-solid border-white shadow transition-transform duration-200"
          style={{ transform: value ? "translateX(12px)" : "translateX(0)" }}
        />
      </div>
    </button>
  );
};

export default ToggleButton;
