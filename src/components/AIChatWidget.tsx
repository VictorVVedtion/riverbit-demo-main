import { useState } from "react";
import ToggleWithText from "./ToggleWithText";
import PrimaryButton from "./Button/PrimaryButton";

type AIChatWidgetProps = {
  onClose: () => void; // 父層傳入 close callback
};

const AIChatWidget = ({ onClose }: AIChatWidgetProps) => {
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("Chat");

  return (
    <div className="w-full h-full bg-[#1F2226] border border-gray-700 rounded-lg shadow-lg flex flex-col overflow-hidden text-white text-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-600">
        <span className="flex items-center gap-1">
          🤖 AI Assistant Connected
        </span>
        <div className="flex gap-2">
          {/* Close Button */}
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/73d3cc65_expires_30_days.png"
            className="w-11 h-11 object-fill cursor-pointer"
            onClick={onClose}
            alt="Close"
          />
        </div>
      </div>

      {/* Body */}
      <div className="h-full flex flex-col p-4 gap-2 overflow-y-auto bg-[#181A1D]">
        <div className="font-bold">AI Trading Assistant</div>
        <div className="text-gray-400 text-xs">
          Enter trading commands to start intelligent conversation
        </div>
        <div className="text-gray-500 text-xs">
          Supports both voice and text input
        </div>
        <div className="text-gray-500 text-xs italic">
          For example: Buy $100 ETH, set 5% stop-loss...
        </div>
        {/* Chat content left empty */}
      </div>

      {/* Input + Buttons */}
      <div className="flex items-center border-t border-gray-600 p-2 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          className="w-full px-2 py-3 rounded bg-[#0D1117] text-white text-xs outline-none border border-solid border-[#30363D]"
        />

        <PrimaryButton size="large" 
          onClick={() => {
            console.log("Send:", input);
            setInput("");}}
          >
            Send
        </PrimaryButton>
      </div>

      {/* Footer Tabs */}
      <div className="p-2">
        <ToggleWithText
          options={["Chat", "Analysis", "Strategy"]}
          value={tab}
          onChange={setTab}
        />
      </div>
    </div>
  );
};

export default AIChatWidget;
