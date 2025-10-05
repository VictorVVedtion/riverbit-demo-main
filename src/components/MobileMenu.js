import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PrimaryButton from "./Button/PrimaryButton";
import { SecondaryButton } from "./Button/SecondaryButton";
import ToggleWithText from "./ToggleWithText";
const navItems = [
    { label: "Trading", to: "/trading" },
    { label: "RiverPool", to: "/riverpool" },
    { label: "Earn", to: "/earn" },
    { label: "Referral", to: "/referral" },
    { label: "Assets", to: "/assets" },
];
const moreItems = [
    { label: "API", to: "/api" },
    { label: "Documentation", to: "/docs" },
    { label: "Announcement", to: "/announcement" },
];
const MobileMenu = ({ isOpen, onClose, balance = "$27,345.12", points = "1,250,000", language = "EN", setLanguage, }) => {
    const [showMore, setShowMore] = useState(false);
    const location = useLocation();
    if (!isOpen)
        return null;
    const isActive = (to) => {
        if (to === "/trading")
            return location.pathname === "/" || location.pathname === "/trading";
        return location.pathname === to;
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-70 flex flex-col xl:hidden", children: _jsxs("div", { className: "w-[100vw] flex flex-col bg-zinc-900 h-full shadow-lg p-6", children: [_jsx("button", { className: "self-end mb-6", onClick: onClose, "aria-label": "Close menu", children: _jsx("svg", { className: "w-7 h-7 text-white", fill: "none", stroke: "currentColor", strokeWidth: 2, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18L18 6M6 6l12 12" }) }) }), _jsxs("div", { className: "overflow-auto flex flex-col h-full justify-between", children: [_jsxs("div", { className: "flex flex-col", children: [navItems.map((item) => (_jsx(Link, { to: item.to, onClick: onClose, className: `flex flex-col items-start py-3 px-3 mb-2 rounded-sm ${isActive(item.to) ? "bg-zinc-700 text-white" : "text-zinc-400"}`, children: _jsx("span", { className: "text-sm", children: item.label }) }, item.to))), _jsxs("div", { className: "flex flex-col mb-2", children: [_jsxs("button", { className: "flex items-center justify-between py-3 px-3 rounded-sm text-zinc-400 text-sm focus:outline-none", onClick: () => setShowMore((v) => !v), type: "button", children: [_jsx("span", { children: "More" }), _jsx("img", { src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/wo9zz3y5_expires_30_days.png", className: `w-3 h-[15px] object-fill transform transition-transform ${showMore ? "rotate-180" : ""}`, alt: "More" })] }), showMore && (_jsx("div", { className: "flex flex-col ml-6 text-left", children: moreItems.map((item) => (_jsx(Link, { to: item.to, onClick: onClose, className: `py-2 text-sm ${isActive(item.to) ? "text-white font-bold" : "text-zinc-400"}`, children: item.label }, item.to))) }))] })] }), _jsxs("div", { className: "flex flex-col gap-4 pt-4 border-t border-[#30363D]", children: [_jsxs("div", { className: "flex flex-row justify-between mt-4 mb-2", children: [_jsxs("div", { className: "flex flex-col flex-1 items-start", children: [_jsx("span", { className: "text-zinc-400 text-md", children: "Balance" }), _jsx("span", { className: "text-white text-md", children: balance })] }), _jsxs("div", { className: "flex flex-col flex-1 items-start", children: [_jsx("span", { className: "text-zinc-400 text-md", children: "Points" }), _jsx("span", { className: "text-white text-md", children: points })] })] }), _jsxs("div", { className: "flex flex-row gap-2 text-center w-full", children: [_jsx(PrimaryButton, { size: "large", onClick: () => alert("Deposit clicked!"), children: "Deposit" }), _jsx(SecondaryButton, { size: "large", onClick: () => alert("Withdraw clicked!"), children: "Withdraw" })] }), _jsx(ToggleWithText, { options: ["EN", "中文"], value: language, onChange: setLanguage }), _jsx(SecondaryButton, { onClick: () => alert("Disconnect Wallet"), size: "medium", icon: _jsx("img", { src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/7ru13dyc_expires_30_days.png", className: "w-5 h-5 object-fill" }), children: "Disconnect Wallet" })] })] })] }) }));
};
export default MobileMenu;
