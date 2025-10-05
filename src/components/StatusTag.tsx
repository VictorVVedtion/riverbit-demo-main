import React from "react";

interface StatusTagProps {
  status: string;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  // Define colors for each status
  const statusColors: Record<string, string> = {
    Confirmed: "bg-[#2DA44E] text-white",
    Active: "bg-[#2DA44E] text-white",
    "In Queue (T+4)": "bg-[#DFA42F] text-black",
    Failed: "bg-[#E55353] text-white",
    Pending: "bg-[#8B949E] text-white",
    // 可以再加其他狀態
  };

  const colorClass = statusColors[status] || "bg-[#30363D] text-[#8B949E]";

  return (
    <button
      className={`py-1 px-2 text-sm font-bold rounded border-0 ${colorClass}`}
      onClick={() => alert(`Status: ${status}`)}
    >
      {status}
    </button>
  );
};

export default StatusTag;
