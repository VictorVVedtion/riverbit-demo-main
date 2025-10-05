import { useRef, useState, useEffect } from "react";
import PrimaryButton from "../components/Button/PrimaryButton";
import { SecondaryButton } from "../components/Button/SecondaryButton";
import { preloadTranslate, translatePage, revertPage } from "../utils/translatePage";
import { useWallet } from "../context/WalletContext";
import { formatTokenAmount, shortenAddress } from "../utils/format";

interface DesktopNavRightProps {
  balance: string;
  points: string;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function DesktopNavRight({
  balance,
  points,
  language,
  setLanguage,
}: DesktopNavRightProps) {
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const walletDropdownRef = useRef<HTMLDivElement | null>(null);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  const {
    account,
    isConnected,
    isCorrectNetwork,
    isConnecting,
    connectWallet,
    disconnectWallet,
    ensureCorrectNetwork,
    openDepositModal,
    openWithdrawModal,
    balances,
    balancesLoading,
  } = useWallet();

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

  const handleWithdraw = () => {
    openWithdrawModal();
  };

  const handleDeposit = () => {
    openDepositModal();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setShowWalletDropdown(false);
  };

  // ✅ 頁面載入時 preload 翻譯 cache
  useEffect(() => {
    preloadTranslate("en", "zh-CN");
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Balance */}
      <div className="flex flex-col shrink-0 items-start">
        <span className="text-zinc-400 text-sm">Balance</span>
        <span className="text-white text-sm">{displayBalance}</span>
      </div>
      <div className="w-[1px] h-8 hidden xl:block" />
      {/* Points */}
      <div className="flex flex-col shrink-0 items-start">
        <span className="text-zinc-400 text-sm">Points</span>
        <span className="text-white text-sm">{points}</span>
      </div>


      <div className="flex items-center gap-4">
        {/* Wallet */}
        <div className="relative" ref={walletDropdownRef}>
          <button
            className="flex shrink-0 items-center bg-zinc-900 py-2.5 px-3 gap-2 rounded-sm border border-solid border-[#30363D] text-sm text-white hover:border-zinc-600"
            onClick={async () => {
              if (!isConnected) {
                try {
                  await connectWallet();
                  setShowWalletDropdown(true);
                } catch (err) {
                  console.error('Failed to connect wallet', err);
                }
              } else {
                setShowWalletDropdown((v) => !v);
              }
            }}
            disabled={isConnecting}
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/7ru13dyc_expires_30_days.png"
              className="w-5 h-5 rounded-sm object-fill"
            />
            <span className="hidden md:inline font-semibold">
              {isConnecting
                ? "连接中…"
                : isConnected && account
                ? shortenAddress(account)
                : "Connect"}
            </span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/wbxxcfe7_expires_30_days.png"
              className="w-3 h-[15px] rounded-sm object-fill"
            />
          </button>
          {showWalletDropdown && (
            <div className="absolute right-0 mt-2 z-50 min-w-48 bg-zinc-900 border border-[#30363D] rounded shadow-lg">
              <div className="px-4 py-3 text-sm text-zinc-300 border-b border-[#30363D]">
                <div className="font-semibold text-white">{account ? shortenAddress(account) : "未连接"}</div>
                {isConnected && !isCorrectNetwork && (
                  <div className="mt-1 text-xs text-amber-400">网络未切换到 Arbitrum Sepolia</div>
                )}
              </div>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:text-zinc-600"
                onClick={async () => {
                  if (!isCorrectNetwork) {
                    await ensureCorrectNetwork();
                  }
                  setShowWalletDropdown(false);
                }}
                disabled={isCorrectNetwork}
              >
                切换到 Arbitrum Sepolia
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 disabled:text-zinc-600"
                onClick={() => {
                  if (account && navigator?.clipboard) {
                    navigator.clipboard.writeText(account).catch((err) =>
                      console.warn('复制地址失败', err),
                    );
                  }
                  setShowWalletDropdown(false);
                }}
                disabled={!account}
              >
                复制地址
              </button>
              <button
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                onClick={handleDisconnectWallet}
              >
                断开连接
              </button>
            </div>
          )}
        </div>

        {/* Language */}
        <div className="relative" ref={langDropdownRef}>
          <button
            className="flex shrink-0 items-center bg-zinc-900 text-left py-2.5 px-4 gap-2.5 rounded-sm border border-solid border-[#30363D]"
            onClick={() => setShowLangDropdown((v) => !v)}
          >
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/oyc1zap7_expires_30_days.png"
              className="w-3.5 h-[19px] rounded-sm object-fill"
            />
            <span className="text-[#C9D1D9] text-sm">{language}</span>
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ZlYhP85oka/qdm0wdb6_expires_30_days.png"
              className="w-3 h-[15px] object-fill"
            />
          </button>
          {showLangDropdown && (
            <div className="absolute right-0 mt-2 z-50 min-w-[100px] bg-zinc-900 border border-[#30363D] rounded shadow-lg">
            {["EN", "中文"].map((lang) => (
              <button
                key={lang}
                className={`w-full text-left px-4 py-2 hover:bg-zinc-800 text-sm ${
                  language === lang ? "text-fuchsia-400 font-bold" : "text-white"
                }`}
                onClick={() => {
                  setLanguage(lang);
                  setShowLangDropdown(false);
          
                  if (lang === "中文") {
                    translatePage(); // 用 cache，幾乎即時
                  } else {
                    revertPage(); // 還原
                  }
                }}
              >
                {lang}
              </button>
            ))}
          </div>
          
          )}
        </div>

        {/* Withdraw & Deposit */}
        <div className="flex gap-2">
          <SecondaryButton size="medium" onClick={handleWithdraw}>
            Withdraw
          </SecondaryButton>
          <PrimaryButton size="medium" onClick={handleDeposit}>
            Deposit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
