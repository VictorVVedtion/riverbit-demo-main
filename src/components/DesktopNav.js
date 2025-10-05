import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
const DesktopNav = () => {
    const location = useLocation();
    const [showMoreDropdown, setShowMoreDropdown] = useState(false);
    // 判斷是否 active
    const isActive = (to) => {
        if (to === "/trading")
            return location.pathname === "/" || location.pathname === "/trading";
        return location.pathname === to;
    };
    return (_jsxs("div", { className: "flex shrink-0 items-center", children: [navItems.map((item) => (_jsx(Link, { to: item.to, className: `flex flex-col shrink-0 py-3 mr-4 rounded-sm px-3 ${isActive(item.to) ? "bg-zinc-700 text-white" : "text-zinc-400"}`, children: _jsx("span", { className: "text-sm", children: item.label }) }, item.to))), _jsxs("div", { className: "relative", children: [_jsxs("button", { className: "flex shrink-0 items-center py-[11px] gap-[13px] rounded-sm focus:outline-none", onClick: () => setShowMoreDropdown((v) => !v), type: "button", children: [_jsx("span", { className: "text-zinc-400 text-sm", children: "More" }), _jsx("img", { src: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/wo9zz3y5_expires_30_days.png", className: "w-3 h-[15px] rounded-sm object-fill", alt: "More" })] }), showMoreDropdown && (_jsx("div", { className: "text-left absolute left-0 mt-2 z-50 min-w-[180px] bg-zinc-900 border border-[#30363D] rounded shadow-lg", children: moreItems.map((item) => (_jsx(Link, { to: item.to, className: "block px-4 py-3 text-sm text-white hover:bg-zinc-800", onClick: () => setShowMoreDropdown(false), children: item.label }, item.to))) }))] })] }));
};
export default DesktopNav;
