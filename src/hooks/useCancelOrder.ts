/**
 * useCancelOrder Hook
 *
 * 撤单 Hook - 支持单个撤单和批量撤单
 */

import { useState } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';

interface UseCancelOrderResult {
  /** 撤销单个订单 */
  cancelOrder: (orderId: string, clientId?: string) => Promise<boolean>;
  /** 撤销所有订单 (按市场) */
  cancelAllOrders: (market?: string) => Promise<boolean>;
  /** 是否正在撤单 */
  isCanceling: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 清除错误 */
  clearError: () => void;
}

/**
 * 撤单 Hook
 *
 * @returns 撤单函数和状态
 */
export function useCancelOrder(): UseCancelOrderResult {
  const { client, address } = useRiverChain();
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 清除错误
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 撤销单个订单
   */
  const cancelOrder = async (
    orderId: string,
    clientId?: string
  ): Promise<boolean> => {
    if (!client || !address) {
      setError(new Error('钱包未连接,请先连接钱包'));
      return false;
    }

    setIsCanceling(true);
    setError(null);

    try {
      console.log('[CancelOrder] Order ID:', orderId, 'Client ID:', clientId);

      // 构建撤单消息
      // 注意: 这里使用模拟的消息结构
      // 实际需要根据 RiverChain Proto 定义来构建
      const msg = {
        typeUrl: '/dydxprotocol.clob.MsgCancelOrder',
        value: {
          orderId: {
            subaccountId: {
              owner: address,
              number: 0, // 默认子账户
            },
            clientId: clientId ? parseInt(clientId.replace(/\D/g, '').slice(0, 8)) : parseInt(orderId.replace(/\D/g, '').slice(0, 8)),
            clobPairId: 0, // TODO: 从订单获取
            orderFlags: 0,
          },
          goodTilBlock: 0,
          goodTilBlockTime: Math.floor(Date.now() / 1000) + 60, // 60秒有效期
        },
      };

      console.log('[CancelOrder] Message:', msg);

      // 签名和广播
      const fee = {
        amount: [{ denom: 'stake', amount: '5000' }],
        gas: '200000',
      };

      const result = await client.signAndBroadcast(
        address,
        [msg],
        fee,
        `Cancel order: ${orderId}`
      );

      console.log('[CancelOrder] Result:', result);

      if (result.code !== 0) {
        throw new Error(`撤单失败: ${result.rawLog || '未知错误'}`);
      }

      console.log('[CancelOrder] Success');
      return true;
    } catch (err) {
      console.error('[CancelOrder] Error:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsCanceling(false);
    }
  };

  /**
   * 撤销所有订单
   */
  const cancelAllOrders = async (market?: string): Promise<boolean> => {
    if (!client || !address) {
      setError(new Error('钱包未连接,请先连接钱包'));
      return false;
    }

    setIsCanceling(true);
    setError(null);

    try {
      console.log('[CancelAllOrders] Market:', market);

      // 构建批量撤单消息
      const msg = {
        typeUrl: '/dydxprotocol.clob.MsgBatchCancel',
        value: {
          subaccountId: {
            owner: address,
            number: 0,
          },
          // 如果指定市场,只撤销该市场的订单
          // 否则撤销所有市场
          clobPairId: market ? 0 : undefined, // TODO: 从 market 映射
          goodTilBlock: Math.floor(Date.now() / 1000) + 60,
        },
      };

      console.log('[CancelAllOrders] Message:', msg);

      // 签名和广播
      const fee = {
        amount: [{ denom: 'stake', amount: '10000' }], // 批量操作费用略高
        gas: '400000',
      };

      const result = await client.signAndBroadcast(
        address,
        [msg],
        fee,
        market ? `Cancel all orders in ${market}` : 'Cancel all orders'
      );

      console.log('[CancelAllOrders] Result:', result);

      if (result.code !== 0) {
        throw new Error(`批量撤单失败: ${result.rawLog || '未知错误'}`);
      }

      console.log('[CancelAllOrders] Success');
      return true;
    } catch (err) {
      console.error('[CancelAllOrders] Error:', err);
      setError(err as Error);
      return false;
    } finally {
      setIsCanceling(false);
    }
  };

  return {
    cancelOrder,
    cancelAllOrders,
    isCanceling,
    error,
    clearError,
  };
}
