import { BrowserProvider, Contract } from 'ethers';
import DEXWalletABI from '../abis/DEXWallet.json';
import ERC20ABI from '../abis/ERC20.json';
import {
  CONTRACT_ADDRESSES,
  type SupportedTokenSymbol,
} from '../config/contracts';

export interface WalletBalanceSnapshot {
  wallet: Record<SupportedTokenSymbol, bigint>;
  dex: Record<SupportedTokenSymbol, bigint>;
}

export const fetchWalletSnapshot = async (
  provider: BrowserProvider,
  account: string,
): Promise<WalletBalanceSnapshot> => {
  const dexWallet = new Contract(CONTRACT_ADDRESSES.DEX_WALLET, DEXWalletABI, provider);
  const usdc = new Contract(CONTRACT_ADDRESSES.USDC, ERC20ABI, provider);

  const [walletEth, walletUsdc, dexEth, dexUsdc] = await Promise.all([
    provider.getBalance(account),
    usdc.balanceOf(account),
    dexWallet.balanceOf(account, CONTRACT_ADDRESSES.ETH),
    dexWallet.balanceOf(account, CONTRACT_ADDRESSES.USDC),
  ]);

  return {
    wallet: {
      ETH: walletEth as bigint,
      USDC: walletUsdc as bigint,
    },
    dex: {
      ETH: dexEth as bigint,
      USDC: dexUsdc as bigint,
    },
  };
};

export const fetchUSDCAllowance = async (
  provider: BrowserProvider,
  account: string,
): Promise<bigint> => {
  const usdc = new Contract(CONTRACT_ADDRESSES.USDC, ERC20ABI, provider);
  const allowance = await usdc.allowance(account, CONTRACT_ADDRESSES.DEX_WALLET);
  return allowance as bigint;
};
