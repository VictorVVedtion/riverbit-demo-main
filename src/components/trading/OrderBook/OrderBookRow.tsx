/**
 * OrderBook Row Component
 *
 * 订单簿单行组件,使用 React.memo 优化性能
 */

import { memo } from 'react';
import { OrderbookLevel } from '../../../types/orderbook';
import { formatPrice, formatSize } from '../../../utils/orderbookUtils';

interface OrderBookRowProps {
  /** 订单簿档位数据 */
  level: OrderbookLevel;
  /** 类型 (买盘/卖盘) */
  type: 'bid' | 'ask';
  /** 最大累计数量 (用于计算深度条百分比) */
  maxTotal: number;
  /** 价格小数位数 */
  priceDecimals?: number;
  /** 数量小数位数 */
  sizeDecimals?: number;
}

/**
 * 订单簿行组件
 */
function OrderBookRow({
  level,
  type,
  maxTotal,
  priceDecimals = 2,
  sizeDecimals = 4,
}: OrderBookRowProps) {
  const percentage =
    maxTotal > 0 ? (parseFloat(level.total) / maxTotal) * 100 : 0;

  const isBid = type === 'bid';

  return (
    <div className="relative px-4 py-1 hover:bg-gray-800/50 cursor-pointer transition-colors group">
      {/* 深度背景条 */}
      <div
        className={`absolute inset-y-0 right-0 transition-all duration-300 ${
          isBid
            ? 'bg-green-500/10 group-hover:bg-green-500/20'
            : 'bg-red-500/10 group-hover:bg-red-500/20'
        }`}
        style={{ width: `${percentage}%` }}
      />

      {/* 数据展示 */}
      <div className="relative grid grid-cols-3 gap-2 text-sm font-mono">
        {/* 价格 */}
        <div
          className={`font-semibold ${
            isBid ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {formatPrice(level.price, priceDecimals)}
        </div>

        {/* 数量 */}
        <div className="text-right text-gray-300">
          {formatSize(level.size, sizeDecimals)}
        </div>

        {/* 累计 */}
        <div className="text-right text-gray-400">
          {formatSize(level.total, sizeDecimals)}
        </div>
      </div>
    </div>
  );
}

export default memo(OrderBookRow);
