/**
 * OrderBook Component
 *
 * 实时订单簿主组件
 */

import { useState, useMemo } from 'react';
import { useOrderbookWebSocket } from '../../../hooks/useOrderbookWebSocket';
import { aggregateOrderbook, calculateTotals } from '../../../utils/orderbookUtils';
import { TickSize } from '../../../types/orderbook';
import OrderBookRow from './OrderBookRow';
import TickSizeSelector from './TickSizeSelector';

interface OrderBookProps {
  /** 市场标识 (如 "BTC-PERP") */
  market: string;
  /** 展示档位数量 (默认 20) */
  depthLevels?: number;
}

/**
 * 订单簿组件
 */
export default function OrderBook({ market, depthLevels = 20 }: OrderBookProps) {
  const { orderbook, isConnected, error, reconnect } = useOrderbookWebSocket(market);
  const [tickSize, setTickSize] = useState<TickSize>(0.1);

  // 聚合和计算订单簿
  const { bids, asks, maxTotal } = useMemo(() => {
    if (!orderbook) {
      return { bids: [], asks: [], maxTotal: 0 };
    }

    // 聚合档位
    const aggregatedBids = aggregateOrderbook(orderbook.bids, tickSize);
    const aggregatedAsks = aggregateOrderbook(orderbook.asks, tickSize);

    // 计算累计并截取深度
    const processedBids = calculateTotals(aggregatedBids).slice(0, depthLevels);
    const processedAsks = calculateTotals(aggregatedAsks).slice(0, depthLevels);

    // 计算最大累计值 (用于深度条)
    const maxBidTotal = parseFloat(processedBids[processedBids.length - 1]?.total || '0');
    const maxAskTotal = parseFloat(processedAsks[processedAsks.length - 1]?.total || '0');
    const maxTotalValue = Math.max(maxBidTotal, maxAskTotal);

    return {
      bids: processedBids,
      asks: processedAsks,
      maxTotal: maxTotalValue,
    };
  }, [orderbook, tickSize, depthLevels]);

  // 错误状态
  if (error) {
    return (
      <div className="flex flex-col h-full bg-gray-900 rounded-lg p-6">
        <div className="p-4 bg-red-900/20 border border-red-500 rounded">
          <p className="text-red-400 mb-2">订单簿连接失败</p>
          <p className="text-sm text-gray-400 mb-4">{error.message}</p>
          <button
            onClick={reconnect}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
          >
            重新连接
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (!orderbook) {
    return (
      <div className="flex flex-col h-full bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-700 border-t-blue-500 mb-4" />
            <p className="text-gray-400">加载订单簿...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden">
      {/* 头部 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold">订单簿</h3>
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`}
              title={isConnected ? '已连接' : '未连接'}
            />
            <span className="text-xs text-gray-400">
              {isConnected ? '实时' : '离线'}
            </span>
          </div>
        </div>
        <TickSizeSelector value={tickSize} onChange={setTickSize} />
      </div>

      {/* 列标题 */}
      <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
        <div>价格 (USDC)</div>
        <div className="text-right">数量</div>
        <div className="text-right">总计</div>
      </div>

      {/* 卖盘 (倒序展示,价格从低到高) */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {[...asks].reverse().map((level, index) => (
          <OrderBookRow
            key={`ask-${level.price}-${index}`}
            level={level}
            type="ask"
            maxTotal={maxTotal}
          />
        ))}
      </div>

      {/* 最新成交价 */}
      <div className="px-4 py-3 bg-gray-800 border-y border-gray-700">
        <div className="flex items-baseline space-x-2">
          <div className="text-2xl font-bold text-green-500 font-mono">
            {orderbook.lastPrice}
          </div>
          <div className="text-sm text-gray-400">USDC</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">最新成交</div>
      </div>

      {/* 买盘 */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {bids.map((level, index) => (
          <OrderBookRow
            key={`bid-${level.price}-${index}`}
            level={level}
            type="bid"
            maxTotal={maxTotal}
          />
        ))}
      </div>
    </div>
  );
}
