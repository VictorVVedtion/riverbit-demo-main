import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Button/PrimaryButton.tsx
import React from "react";
const PrimaryButton = ({ onClick, children, size = "medium", icon, }) => {
    // 根據 size 設定不同 class
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
    return (_jsxs("button", { className: `w-full flex flex-1 justify-center items-center gap-2 bg-fuchsia-800 rounded-sm border-0 ${sizeClasses}`, onClick: onClick, children: [icon && _jsx("span", { className: "flex items-center", children: icon }), _jsx("span", { className: "text-white font-bold text-center", children: children })] }));
};
export default PrimaryButton;
