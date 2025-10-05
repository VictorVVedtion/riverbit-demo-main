/**
 * Market Stats Component
 *
 * 24h 市场统计数据展示组件
 */

import { MarketStats as MarketStatsType } from '../../../types/orderbook';
import { formatPrice, formatVolume } from '../../../utils/orderbookUtils';

interface MarketStatsProps {
  /** 市场统计数据 */
  stats: MarketStatsType | null;
  /** 加载状态 */
  isLoading?: boolean;
}

/**
 * 市场统计组件
 */
export default function MarketStats({ stats, isLoading }: MarketStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-700 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const priceChange = parseFloat(stats.priceChange24h);
  const isPositive = priceChange >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
      {/* 24h 涨跌 */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h 涨跌</div>
        <div
          className={`text-lg font-bold ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isPositive ? '+' : ''}
          {stats.priceChangePercent24h}%
        </div>
        <div className={`text-xs ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}
          {formatPrice(stats.priceChange24h)}
        </div>
      </div>

      {/* 24h 最高 */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h 最高</div>
        <div className="text-lg font-bold text-gray-200">
          {formatPrice(stats.high24h)}
        </div>
      </div>

      {/* 24h 最低 */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h 最低</div>
        <div className="text-lg font-bold text-gray-200">
          {formatPrice(stats.low24h)}
        </div>
      </div>

      {/* 24h 成交量 */}
      <div>
        <div className="text-xs text-gray-400 mb-1">24h 成交量</div>
        <div className="text-lg font-bold text-gray-200">
          {formatVolume(stats.volume24h)}
        </div>
        <div className="text-xs text-gray-400">USDC</div>
      </div>
    </div>
  );
}
