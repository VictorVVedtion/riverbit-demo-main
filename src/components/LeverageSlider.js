import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
const leverageOptions = [5, 10, 20, 50, 100];
const LeverageSlider = ({ value, onChange }) => {
    // Map current value -> index
    const currentIndex = leverageOptions.indexOf(value);
    const handleSliderChange = (e) => {
        const idx = Number(e.target.value);
        onChange(leverageOptions[idx]);
    };
    return (_jsxs("div", { className: "flex flex-col w-full gap-2", children: [_jsx("input", { type: "range", min: 0, max: leverageOptions.length - 1, step: 1, value: currentIndex, onChange: handleSliderChange, className: "w-full accent-fuchsia-800 h-2 rounded-lg appearance-none bg-zinc-700" }), _jsx("div", { className: "flex items-start gap-2 w-full", children: leverageOptions.map((lev) => (_jsxs("button", { type: "button", className: `w-full flex flex-col items-center py-[11px] px-2 rounded ${value === lev
                        ? "border-2 border-fuchsia-800 font-bold text-white bg-[#0D1117]"
                        : "border border-[#30363D] text-white bg-[#0D1117]"}`, onClick: () => onChange(lev), children: [lev, "x"] }, lev))) })] }));
};
export default LeverageSlider;
