/**
 * Orderbook Type Definitions
 *
 * RiverBit v1.0 - Orderbook data structures
 */

/**
 * 订单簿单个档位
 */
export interface OrderbookLevel {
  /** 价格 (字符串避免精度问题) */
  price: string;
  /** 数量 */
  size: string;
  /** 累计数量 */
  total: string;
}

/**
 * 订单簿数据
 */
export interface Orderbook {
  /** 市场标识 (如 "BTC-PERP") */
  market: string;
  /** 买盘 (降序) */
  bids: OrderbookLevel[];
  /** 卖盘 (升序) */
  asks: OrderbookLevel[];
  /** 最新成交价 */
  lastPrice: string;
  /** 更新时间戳 (毫秒) */
  timestamp: number;
}

/**
 * 市场统计数据
 */
export interface MarketStats {
  /** 市场标识 */
  market: string;
  /** 最新成交价 */
  lastPrice: string;
  /** 24h 价格变化 */
  priceChange24h: string;
  /** 24h 涨跌幅 (百分比) */
  priceChangePercent24h: string;
  /** 24h 成交量 */
  volume24h: string;
  /** 24h 最高价 */
  high24h: string;
  /** 24h 最低价 */
  low24h: string;
}

/**
 * 价格聚合档位 (Tick Size)
 */
export type TickSize = 0.01 | 0.1 | 1 | 10;

/**
 * WebSocket 订单簿更新消息
 */
export interface OrderbookUpdate {
  /** 消息类型 */
  type: 'snapshot' | 'update';
  /** 市场标识 */
  market: string;
  /** 买盘更新 [价格, 数量] */
  bids: [string, string][];
  /** 卖盘更新 [价格, 数量] */
  asks: [string, string][];
  /** 时间戳 */
  timestamp: number;
}

/**
 * WebSocket 订阅消息
 */
export interface OrderbookSubscription {
  /** 消息类型 */
  type: 'subscribe' | 'unsubscribe';
  /** 频道 */
  channel: 'orderbook';
  /** 市场标识 */
  market: string;
}
