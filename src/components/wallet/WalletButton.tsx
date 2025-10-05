import React from 'react';
import { useRiverChain } from '../../contexts/RiverChainContext';

const WalletButton: React.FC = () => {
  const { address, connect, disconnect, isConnected, isConnecting } = useRiverChain();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-6)}`;
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <span className="text-sm font-mono text-green-400">
            {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
        >
          断开连接
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold"
    >
      {isConnecting ? '连接中...' : '连接钱包'}
    </button>
  );
};

export default WalletButton;
