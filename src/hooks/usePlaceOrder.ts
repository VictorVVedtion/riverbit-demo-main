/**
 * usePlaceOrder Hook
 *
 * 下单 Hook - 支持市价单和限价单
 */

import { useState } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import {
  PlaceOrderParams,
  Order,
  OrderStatus,
  OrderType,
  OrderSide,
  TimeInForce,
} from '../types/order';
import { generateClientOrderId } from '../utils/orderUtils';
import Decimal from 'decimal.js';

interface UsePlaceOrderResult {
  /** 下单函数 */
  placeOrder: (params: PlaceOrderParams) => Promise<Order | null>;
  /** 是否正在下单 */
  isPlacing: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 下单 Hook
 *
 * @returns 下单函数和状态
 */
export function usePlaceOrder(): UsePlaceOrderResult {
  const { client, address } = useRiverChain();
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 清除错误
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 下单
   */
  const placeOrder = async (
    params: PlaceOrderParams
  ): Promise<Order | null> => {
    if (!client || !address) {
      const err = new Error('钱包未连接,请先连接钱包');
      setError(err);
      return null;
    }

    setIsPlacing(true);
    setError(null);

    try {
      console.log('[PlaceOrder] Params:', params);

      // 1. 生成客户端订单 ID
      const clientId = params.clientId || generateClientOrderId();

      // 2. 构建订单消息
      // 注意: 这里使用模拟的消息结构
      // 实际需要根据 RiverChain Proto 定义来构建
      const msg = {
        typeUrl: '/dydxprotocol.clob.MsgPlaceOrder', // dYdX v4 消息类型
        value: {
          order: {
            orderId: {
              subaccountId: {
                owner: address,
                number: 0, // 默认子账户
              },
              clientId: parseInt(clientId.replace(/\D/g, '').slice(0, 8)), // 转为数字
              clobPairId: 0, // TODO: 从 market 映射到 clobPairId
              orderFlags: 0,
            },
            side:
              params.side === OrderSide.BUY
                ? 1 // ORDER_SIDE_BUY
                : 2, // ORDER_SIDE_SELL
            quantums: new Decimal(params.size).times(1e6).toFixed(0), // 转为 quantums (6位小数)
            subticks:
              params.type === OrderType.MARKET
                ? '0'
                : new Decimal(params.price).times(1e6).toFixed(0),
            goodTilBlock:
              params.type === OrderType.MARKET ? undefined : 0, // 限价单不设置过期
            goodTilBlockTime:
              params.type === OrderType.MARKET
                ? Math.floor(Date.now() / 1000) + 60 // 市价单 60 秒过期
                : undefined,
            timeInForce:
              params.timeInForce === TimeInForce.IOC
                ? 1 // TIME_IN_FORCE_IOC
                : params.timeInForce === TimeInForce.POST_ONLY
                ? 2 // TIME_IN_FORCE_POST_ONLY
                : 0, // TIME_IN_FORCE_UNSPECIFIED (GTC)
            reduceOnly: params.reduceOnly || false,
            clientMetadata: 0,
          },
        },
      };

      console.log('[PlaceOrder] Message:', msg);

      // 3. 签名和广播
      const fee = {
        amount: [{ denom: 'stake', amount: '5000' }],
        gas: '200000',
      };

      const result = await client.signAndBroadcast(
        address,
        [msg],
        fee,
        `Place ${params.type} ${params.side} order: ${params.size} @ ${params.price}`
      );

      console.log('[PlaceOrder] Result:', result);

      // 4. 检查交易结果
      if (result.code !== 0) {
        throw new Error(`交易失败: ${result.rawLog || '未知错误'}`);
      }

      // 5. 从事件中提取订单 ID (如果可能)
      // dYdX v4 会在事件中返回订单 ID
      let orderId = clientId;
      try {
        const orderPlacedEvent = result.events?.find(
          (e) => e.type === 'order_placed' || e.type === 'message'
        );
        if (orderPlacedEvent) {
          const orderIdAttr = orderPlacedEvent.attributes.find(
            (a) => a.key === 'order_id' || a.key === 'client_id'
          );
          if (orderIdAttr?.value) {
            orderId = orderIdAttr.value;
          }
        }
      } catch (err) {
        console.warn('[PlaceOrder] Failed to extract order ID from events:', err);
      }

      // 6. 构建订单对象
      const order: Order = {
        id: orderId,
        subaccountId: address,
        market: params.market,
        type: params.type,
        side: params.side,
        price: params.price,
        size: params.size,
        filled: '0',
        status: OrderStatus.OPEN,
        timeInForce: params.timeInForce || TimeInForce.GTC,
        reduceOnly: params.reduceOnly || false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        txHash: result.transactionHash,
        clientId,
      };

      console.log('[PlaceOrder] Success:', order);
      return order;
    } catch (err) {
      console.error('[PlaceOrder] Error:', err);
      const error = err as Error;
      setError(error);
      return null;
    } finally {
      setIsPlacing(false);
    }
  };

  return {
    placeOrder,
    isPlacing,
    error,
    clearError,
  };
}
