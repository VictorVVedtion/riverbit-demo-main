import React from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import WalletButton from '../components/wallet/WalletButton';
import BalanceDisplay from '../components/wallet/BalanceDisplay';

const Wallet: React.FC = () => {
  const { isConnected, address } = useRiverChain();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* 页头 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">钱包管理</h1>
          <p className="text-gray-400">连接您的 Keplr 或 Leap 钱包</p>
        </div>

        {/* 连接按钮 */}
        <div className="mb-8">
          <WalletButton />
        </div>

        {/* 连接状态 */}
        {isConnected && address && (
          <div className="space-y-6">
            {/* 余额卡片 */}
            <BalanceDisplay />

            {/* 地址信息 */}
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">您的地址</div>
              <div className="font-mono text-lg break-all">{address}</div>
            </div>

            {/* 网络信息 */}
            <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
              <div className="text-sm text-gray-400 mb-4">网络信息</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Chain ID:</span>
                  <span className="font-semibold">riverchain-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">RPC:</span>
                  <span className="font-mono text-sm">http://localhost:26657</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">REST:</span>
                  <span className="font-mono text-sm">http://localhost:1317</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 未连接提示 */}
        {!isConnected && (
          <div className="p-8 bg-gray-800 rounded-lg border border-gray-700 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">未连接钱包</h3>
            <p className="text-gray-400 mb-6">
              请点击上方按钮连接您的 Keplr 或 Leap 钱包以开始使用 RiverBit
            </p>
            <div className="text-sm text-gray-500">
              <p>确保您已安装:</p>
              <ul className="mt-2 space-y-1">
                <li>• Keplr 浏览器扩展</li>
                <li>• 或 Leap 浏览器扩展</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
