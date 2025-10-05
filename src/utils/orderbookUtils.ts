/**
 * Orderbook Utilities
 *
 * 订单簿数据处理工具函数,使用 Decimal.js 确保精度
 */

import Decimal from 'decimal.js';
import { OrderbookLevel, TickSize } from '../types/orderbook';

/**
 * 聚合订单簿档位到指定精度
 *
 * @param levels - 原始订单簿档位
 * @param tickSize - 价格聚合精度
 * @returns 聚合后的订单簿档位
 */
export function aggregateOrderbook(
  levels: OrderbookLevel[],
  tickSize: TickSize
): OrderbookLevel[] {
  const aggregated = new Map<string, Decimal>();

  levels.forEach((level) => {
    const price = new Decimal(level.price);
    const size = new Decimal(level.size);

    // 价格向下取整到 tickSize
    const aggregatedPrice = price
      .dividedBy(tickSize)
      .floor()
      .times(tickSize)
      .toString();

    const existing = aggregated.get(aggregatedPrice) || new Decimal(0);
    aggregated.set(aggregatedPrice, existing.plus(size));
  });

  // 转换为数组
  return Array.from(aggregated.entries()).map(([price, size]) => ({
    price,
    size: size.toString(),
    total: '0', // 后续计算累计
  }));
}

/**
 * 计算订单簿累计数量
 *
 * @param levels - 订单簿档位
 * @returns 包含累计数量的订单簿档位
 */
export function calculateTotals(levels: OrderbookLevel[]): OrderbookLevel[] {
  let total = new Decimal(0);

  return levels.map((level) => {
    total = total.plus(new Decimal(level.size));
    return {
      ...level,
      total: total.toString(),
    };
  });
}

/**
 * 格式化价格显示
 *
 * @param price - 价格字符串
 * @param decimals - 小数位数
 * @returns 格式化后的价格
 */
export function formatPrice(price: string, decimals: number = 2): string {
  return new Decimal(price).toFixed(decimals);
}

/**
 * 格式化数量显示
 *
 * @param size - 数量字符串
 * @param decimals - 小数位数
 * @returns 格式化后的数量
 */
export function formatSize(size: string, decimals: number = 4): string {
  return new Decimal(size).toFixed(decimals);
}

/**
 * 格式化成交量 (带千位分隔符)
 *
 * @param volume - 成交量字符串
 * @param decimals - 小数位数
 * @returns 格式化后的成交量
 */
export function formatVolume(volume: string, decimals: number = 2): string {
  const value = new Decimal(volume);
  const parts = value.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/**
 * 计算价格变化百分比
 *
 * @param currentPrice - 当前价格
 * @param previousPrice - 之前价格
 * @returns 百分比变化 (如 "+2.56" 或 "-1.23")
 */
export function calculatePriceChangePercent(
  currentPrice: string,
  previousPrice: string
): string {
  const current = new Decimal(currentPrice);
  const previous = new Decimal(previousPrice);

  if (previous.isZero()) return '0.00';

  const change = current.minus(previous).dividedBy(previous).times(100);
  const sign = change.isPositive() ? '+' : '';
  return sign + change.toFixed(2);
}

/**
 * 排序买盘 (降序)
 *
 * @param bids - 买盘档位
 * @returns 排序后的买盘
 */
export function sortBids(bids: OrderbookLevel[]): OrderbookLevel[] {
  return [...bids].sort((a, b) => {
    return new Decimal(b.price).minus(new Decimal(a.price)).toNumber();
  });
}

/**
 * 排序卖盘 (升序)
 *
 * @param asks - 卖盘档位
 * @returns 排序后的卖盘
 */
export function sortAsks(asks: OrderbookLevel[]): OrderbookLevel[] {
  return [...asks].sort((a, b) => {
    return new Decimal(a.price).minus(new Decimal(b.price)).toNumber();
  });
}

/**
 * 合并订单簿增量更新
 *
 * @param levels - 现有档位
 * @param updates - 更新档位 [价格, 数量]
 * @param sortFn - 排序函数
 * @returns 更新后的档位
 */
export function mergeOrderbookLevels(
  levels: OrderbookLevel[],
  updates: [string, string][],
  sortFn: (levels: OrderbookLevel[]) => OrderbookLevel[]
): OrderbookLevel[] {
  const levelMap = new Map<string, OrderbookLevel>();

  // 加载现有档位
  levels.forEach((level) => {
    levelMap.set(level.price, level);
  });

  // 应用更新
  updates.forEach(([price, size]) => {
    if (size === '0' || new Decimal(size).isZero()) {
      // 删除档位
      levelMap.delete(price);
    } else {
      // 更新或插入档位
      levelMap.set(price, {
        price,
        size,
        total: '0', // 后续重新计算
      });
    }
  });

  // 转换为数组并排序
  return sortFn(Array.from(levelMap.values()));
}
