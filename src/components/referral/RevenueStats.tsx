import { useRevenue } from '../../hooks/useRevenue';
import { useReferees } from '../../hooks/useReferees';
import Decimal from 'decimal.js';

export default function RevenueStats() {
  const revenue = useRevenue();
  const { directCount, indirectCount } = useReferees();

  if (!revenue) return null;

  const totalRevenue = new Decimal(revenue.settled).plus(new Decimal(revenue.pending));

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-6">推荐收益</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">直接推荐</p>
          <p className="text-2xl font-bold">{directCount} 人</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">间接推荐</p>
          <p className="text-2xl font-bold">{indirectCount} 人</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">待结算</p>
          <p className="text-2xl font-bold text-yellow-500">
            {new Decimal(revenue.pending).toFixed(2)} USDC
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">已结算</p>
          <p className="text-2xl font-bold text-green-500">
            {new Decimal(revenue.settled).toFixed(2)} USDC
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-1">累计收益</p>
          <p className="text-2xl font-bold text-blue-500">
            {totalRevenue.toFixed(2)} USDC
          </p>
        </div>
      </div>

      {revenue.history.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-3">结算历史</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {revenue.history.map((record, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-800 rounded p-3">
                <div>
                  <p className="text-sm font-mono">{record.from.slice(0, 10)}...</p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleDateString()} · Tier {record.tier}
                  </p>
                </div>
                <p className="text-sm font-semibold text-green-500">
                  +{new Decimal(record.amount).toFixed(2)} USDC
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
