import { formatUnits } from 'ethers';

export const shortenAddress = (address: string, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
};

export const formatTokenAmount = (
  amount: bigint,
  decimals: number,
  precision = 4,
) => {
  if (!amount) return '0';
  const formatted = formatUnits(amount, decimals);
  const [whole, fraction = ''] = formatted.split('.');
  const trimmedFraction = fraction.slice(0, precision).replace(/0+$/, '');
  return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
};

export const isPositiveNumber = (value: string) => {
  if (!value) return false;
  const num = Number(value);
  return Number.isFinite(num) && num > 0;
};
