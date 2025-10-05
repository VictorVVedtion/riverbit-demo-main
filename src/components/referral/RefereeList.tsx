import { useReferees } from '../../hooks/useReferees';
import Decimal from 'decimal.js';

export default function RefereeList() {
  const { referees } = useReferees();

  if (referees.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
        <p className="text-gray-400">暂无推荐人</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">推荐人列表</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 px-4 text-sm text-gray-400">地址</th>
              <th className="text-left py-3 px-4 text-sm text-gray-400">层级</th>
              <th className="text-right py-3 px-4 text-sm text-gray-400">交易量</th>
              <th className="text-right py-3 px-4 text-sm text-gray-400">手续费</th>
              <th className="text-right py-3 px-4 text-sm text-gray-400">我的收益</th>
              <th className="text-right py-3 px-4 text-sm text-gray-400">加入时间</th>
            </tr>
          </thead>
          <tbody>
            {referees.map((referee) => (
              <tr key={referee.address} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4 font-mono text-sm">
                  {referee.address.slice(0, 8)}...{referee.address.slice(-6)}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    referee.tier === 1 ? 'bg-blue-500/20 text-blue-400' :
                    referee.tier === 2 ? 'bg-purple-500/20 text-purple-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    Tier {referee.tier}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  {new Decimal(referee.tradingVolume).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right">
                  {new Decimal(referee.totalFees).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-green-500">
                  +{new Decimal(referee.myRevenue).toFixed(2)}
                </td>
                <td className="py-3 px-4 text-right text-sm text-gray-400">
                  {new Date(referee.joinedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
