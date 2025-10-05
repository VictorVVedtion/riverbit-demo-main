// src/components/Button/PrimaryButton.tsx
import React from "react";

interface PrimaryButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  size?: "small" | "medium" | "large"; // 控制大小
  icon?: React.ReactNode; // optional icon
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  children,
  size = "medium",
  icon,
}) => {
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

  return (
    <button
      className={`w-full flex flex-1 justify-center items-center gap-2 bg-fuchsia-800 rounded-sm border-0 ${sizeClasses}`}
      onClick={onClick}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="text-white font-bold text-center">
        {children}
      </span>
    </button>
  );
};

export default PrimaryButton;
