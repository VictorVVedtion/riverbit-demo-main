import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
const StatusTag = ({ status }) => {
    // Define colors for each status
    const statusColors = {
        Confirmed: "bg-[#2DA44E] text-white",
        Active: "bg-[#2DA44E] text-white",
        "In Queue (T+4)": "bg-[#DFA42F] text-black",
        Failed: "bg-[#E55353] text-white",
        Pending: "bg-[#8B949E] text-white",
        // 可以再加其他狀態
    };
    const colorClass = statusColors[status] || "bg-[#30363D] text-[#8B949E]";
    return (_jsx("button", { className: `py-1 px-2 text-sm font-bold rounded border-0 ${colorClass}`, onClick: () => alert(`Status: ${status}`), children: status }));
};
export default StatusTag;
