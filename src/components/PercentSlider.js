import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
const PercentSlider = ({ value, maxAmount, onChangeAmount }) => {
    const handleSliderChange = (e) => {
        const percent = Number(e.target.value);
        const amount = Math.round((percent / 100) * maxAmount);
        onChangeAmount(amount.toString());
    };
    return (_jsxs("div", { className: "flex flex-col w-full", children: [_jsx("input", { type: "range", min: 0, max: 100, step: 1, value: value, onChange: handleSliderChange, className: "w-full accent-fuchsia-800 h-2 rounded-lg appearance-none bg-zinc-700 my-2" }), _jsx("div", { className: "flex justify-between gap-2 w-full mt-1", children: [0, 25, 50, 75, 100].map((percent) => (_jsxs("button", { type: "button", className: `py-[11px] w-full rounded-sm border ${value === percent
                        ? "border-2 border-fuchsia-800 font-bold"
                        : "border border-[#30363D]"} bg-zinc-900 text-white text-sm`, onClick: () => {
                        const amount = Math.round((percent / 100) * maxAmount);
                        onChangeAmount(amount.toString());
                    }, children: [percent, "%"] }, percent))) })] }));
};
export default PercentSlider;
