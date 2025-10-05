import React from 'react';
import { useRiverChain } from '../../contexts/RiverChainContext';

const BalanceDisplay: React.FC = () => {
  const { balance, isConnected } = useRiverChain();

  if (!isConnected || balance === null) {
    return null;
  }

  const formatBalance = (amount: string) => {
    // 将 stake (6 decimals) 转换为 STAKE
    const num = Number(amount) / 1_000_000;
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="px-6 py-4 bg-gray-800 rounded-lg border border-gray-700">
      <div className="text-sm text-gray-400 mb-1">余额</div>
      <div className="text-2xl font-bold text-white">
        {formatBalance(balance)} <span className="text-lg text-gray-400">STAKE</span>
      </div>
    </div>
  );
};

export default BalanceDisplay;
