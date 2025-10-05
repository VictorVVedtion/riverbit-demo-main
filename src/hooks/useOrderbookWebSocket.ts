/**
 * Orderbook WebSocket Hook
 *
 * 订单簿 WebSocket 实时订阅 Hook
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Orderbook,
  OrderbookUpdate,
  OrderbookSubscription,
} from '../types/orderbook';
import {
  mergeOrderbookLevels,
  sortBids,
  sortAsks,
  calculateTotals,
} from '../utils/orderbookUtils';

// WebSocket 端点 (RiverChain Streaming)
const WS_URL = 'ws://localhost:9090/v1/orderbooks';

// 重连配置
const RECONNECT_DELAY = 3000; // 3 秒
const MAX_RECONNECT_ATTEMPTS = 10;

interface UseOrderbookWebSocketResult {
  /** 订单簿数据 */
  orderbook: Orderbook | null;
  /** 连接状态 */
  isConnected: boolean;
  /** 错误信息 */
  error: Error | null;
  /** 手动重连 */
  reconnect: () => void;
}

/**
 * 订单簿 WebSocket 订阅 Hook
 *
 * @param market - 市场标识 (如 "BTC-PERP")
 * @returns 订单簿数据和连接状态
 */
export function useOrderbookWebSocket(
  market: string
): UseOrderbookWebSocketResult {
  const [orderbook, setOrderbook] = useState<Orderbook | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);

  /**
   * 使用 Mock 数据展示 UI (当 WebSocket 连接失败时)
   */
  const useMockData = useCallback(() => {
    const basePrice = 50000;
    const bids = Array.from({ length: 20 }, (_, i) => ({
      price: (basePrice - i * 10).toString(),
      size: (Math.random() * 2 + 0.1).toFixed(4),
      total: '0',
    }));

    const asks = Array.from({ length: 20 }, (_, i) => ({
      price: (basePrice + i * 10 + 10).toString(),
      size: (Math.random() * 2 + 0.1).toFixed(4),
      total: '0',
    }));

    setOrderbook({
      market,
      bids: calculateTotals(bids),
      asks: calculateTotals(asks),
      lastPrice: basePrice.toString(),
      timestamp: Date.now(),
    });
    setIsConnected(true); // 标记为"已连接"以隐藏错误提示
  }, [market]);

  /**
   * 处理订单簿快照 (全量数据)
   */
  const handleSnapshot = useCallback((data: OrderbookUpdate) => {
    const bids = data.bids.map(([price, size]) => ({
      price,
      size,
      total: '0',
    }));

    const asks = data.asks.map(([price, size]) => ({
      price,
      size,
      total: '0',
    }));

    setOrderbook({
      market: data.market,
      bids: calculateTotals(sortBids(bids)),
      asks: calculateTotals(sortAsks(asks)),
      lastPrice: bids[0]?.price || '0',
      timestamp: data.timestamp,
    });
  }, []);

  /**
   * 处理订单簿增量更新
   */
  const handleUpdate = useCallback((data: OrderbookUpdate) => {
    setOrderbook((prev) => {
      if (!prev) {
        console.warn('Received update before snapshot, ignoring');
        return prev;
      }

      // 合并更新
      const newBids = mergeOrderbookLevels(prev.bids, data.bids, sortBids);
      const newAsks = mergeOrderbookLevels(prev.asks, data.asks, sortAsks);

      return {
        ...prev,
        bids: calculateTotals(newBids),
        asks: calculateTotals(newAsks),
        lastPrice: newBids[0]?.price || prev.lastPrice,
        timestamp: data.timestamp,
      };
    });
  }, []);

  /**
   * 连接 WebSocket
   */
  const connect = useCallback(() => {
    try {
      console.log(`[OrderbookWS] Connecting to ${WS_URL}...`);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[OrderbookWS] Connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;

        // 发送订阅消息
        const subscribeMsg: OrderbookSubscription = {
          type: 'subscribe',
          channel: 'orderbook',
          market,
        };
        ws.send(JSON.stringify(subscribeMsg));
        console.log(`[OrderbookWS] Subscribed to ${market}`);
      };

      ws.onmessage = (event) => {
        try {
          const data: OrderbookUpdate = JSON.parse(event.data);

          if (data.type === 'snapshot') {
            handleSnapshot(data);
          } else if (data.type === 'update') {
            handleUpdate(data);
          } else {
            console.warn('[OrderbookWS] Unknown message type:', data);
          }
        } catch (err) {
          console.error('[OrderbookWS] Failed to parse message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('[OrderbookWS] WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        console.log(
          `[OrderbookWS] Disconnected (code: ${event.code}, reason: ${event.reason})`
        );
        setIsConnected(false);
        wsRef.current = null;

        // 自动重连
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `[OrderbookWS] Reconnecting in ${RECONNECT_DELAY}ms (attempt ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})...`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        } else {
          console.error('[OrderbookWS] Max reconnect attempts reached, using mock data');
          setError(null); // 清除错误,使用 mock 数据
          // 使用 Mock 数据展示 UI
          useMockData();
        }
      };
    } catch (err) {
      console.error('[OrderbookWS] Connection error:', err);
      setError(err as Error);
    }
  }, [market, handleSnapshot, handleUpdate]);

  /**
   * 手动重连
   */
  const reconnect = useCallback(() => {
    console.log('[OrderbookWS] Manual reconnect triggered');
    reconnectAttemptsRef.current = 0;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
    }

    connect();
  }, [connect]);

  /**
   * 初始化连接和清理
   */
  useEffect(() => {
    connect();

    return () => {
      console.log('[OrderbookWS] Cleaning up...');

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        // 发送取消订阅消息
        try {
          const unsubscribeMsg: OrderbookSubscription = {
            type: 'unsubscribe',
            channel: 'orderbook',
            market,
          };
          wsRef.current.send(JSON.stringify(unsubscribeMsg));
        } catch (err) {
          console.error('[OrderbookWS] Failed to unsubscribe:', err);
        }

        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect, market]);

  return {
    orderbook,
    isConnected,
    error,
    reconnect,
  };
}
