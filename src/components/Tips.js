import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
const Tips = ({ title, iconUrl, tips }) => {
    const onlyIcon = iconUrl && !title;
    return (_jsxs("div", { className: "flex flex-col items-start bg-zinc-950 py-3 rounded-lg w-full", children: [(title || (iconUrl && !onlyIcon)) && (_jsxs("div", { className: "flex items-center mb-2 ml-3 gap-2", children: [iconUrl && (_jsx("img", { src: iconUrl, className: "w-3 h-6 object-fill", alt: "icon" })), title && _jsx("span", { className: "text-white text-sm text-left", children: title })] })), tips.map((tip, i) => (_jsxs("div", { className: `flex items-center mx-3 text-sm text-left ${onlyIcon ? "gap-2" : ""}`, children: [onlyIcon && (_jsx("img", { src: iconUrl, className: "w-3 h-6 object-fill flex-shrink-0", alt: "icon" })), _jsx("span", { className: onlyIcon ? "text-white" : "text-[#9D9DAF]", children: tip })] }, i)))] }));
};
export default Tips;
