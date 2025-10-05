import React from "react";

interface TipsProps {
  title?: string;       // optional
  iconUrl?: string;     // optional
  tips: string[];
}

const Tips: React.FC<TipsProps> = ({ title, iconUrl, tips }) => {
  const onlyIcon = iconUrl && !title;

  return (
    <div className="flex flex-col items-start bg-zinc-950 py-3 rounded-lg w-full">
      {/* title + icon */}
      {(title || (iconUrl && !onlyIcon)) && (
        <div className="flex items-start mb-2 ml-3 gap-2">
          {iconUrl && (
            <img
              src={iconUrl}
              className="w-3 h-6 object-fill items-start top-0"
              alt="icon"
            />
          )}
          {title && <span className="text-white text-sm text-left">{title}</span>}
        </div>
      )}

      {/* tips */}
      {tips.map((tip, i) => (
        <div
          key={i}
          className={`flex items-start mx-3 text-sm text-left ${
            onlyIcon ? "gap-2" : ""
          }`}
        >
          {onlyIcon && (
            <img
              src={iconUrl}
              className="w-3 h-6 object-fill flex-shrink-0"
              alt="icon"
            />
          )}
          <span className={onlyIcon ? "text-white" : "text-[#9D9DAF]"}>{tip}</span>
        </div>
      ))}
    </div>
  );
};

export default Tips;
