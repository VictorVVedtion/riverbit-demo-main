import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// MobileHeader.tsx
import React from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
const MobileHeader = ({ balance = "$27,345.12", onDeposit, onMenuToggle, }) => {
    return (_jsxs("div", { className: "flex xl:hidden justify-between items-center self-stretch bg-zinc-900 py-3.5 px-4", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsx("img", { src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/tsg0s0tv_expires_30_days.png", className: "w-[100px] h-8 object-fill", alt: "Logo" }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex flex-col shrink-0 items-start", children: [_jsx("span", { className: "text-zinc-400 text-sm", children: "Balance" }), _jsx("span", { className: "text-white text-sm", children: balance })] }), _jsx(PrimaryButton, { size: "medium", onClick: onDeposit, children: "Deposit" }), _jsx("button", { className: "flex items-center justify-center p-2 rounded-sm focus:outline-none", onClick: onMenuToggle, "aria-label": "Open menu", children: _jsx("svg", { className: "w-7 h-7 text-white", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }) })] })] }));
};
export default MobileHeader;
