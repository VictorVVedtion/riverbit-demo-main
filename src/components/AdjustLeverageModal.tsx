import { useState, useEffect } from "react";
import PrimaryButton from "./Button/PrimaryButton";
import { SecondaryButton } from "./Button/SecondaryButton";
import Tips from "./Tips";
import LeverageSlider from "./LeverageSlider";

type AdjustLeverageModalProps = {
  leverage: number;
  onClose?: () => void;
  onConfirm?: () => void;
  setLeverage?: (val: number) => void;
};

const AdjustLeverageModal = ({
  leverage = 20,
  onClose,
  onConfirm,
  setLeverage,
}: AdjustLeverageModalProps) => {
  const [inputValue, setInputValue] = useState<string>(leverage.toString());

  // 當 leverage 從外部更新（例如 slider）時，input 自動同步
  useEffect(() => {
    setInputValue(leverage.toString());
  }, [leverage]);

  const handleInputChange = (val: string) => {
    // 去掉前導 0
    const cleaned = val.replace(/^0+/, "") || "0";
    setInputValue(cleaned);

    const num = Number(cleaned);
    if (!isNaN(num) && num >= 1 && num <= 125) {
      setLeverage?.(num);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000B0]">
        <div className="w-full max-w-md md:m-auto flex flex-col bg-[#272B2F] h-[100vh] md:h-auto rounded-lg border border-solid border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="flex items-center self-stretch p-6 border-b border-gray-700">
            <span className="flex-1 text-white text-lg font-bold">Adjust Leverage</span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/73d3cc65_expires_30_days.png"
              className="w-11 h-11 object-fill cursor-pointer"
              onClick={onClose}
              alt="Close"
            />
          </div>
    
          {/* Body */}
          <div className="m-6 gap-4 flex-1 flex flex-col">
            {/* Leverage Input */}
            <div className="flex flex-col items-start gap-2">
              <span className="text-[#9D9DAF] text-xs">Leverage</span>
              <div className="relative w-full">
                <input
                  type="number"
                  min={1}
                  max={125}
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full text-white bg-[#0D1117] text-base py-3 pl-3 pr-10 rounded-md border border-solid border-[#30363D]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white">x</span>
              </div>
            </div>
    
            {/* Leverage Slider */}
            <div className="mt-4">
              <LeverageSlider
                value={leverage}
                onChange={(val: number | number[]) => {
                  const newValue = Array.isArray(val) ? val[0] : val;
                  setLeverage?.(newValue);
                }}
              />
            </div>
    
            {/* Tips */}
            <div className="w-full mt-4">
              <Tips
                iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
                tips={[
                  "Higher leverage increases both potential profit and risk. Ensure you understand the risks involved with leverage.",
                ]}
              />
            </div>
    
            {/* Action Buttons */}
            <div className="flex items-start self-stretch gap-4 mt-4">
              <SecondaryButton size="large" onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton size="large" onClick={onConfirm}>Confirm</PrimaryButton>
            </div>
          </div>
        </div>
      </div>
  );
  
};

export default AdjustLeverageModal;
