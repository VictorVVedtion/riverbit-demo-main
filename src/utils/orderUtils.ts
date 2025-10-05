/**
 * Order Utilities
 *
 * 订单相关工具函数
 */

import Decimal from 'decimal.js';
import {
  OrderType,
  OrderSide,
  OrderSummary,
  PlaceOrderParams,
  FeeTier,
} from '../types/order';

/**
 * 默认手续费档位 (RiverBit v1.0)
 */
export const DEFAULT_FEE_TIERS: FeeTier[] = [
  {
    volumeThreshold: '0',
    makerFee: '-0.0001', // -0.01% (返佣)
    takerFee: '0.0005',  // 0.05%
  },
  {
    volumeThreshold: '1000000', // 100万 USDC
    makerFee: '-0.00015',
    takerFee: '0.0004',
  },
  {
    volumeThreshold: '5000000', // 500万 USDC
    makerFee: '-0.0002',
    takerFee: '0.0003',
  },
];

/**
 * 计算订单摘要 (保证金、手续费等)
 *
 * @param params - 下单参数
 * @param currentPrice - 当前市场价格 (用于市价单计算)
 * @param feeTier - 手续费档位 (可选)
 * @returns 订单摘要
 */
export function calculateOrderSummary(
  params: PlaceOrderParams,
  currentPrice: string,
  feeTier: FeeTier = DEFAULT_FEE_TIERS[0]
): OrderSummary {
  const { type, side, price, size, leverage } = params;

  // 1. 计算成交价格
  const executionPrice = new Decimal(
    type === OrderType.MARKET ? currentPrice : price
  );

  // 2. 计算名义价值
  const sizeDecimal = new Decimal(size);
  const notional = sizeDecimal.times(executionPrice);

  // 3. 计算所需保证金
  const margin = notional.dividedBy(leverage);

  // 4. 计算手续费
  const feeRate = new Decimal(
    type === OrderType.LIMIT ? feeTier.makerFee : feeTier.takerFee
  );
  const fee = notional.times(feeRate).abs(); // 绝对值 (返佣也显示为正数)

  // 5. 计算总计
  const total = margin.plus(fee);

  // 6. 计算清算价
  const liquidationPrice = calculateLiquidationPrice(
    executionPrice,
    leverage,
    side
  );

  return {
    notional: notional.toString(),
    margin: margin.toString(),
    fee: fee.toString(),
    total: total.toString(),
    liquidationPrice: liquidationPrice.toString(),
  };
}

/**
 * 计算清算价
 *
 * @param entryPrice - 开仓价格
 * @param leverage - 杠杆倍数
 * @param side - 订单方向
 * @returns 清算价
 */
export function calculateLiquidationPrice(
  entryPrice: string | Decimal,
  leverage: number,
  side: OrderSide
): Decimal {
  const price = new Decimal(entryPrice);
  const maintenanceMarginRate = new Decimal(0.03); // 3% 维持保证金率

  if (side === OrderSide.BUY) {
    // 做多清算价 = 开仓价 * (1 - 1/杠杆 + 维持保证金率)
    const factor = new Decimal(1)
      .minus(new Decimal(1).dividedBy(leverage))
      .plus(maintenanceMarginRate);
    return price.times(factor);
  } else {
    // 做空清算价 = 开仓价 * (1 + 1/杠杆 - 维持保证金率)
    const factor = new Decimal(1)
      .plus(new Decimal(1).dividedBy(leverage))
      .minus(maintenanceMarginRate);
    return price.times(factor);
  }
}

/**
 * 计算最大可开仓数量
 *
 * @param balance - 可用余额
 * @param price - 开仓价格
 * @param leverage - 杠杆倍数
 * @param feeTier - 手续费档位
 * @returns 最大数量
 */
export function calculateMaxSize(
  balance: string,
  price: string,
  leverage: number,
  feeTier: FeeTier = DEFAULT_FEE_TIERS[0]
): Decimal {
  const balanceDecimal = new Decimal(balance);
  const priceDecimal = new Decimal(price);
  const feeRate = new Decimal(feeTier.takerFee).abs();

  // 可用于开仓的余额 = 余额 / (1 + 手续费率)
  const effectiveBalance = balanceDecimal.dividedBy(
    new Decimal(1).plus(feeRate)
  );

  // 最大数量 = (有效余额 * 杠杆) / 价格
  return effectiveBalance.times(leverage).dividedBy(priceDecimal);
}

/**
 * 验证订单参数
 *
 * @param params - 下单参数
 * @param balance - 可用余额
 * @param currentPrice - 当前市场价格
 * @returns 验证结果 { valid: boolean, error?: string }
 */
export function validateOrderParams(
  params: PlaceOrderParams,
  balance: string,
  currentPrice: string
): { valid: boolean; error?: string } {
  const { type, price, size, leverage } = params;

  // 1. 验证数量
  const sizeDecimal = new Decimal(size);
  if (sizeDecimal.isZero() || sizeDecimal.isNegative()) {
    return { valid: false, error: '数量必须大于 0' };
  }

  // 2. 验证价格 (限价单)
  if (type === OrderType.LIMIT) {
    const priceDecimal = new Decimal(price);
    if (priceDecimal.isZero() || priceDecimal.isNegative()) {
      return { valid: false, error: '价格必须大于 0' };
    }

    // 价格不能偏离市场价太远 (±10%)
    const currentPriceDecimal = new Decimal(currentPrice);
    const deviation = priceDecimal
      .minus(currentPriceDecimal)
      .dividedBy(currentPriceDecimal)
      .abs();

    if (deviation.gt(0.1)) {
      return {
        valid: false,
        error: '价格偏离市场价超过 10%,请检查输入',
      };
    }
  }

  // 3. 验证杠杆
  if (leverage < 1 || leverage > 20) {
    return { valid: false, error: '杠杆倍数必须在 1-20 之间' };
  }

  // 4. 验证余额
  const summary = calculateOrderSummary(params, currentPrice);
  const balanceDecimal = new Decimal(balance);

  if (balanceDecimal.lt(summary.total)) {
    return {
      valid: false,
      error: `余额不足。所需: ${summary.total} USDC, 可用: ${balance} USDC`,
    };
  }

  return { valid: true };
}

/**
 * 格式化订单方向显示
 */
export function formatOrderSide(side: OrderSide): string {
  return side === OrderSide.BUY ? '买入 / 做多' : '卖出 / 做空';
}

/**
 * 格式化订单类型显示
 */
export function formatOrderType(type: OrderType): string {
  return type === OrderType.MARKET ? '市价单' : '限价单';
}

/**
 * 生成客户端订单 ID (用于去重)
 */
export function generateClientOrderId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
