import React from "react";
import { useState } from "react";
import ToggleButton from "./ToggleButton";
import PrimaryButton from "./Button/PrimaryButton";
interface InfoRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueColor = "text-white" }) => (
  <div className="flex items-center self-stretch">
    <span className="flex-1 text-[#9D9DAF] text-sm text-left">{label}</span>
    <span className={`${valueColor} text-sm`}>{value}</span>
  </div>
);

interface ModalData {
  time: string; 
  coin: string;
  position: string | number;
  entryPrice: string;
  markPrice: string;
  takeProfit: string;
  expectedProfit: string;
}

const PositionsTPSLModal = ({
  data,            // Object with position info
  inputTPSLPrice,          // Stop Loss Price input value
  onChangeInputTPSLPrice,  // Stop Loss Price input handler
  inputTPSLPercent,          // Stop Loss % input value
  onChangeInputTPSLPercent,  // Stop Loss % input handler
  onClose,         // Optional: close modal handler
  onConfirm        // Confirm button handler
}: { 
  data: ModalData; 
  inputTPSLPrice: string; 
  onChangeInputTPSLPrice: (val: string) => void; 
  inputTPSLPercent: string; 
  onChangeInputTPSLPercent: (val: string) => void; 
  onClose: () => void; 
  onConfirm?: () => void; 
}) => {
  const {
    time: _time,
    coin,
    position,
    entryPrice,
    markPrice,
    takeProfit,
    expectedProfit,
  } = data;
  const [allocatedAmount, setAllocatedAmount] = useState(false);
  const [limitPrice, setLimitPrice] = useState(false);
  return (
    <div className="w-full flex flex-col items-center self-stretch bg-[#000000B0] py-[197px]">
      <div className="w-full m-0 md:m-auto flex flex-col bg-[#272B2F] h-[100vh] md:h-auto py-[1px] rounded-lg border border-solid border-gray-700">
        
        {/* Header */}
        <div className="flex items-center self-stretch p-6 mx-[1px]">
          <span className="flex-1 text-white text-lg font-bold">Positions TP/SL</span>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/73d3cc65_expires_30_days.png"
            className="w-11 h-11 object-fill cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Info Rows */}
        <div className="flex flex-col self-stretch pb-6 px-6 mx-[1px] gap-4">
          <div className="flex flex-col self-stretch pt-4 gap-1">
            <InfoRow label="Coin" value={coin} />
            <InfoRow label="Position" value={position} />
            <InfoRow label="Entry Price" value={entryPrice} />
            <InfoRow label="Mark Price" value={markPrice} />
            <InfoRow label="Take Profit" value={takeProfit} />
            <div className="flex flex-col items-end self-stretch">
              <span className="text-[#9D9DAF] text-xs mr-[3px]">
                Expected Profit: {expectedProfit}
              </span>
            </div>
          </div>

          {/* Stop Loss Inputs */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
              <div className="flex flex-col gap-2 min-w-0 text-left">
                  <span className="text-[#9D9DAF] text-sm">Stop Loss Price</span>
                  <input
                  type="number"
                  placeholder="240.00"
                  value={inputTPSLPrice}
                  onChange={(e) => onChangeInputTPSLPrice(e.target.value)}
                  className="w-full text-white bg-zinc-950 text-base p-3 rounded-sm border border-[#30363D] focus:outline-none"
                  />
              </div>
              <div className="flex flex-col gap-2 min-w-0 text-left">
                  <span className="text-[#9D9DAF] text-sm">Stop Loss %</span>
                  <div className="flex items-center bg-zinc-950 p-3 rounded-sm border border-[#30363D] w-full">
                  <input
                    type="number"
                    placeholder="%"
                    value={inputTPSLPercent}
                    onChange={(e) => onChangeInputTPSLPercent(e.target.value)}
                    className="flex-1 text-white bg-transparent text-base font-bold border-0 focus:outline-none min-w-0"
                  />
                  <span className="text-white text-base ml-2">%</span>
                  </div>
              </div>
          </div>

          {/* Allocated & Limit */}
          <div className="flex items-start self-stretch gap-3">
            <ToggleButton
              label="Allocated Amount"
              value={allocatedAmount}
              onChange={setAllocatedAmount}
            />

            <ToggleButton
              label="Limit Price"
              value={limitPrice}
              onChange={setLimitPrice}
            />
          </div>

          {/* Confirm Button */}
          <PrimaryButton size="large" onClick={onConfirm}>
            Confirm
          </PrimaryButton>
        </div>

        {/* Info Text */}
        <span className="text-[#8B949E] text-sm my-4 mx-[17px]">
          By default, take-profit and stop-loss orders apply to the entire position. Once the position is closed, TP/SL orders will be automatically cancelled. When the take-profit or stop-loss price is reached, a market order will be triggered.
          If a fixed order size is configured, the TP/SL order will always be executed with that size, regardless of future changes in the position.
        </span>
      </div>
    </div>
  );
};

export default PositionsTPSLModal;
