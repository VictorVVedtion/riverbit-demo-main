// MobileHeader.tsx
import React from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import { useWallet } from "../context/WalletContext";
import { formatTokenAmount } from "../utils/format";

interface MobileHeaderProps {
  balance?: string;
  onDeposit?: () => void;
  onMenuToggle: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  balance = "$27,345.12",
  onDeposit,
  onMenuToggle,
}) => {
  const { openDepositModal, isConnected, isCorrectNetwork, balances, balancesLoading } = useWallet();

  const displayBalance = (() => {
    if (!isConnected || !isCorrectNetwork) {
      return balance;
    }
    if (balancesLoading) {
      return '加载中…';
    }
    const usdcDex = balances.dex.USDC;
    const ethDex = balances.dex.ETH;
    const usdcText = `${formatTokenAmount(usdcDex, 6)} USDC`;
    const ethText = ethDex > 0n ? ` / ${formatTokenAmount(ethDex, 18)} ETH` : '';
    return `${usdcText}${ethText}`;
  })();
  return (
    <div className="flex xl:hidden justify-between items-center self-stretch bg-zinc-900 py-3.5 px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <img
          src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/tsg0s0tv_expires_30_days.png"}
          className="w-[100px] h-8 object-fill"
          alt="Logo"
        />
      </div>

      {/* Right: Balance, Deposit, Hamburger */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col shrink-0 items-start">
          <span className="text-zinc-400 text-sm">{"Balance"}</span>
          <span className="text-white text-sm">{displayBalance}</span>
        </div>
        <PrimaryButton size="medium" onClick={onDeposit ?? openDepositModal}>Deposit</PrimaryButton>

        {/* Hamburger menu */}
        <button
          className="flex items-center justify-center p-2 rounded-sm focus:outline-none"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
