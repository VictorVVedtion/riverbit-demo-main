const env = import.meta.env;

const ARBITRUM_SEPOLIA_CHAIN_ID = 421614;
const ARBITRUM_SEPOLIA_CHAIN_HEX = `0x${ARBITRUM_SEPOLIA_CHAIN_ID.toString(16)}` as const;

export const NETWORK_CONFIG = {
  chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
  chainHex: ARBITRUM_SEPOLIA_CHAIN_HEX,
  name: 'Arbitrum Sepolia',
  rpcUrl:
    env?.VITE_ARBITRUM_SEPOLIA_RPC_URL?.trim() ||
    'https://arb-sepolia.g.alchemy.com/v2/w3svVdLMaBS42ZGbujrMm',
  blockExplorer: 'https://sepolia.arbiscan.io',
} as const;

export const CONTRACT_ADDRESSES = {
  DEX_WALLET:
    env?.VITE_DEX_WALLET_ADDRESS_ARBITRUM_SEPOLIA?.trim() ||
    '0x5C8204850Ca21Ffab42caeEB689f63f2d9B462c0',
  USDC:
    env?.VITE_USDC_ADDRESS_ARBITRUM_SEPOLIA?.trim() ||
    '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  ETH: '0x0000000000000000000000000000000000000000',
} as const;

export type SupportedTokenSymbol = 'ETH' | 'USDC';

export interface SupportedTokenMeta {
  symbol: SupportedTokenSymbol;
  address: `0x${string}`;
  decimals: number;
  displayName: string;
}

export const SUPPORTED_TOKENS = [
  {
    symbol: 'ETH',
    address: CONTRACT_ADDRESSES.ETH,
    decimals: 18,
    displayName: 'Ether (Arbitrum Sepolia)',
  },
  {
    symbol: 'USDC',
    address: CONTRACT_ADDRESSES.USDC,
    decimals: 6,
    displayName: 'USD Coin (Arbitrum Sepolia)',
  },
] as const satisfies ReadonlyArray<SupportedTokenMeta>;

export const getTokenConfig = (symbol: SupportedTokenSymbol) =>
  SUPPORTED_TOKENS.find((token) => token.symbol === symbol) || null;

export const formatExplorerTxUrl = (hash: string) =>
  `${NETWORK_CONFIG.blockExplorer}/tx/${hash}`;
