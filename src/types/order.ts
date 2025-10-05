/**
 * Order Type Definitions
 *
 * RiverBit v1.0 - 订单相关类型定义
 */

/**
 * 订单类型
 */
export enum OrderType {
  /** 市价单 */
  MARKET = 'MARKET',
  /** 限价单 */
  LIMIT = 'LIMIT',
}

/**
 * 订单方向
 */
export enum OrderSide {
  /** 买入 / 做多 */
  BUY = 'BUY',
  /** 卖出 / 做空 */
  SELL = 'SELL',
}

/**
 * 订单状态
 */
export enum OrderStatus {
  /** 待确认 (交易已提交,等待上链) */
  PENDING = 'PENDING',
  /** 已挂单 (订单已在订单簿中) */
  OPEN = 'OPEN',
  /** 完全成交 */
  FILLED = 'FILLED',
  /** 部分成交 */
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  /** 已撤销 */
  CANCELED = 'CANCELED',
  /** 失败 (余额不足、价格超限等) */
  FAILED = 'FAILED',
}

/**
 * Time In Force (订单有效期类型)
 */
export enum TimeInForce {
  /** Good Till Cancel - 一直有效直到撤销 */
  GTC = 'GTC',
  /** Immediate or Cancel - 立即成交,未成交部分撤销 */
  IOC = 'IOC',
  /** Fill or Kill - 完全成交或全部撤销 */
  FOK = 'FOK',
  /** Post Only - 只做 Maker (限价单专用) */
  POST_ONLY = 'POST_ONLY',
}

/**
 * 订单信息
 */
export interface Order {
  /** 订单 ID */
  id: string;
  /** 子账户 ID (地址) */
  subaccountId: string;
  /** 市场标识 (如 "BTC-PERP") */
  market: string;
  /** 订单类型 */
  type: OrderType;
  /** 订单方向 */
  side: OrderSide;
  /** 价格 (限价单) / '0' (市价单) */
  price: string;
  /** 订单数量 */
  size: string;
  /** 已成交数量 */
  filled: string;
  /** 订单状态 */
  status: OrderStatus;
  /** Time In Force */
  timeInForce?: TimeInForce;
  /** 是否只减仓 */
  reduceOnly?: boolean;
  /** 创建时间戳 (毫秒) */
  createdAt: number;
  /** 更新时间戳 (毫秒) */
  updatedAt: number;
  /** 交易哈希 */
  txHash?: string;
  /** 客户端 ID (用于去重) */
  clientId?: string;
}

/**
 * 下单参数
 */
export interface PlaceOrderParams {
  /** 市场标识 */
  market: string;
  /** 订单类型 */
  type: OrderType;
  /** 订单方向 */
  side: OrderSide;
  /** 价格 (限价单必填,市价单传 '0') */
  price: string;
  /** 数量 */
  size: string;
  /** 杠杆倍数 (1-20) */
  leverage: number;
  /** Time In Force (可选,默认 GTC) */
  timeInForce?: TimeInForce;
  /** 是否只减仓 (可选,默认 false) */
  reduceOnly?: boolean;
  /** 客户端 ID (可选,用于去重) */
  clientId?: string;
}

/**
 * 撤单参数
 */
export interface CancelOrderParams {
  /** 订单 ID */
  orderId: string;
  /** 市场标识 (批量撤单时可选) */
  market?: string;
}

/**
 * 订单摘要 (手续费、保证金等计算结果)
 */
export interface OrderSummary {
  /** 名义价值 (价格 * 数量) */
  notional: string;
  /** 所需保证金 (名义价值 / 杠杆) */
  margin: string;
  /** 预估手续费 */
  fee: string;
  /** 总计 (保证金 + 手续费) */
  total: string;
  /** 预估清算价 */
  liquidationPrice?: string;
}

/**
 * 手续费档位
 */
export interface FeeTier {
  /** 30天交易量下限 (USDC) */
  volumeThreshold: string;
  /** Maker 费率 (负数为返佣) */
  makerFee: string;
  /** Taker 费率 */
  takerFee: string;
}
