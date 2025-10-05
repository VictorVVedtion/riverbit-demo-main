import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
const Select = ({ value, onChange, options, placeholder, minWidth = "", // default value
 }) => {
    return (_jsxs("div", { className: `relative inline-flex ${minWidth} w-full`, children: [_jsxs("select", { className: `appearance-none flex items-center bg-zinc-950 text-left p-3 pr-8 rounded-sm border border-solid border-[#30363D]  text-sm w-full ${value ? "text-white" : "text-zinc-400"}`, value: value, onChange: (e) => onChange(e.target.value), children: [placeholder && (_jsx("option", { value: "", disabled: true, hidden: true, children: placeholder })), options.map((opt) => (_jsx("option", { value: opt.value, children: opt.label }, opt.value)))] }), _jsx("span", { className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400", children: _jsx("img", { src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/bvauf8h6_expires_30_days.png", className: "w-3 h-[15px] rounded-sm object-fill" }) })] }));
};
export default Select;
