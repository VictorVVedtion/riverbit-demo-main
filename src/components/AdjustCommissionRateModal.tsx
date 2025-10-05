import PrimaryButton from "./Button/PrimaryButton";
import { SecondaryButton } from "./Button/SecondaryButton";
import Tips from "./Tips"; // Assuming you have a Tips component

type AdjustCommissionRateModalProps = {
  userAddress: string;
  commissionRate: number;
  onClose?: () => void;
  onConfirm?: () => void;
  setCommissionRate?: (val: number) => void;
  setUserAddress?: (val: string) => void;
};

const AdjustCommissionRateModal = ({
  userAddress,
  commissionRate = 30, // default fallback
  onClose,
  onConfirm,
  setCommissionRate,
  setUserAddress,
}: AdjustCommissionRateModalProps) => {
  return (
    <div className="w-full flex flex-col items-center self-stretch bg-[#000000B0] py-[197px]">
      <div className="w-full m-0 md:m-auto flex flex-col bg-[#272B2F] h-[100vh] md:h-auto py-[1px] rounded-lg border border-solid border-gray-700">
        
        {/* Header */}
        <div className="flex items-center self-stretch p-6 mx-[1px]">
          <span className="flex-1 text-white text-lg font-bold">
            Adjust Commission Rate
          </span>
          <img
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/73d3cc65_expires_30_days.png"
            className="w-11 h-11 object-fill cursor-pointer"
            onClick={onClose}
            alt="Close"
          />
        </div>

        <div className="m-6 gap-4">
          {/* User Address Input */}
          <div className="flex flex-col items-start self-stretch gap-2">
            <span className="text-[#9D9DAF] text-xs">User Address</span>
            <input
              placeholder="0x555…666"
              value={userAddress}
              onChange={(event) => setUserAddress(event.target.value)}
              className="self-stretch text-white bg-[#0D1117] text-base py-3 pl-3 pr-6 rounded-md border border-solid border-[#30363D]"
            />
          </div>

          {/* Commission Rate Input */}
          <div className="flex flex-col items-start self-stretch gap-2">
            <span className="text-[#9D9DAF] text-xs">
              Commission Rate (Max 40%)
            </span>
            <div className="relative w-full">
              <input
                type="number"
                min={0}
                max={40}
                value={commissionRate}
                onChange={(event) =>
                  setCommissionRate(Number(event.target.value))
                }
                className="w-full text-white bg-[#0D1117] text-base py-3 pl-3 pr-10 rounded-md border border-solid border-[#30363D]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white">%</span>
            </div>
          </div>

          {/* Tips */}
          <div className="w-full mt-4">
            <Tips
              iconUrl="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/1uh405kh_expires_30_days.png"
              tips={[
                "Your Net Commission = 40% – Rate Assigned to Sub-user",
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-start self-stretch gap-4 mt-4">
            <SecondaryButton size="large" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton size="large" onClick={onConfirm}>
              Confirm
            </PrimaryButton>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AdjustCommissionRateModal;
