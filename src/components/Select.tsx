import React from "react";

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  minWidth?: string; // optional prop for minimum width
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  minWidth = "", // default value
}) => {
  return (
    <div className={`relative inline-flex ${minWidth} w-full`}>
      <select
        className={`appearance-none flex items-center bg-zinc-950 text-left p-3 pr-8 rounded-sm border border-solid border-[#30363D]  text-sm w-full ${
          value ? "text-white" : "text-zinc-400"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
        <img
          src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/bvauf8h6_expires_30_days.png"
          className="w-3 h-[15px] rounded-sm object-fill"
        />
      </span>
    </div>
  );
};

export default Select;
