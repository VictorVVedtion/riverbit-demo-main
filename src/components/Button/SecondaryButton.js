import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export const SecondaryButton = ({ onClick, children, size = "medium", icon, }) => {
    let sizeClasses = "";
    switch (size) {
        case "small":
            sizeClasses = "py-2 px-3 text-xs"; // 小
            break;
        case "medium":
            sizeClasses = "py-2.5 px-4 text-xs"; // 中
            break;
        case "large":
            sizeClasses = "py-3.5 px-4 text-base"; // 大
            break;
    }
    return (_jsxs("button", { className: `w-full flex flex-1 justify-center items-center gap-2 bg-zinc-900 rounded-sm border border-solid border-[#30363D] ${sizeClasses}`, onClick: onClick, children: [icon && _jsx("span", { className: "flex items-center", children: icon }), _jsx("span", { className: "text-white font-bold text-center", children: children })] }));
};
