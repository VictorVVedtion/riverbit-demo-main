import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  to: string;
}

const navItems: NavItem[] = [
  { label: "Trading", to: "/trading" },
  { label: "RiverPool", to: "/riverpool" },
  { label: "Earn", to: "/earn" },
  { label: "Referral", to: "/referral" },
  { label: "Assets", to: "/assets" },
];

const moreItems: NavItem[] = [
  { label: "API", to: "/api" },
  { label: "Documentation", to: "/docs" },
  { label: "Announcement", to: "/announcement" },
];

const DesktopNav: React.FC = () => {
  const location = useLocation();
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  // 判斷是否 active
  const isActive = (to: string) => {
    if (to === "/trading") return location.pathname === "/" || location.pathname === "/trading";
    return location.pathname === to;
  };

  return (
    <div className="flex shrink-0 items-center">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`flex flex-col shrink-0 py-3 mr-4 rounded-sm px-3 ${
            isActive(item.to) ? "bg-zinc-700 text-white" : "text-zinc-400"
          }`}
        >
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}

      {/* More dropdown */}
      <div className="relative">
        <button
          className="flex shrink-0 items-center py-[11px] gap-[13px] rounded-sm focus:outline-none"
          onClick={() => setShowMoreDropdown((v) => !v)}
          type="button"
        >
          <span className="text-zinc-400 text-sm">More</span>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/wo9zz3y5_expires_30_days.png"
            className="w-3 h-[15px] rounded-sm object-fill"
            alt="More"
          />
        </button>
        {showMoreDropdown && (
          <div className="text-left absolute left-0 mt-2 z-50 min-w-[180px] bg-zinc-900 border border-[#30363D] rounded shadow-lg">
            {moreItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block px-4 py-3 text-sm text-white hover:bg-zinc-800"
                onClick={() => setShowMoreDropdown(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
