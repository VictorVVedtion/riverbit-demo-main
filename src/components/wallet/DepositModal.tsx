import { useCallback, useEffect, useMemo, useState } from 'react';
import { Contract, parseEther, parseUnits } from 'ethers';
import DEXWalletABI from '../../abis/DEXWallet.json';
import ERC20ABI from '../../abis/ERC20.json';
import {
  CONTRACT_ADDRESSES,
  SUPPORTED_TOKENS,
  type SupportedTokenSymbol,
  formatExplorerTxUrl,
  getTokenConfig,
} from '../../config/contracts';
import { useWallet } from '../../context/WalletContext';
import { fetchUSDCAllowance } from '../../utils/balances';
import {
  formatTokenAmount,
  isPositiveNumber,
  shortenAddress,
} from '../../utils/format';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormStatus = 'idle' | 'approving' | 'depositing' | 'success';

const extractErrorMessage = (error: unknown) => {
  if (!error) return '交易失败，请重试';
  if (typeof error === 'string') return error;
  const err = error as { message?: string; data?: { message?: string } };
  return err?.data?.message || err?.message || '交易失败，请重试';
};

const DepositModal = ({ isOpen, onClose }: DepositModalProps) => {
  const {
    account,
    isConnected,
    isCorrectNetwork,
    connectWallet,
    ensureCorrectNetwork,
    getProvider,
    getSigner,
    isConnecting,
    openWithdrawModal,
    balances,
    balancesLoading,
    refreshBalances: refreshWalletBalances,
  } = useWallet();

  const [selectedToken, setSelectedToken] = useState<SupportedTokenSymbol>('ETH');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<FormStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [allowanceLoading, setAllowanceLoading] = useState(false);

  const tokenMeta = useMemo(() => getTokenConfig(selectedToken), [selectedToken]);

  const parsedAmount = useMemo(() => {
    if (!isPositiveNumber(amount) || !tokenMeta) return 0n;
    try {
      return selectedToken === 'ETH'
        ? parseEther(amount)
        : parseUnits(amount, tokenMeta.decimals);
    } catch (err) {
      return 0n;
    }
  }, [amount, selectedToken, tokenMeta]);

  const needsApproval =
    selectedToken === 'USDC' && parsedAmount > 0n && parsedAmount > allowance;

  const canSubmit = useMemo(() => {
    if (!isPositiveNumber(amount) || parsedAmount === 0n) return false;
    if (status === 'depositing') return false;
    if (selectedToken === 'USDC' && needsApproval) return false;
    return true;
  }, [amount, needsApproval, parsedAmount, selectedToken, status]);

  const resetState = useCallback(() => {
    setAmount('');
    setStatus('idle');
    setError(null);
    setTxHash(null);
    setSelectedToken('ETH');
  }, []);

  const refreshAllowance = useCallback(async () => {
    if (!account || selectedToken !== 'USDC') return;
    try {
      setAllowanceLoading(true);
      const provider = await getProvider();
      const value = await fetchUSDCAllowance(provider, account);
      setAllowance(value);
    } catch (err) {
      console.warn('Failed to fetch allowance', err);
    } finally {
      setAllowanceLoading(false);
    }
  }, [account, getProvider, selectedToken]);

  useEffect(() => {
    if (!isOpen) return;
    if (account) {
      void refreshWalletBalances();
      void refreshAllowance();
    }
  }, [isOpen, account, selectedToken, refreshWalletBalances, refreshAllowance]);

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen, resetState]);

  const handleConnect = useCallback(async () => {
    try {
      await connectWallet();
      await ensureCorrectNetwork();
      await refreshWalletBalances();
      await refreshAllowance();
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  }, [connectWallet, ensureCorrectNetwork, refreshAllowance, refreshWalletBalances]);

  const handleApprove = useCallback(async () => {
    if (!account) {
      await handleConnect();
      return;
    }

    if (!isPositiveNumber(amount) || parsedAmount === 0n) {
      setError('请输入有效的存款金额');
      return;
    }

    setStatus('approving');
    setError(null);
    setTxHash(null);

    try {
      await ensureCorrectNetwork();
      const signer = await getSigner();
      const usdc = new Contract(CONTRACT_ADDRESSES.USDC, ERC20ABI, signer);
      const tx = await usdc.approve(CONTRACT_ADDRESSES.DEX_WALLET, parsedAmount);
      setTxHash(tx.hash);
      await tx.wait();
      await refreshAllowance();
      setStatus('idle');
    } catch (err) {
      setStatus('idle');
      setError(extractErrorMessage(err));
    }
  }, [
    account,
    amount,
    ensureCorrectNetwork,
    getSigner,
    parsedAmount,
    refreshAllowance,
    handleConnect,
  ]);

  const handleDeposit = useCallback(async () => {
    if (!account) {
      await handleConnect();
      return;
    }

    if (!isPositiveNumber(amount) || parsedAmount === 0n) {
      setError('请输入有效的存款金额');
      return;
    }

    if (selectedToken === 'USDC' && needsApproval) {
      setError('请先完成 USDC 授权');
      return;
    }

    setStatus('depositing');
    setError(null);

    try {
      await ensureCorrectNetwork();
      const signer = await getSigner();
      const dexWallet = new Contract(CONTRACT_ADDRESSES.DEX_WALLET, DEXWalletABI, signer);

      const tx =
        selectedToken === 'ETH'
          ? await dexWallet.depositETH({ value: parsedAmount })
          : await dexWallet.depositToken(CONTRACT_ADDRESSES.USDC, parsedAmount);

      setTxHash(tx.hash);
      await tx.wait();

      await refreshWalletBalances();
      if (selectedToken === 'USDC') {
        await refreshAllowance();
      }

      setStatus('success');
      setAmount('');
    } catch (err) {
      setStatus('idle');
      setError(extractErrorMessage(err));
    }
  }, [
    account,
    amount,
    ensureCorrectNetwork,
    getSigner,
    needsApproval,
    parsedAmount,
    refreshAllowance,
    refreshWalletBalances,
    selectedToken,
    handleConnect,
  ]);

  const handleClose = useCallback(() => {
    onClose();
    resetState();
  }, [onClose, resetState]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[#30363D] bg-zinc-950/95 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">存款到 RiverBit 钱包</h2>
            <p className="mt-1 text-sm text-zinc-400">
              支持 Arbitrum Sepolia 上的 ETH 与 USDC
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 transition-colors hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {account && (
            <div className="rounded-lg border border-[#30363D] bg-zinc-900/60 px-3 py-2 text-xs text-zinc-300">
              已连接钱包：<span className="font-mono text-white">{shortenAddress(account)}</span>
            </div>
          )}

          {!isConnected ? (
            <div className="rounded-lg border border-dashed border-[#30363D] bg-zinc-900/40 p-4 text-center">
              <p className="text-sm text-zinc-300">请先连接钱包以进行存款操作。</p>
              <button
                className="mt-3 w-full rounded-md bg-fuchsia-700 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-600 disabled:opacity-60"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? '连接中…' : '连接 MetaMask'}
              </button>
            </div>
          ) : !isCorrectNetwork ? (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
              当前网络不是 Arbitrum Sepolia。
              <button
                className="mt-3 w-full rounded-md bg-amber-500 py-2 text-sm font-semibold text-black transition hover:bg-amber-400"
                onClick={ensureCorrectNetwork}
              >
                切换网络
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs text-zinc-400">选择代币</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SUPPORTED_TOKENS.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => setSelectedToken(token.symbol)}
                      className={`rounded-md border px-3 py-2 text-sm transition ${
                        selectedToken === token.symbol
                          ? 'border-fuchsia-500 bg-fuchsia-500/20 text-white'
                          : 'border-[#30363D] bg-zinc-900/60 text-zinc-300 hover:border-zinc-600'
                      }`}
                    >
                      {token.symbol}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">存款金额</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError(null);
                  }}
                  placeholder="请输入金额"
                  className="mt-2 w-full rounded-md border border-[#30363D] bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-fuchsia-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  可用余额：
                  <span className="text-zinc-200">
                    {formatTokenAmount(balances.wallet[selectedToken], tokenMeta?.decimals ?? 18)}{' '}
                    {selectedToken}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-zinc-400">
                <div className="rounded-lg border border-[#30363D] bg-zinc-900/50 p-3">
                  <div className="text-zinc-500">DEX 钱包余额</div>
                  <div className="mt-1 font-medium text-white">
                    {balancesLoading
                      ? '加载中…'
                      : `${formatTokenAmount(balances.dex[selectedToken], tokenMeta?.decimals ?? 18)} ${selectedToken}`}
                  </div>
                </div>
                <div className="rounded-lg border border-[#30363D] bg-zinc-900/50 p-3">
                  <div className="text-zinc-500">钱包余额</div>
                  <div className="mt-1 font-medium text-white">
                    {balancesLoading
                      ? '加载中…'
                      : `${formatTokenAmount(balances.wallet[selectedToken], tokenMeta?.decimals ?? 18)} ${selectedToken}`}
                  </div>
                </div>
              </div>

              {selectedToken === 'USDC' && (
                <div className="rounded-lg border border-[#30363D] bg-zinc-900/60 p-3 text-xs text-zinc-300">
                  当前授权额度：
                  <span className="ml-1 font-mono text-white">
                    {allowanceLoading
                      ? '加载中…'
                      : `${formatTokenAmount(allowance, tokenMeta?.decimals ?? 6)} USDC`}
                  </span>
                  {needsApproval && (
                    <p className="mt-2 text-amber-300">
                      当前授权不足，请先点击“授权”按钮
                    </p>
                  )}
                  <button
                    className="mt-3 w-full rounded-md border border-fuchsia-500 bg-transparent py-2 text-sm font-semibold text-fuchsia-400 transition hover:bg-fuchsia-500/20 disabled:opacity-50"
                    onClick={handleApprove}
                    disabled={status !== 'idle'}
                  >
                    {status === 'approving' ? '授权中…' : '授权 USDC'}
                  </button>
                </div>
              )}

              {error && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {txHash && (
                <a
                  href={formatExplorerTxUrl(txHash)}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-2 text-xs text-fuchsia-200 transition hover:border-fuchsia-400"
                >
                  查看交易：{txHash.slice(0, 10)}…
                </a>
              )}

              <button
                className="w-full rounded-md bg-fuchsia-700 py-2.5 text-sm font-semibold text-white transition hover:bg-fuchsia-600 disabled:opacity-50"
                onClick={handleDeposit}
                disabled={!canSubmit}
              >
                {status === 'depositing' ? '提交中…' : '确认存款'}
              </button>

              {status === 'success' && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  存款已提交至网络，资金将在区块确认后可用。
                </div>
              )}

              <div className="text-right text-xs text-zinc-500">
                想要取款？
                <button
                  className="ml-2 text-fuchsia-400 underline-offset-2 hover:underline"
                  onClick={() => {
                    handleClose();
                    openWithdrawModal();
                  }}
                >
                  打开取款窗口
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
