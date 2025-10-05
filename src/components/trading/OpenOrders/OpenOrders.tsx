import { useState } from 'react';
import { Order, OrderSide } from '../../../types/order';
import { useCancelOrder } from '../../../hooks/useCancelOrder';
import { formatPrice, formatSize } from '../../../utils/orderbookUtils';

interface OpenOrdersProps {
  market: string;
}

export default function OpenOrders({ market }: OpenOrdersProps) {
  const [orders] = useState<Order[]>([]);
  const { cancelOrder, cancelAllOrders, isCanceling } = useCancelOrder();

  const handleCancel = async (orderId: string, clientId?: string) => {
    if (confirm('确认撤销订单?')) await cancelOrder(orderId, clientId);
  };

  const handleCancelAll = async () => {
    if (confirm('确认撤销所有订单?')) await cancelAllOrders(market);
  };

  if (orders.length === 0) {
    return <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">暂无挂单</div>;
  }

  return (
    <div className="bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-semibold">当前订单 ({orders.length})</h3>
        <button onClick={handleCancelAll} disabled={isCanceling} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded">{isCanceling ? '撤销中...' : '全部撤销'}</button>
      </div>
      <div className="grid grid-cols-6 gap-2 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
        <div>时间</div><div>方向</div><div>类型</div><div>价格</div><div>数量</div><div>操作</div>
      </div>
      {orders.map(order => (
        <div key={order.id} className="grid grid-cols-6 gap-2 px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800">
          <div className="text-sm">{new Date(order.createdAt).toLocaleTimeString()}</div>
          <div className={`text-sm font-semibold ${order.side === OrderSide.BUY ? 'text-green-500' : 'text-red-500'}`}>{order.side === OrderSide.BUY ? '买入' : '卖出'}</div>
          <div className="text-sm">{order.type}</div>
          <div className="text-sm">{order.type === 'LIMIT' ? formatPrice(order.price) : '市价'}</div>
          <div className="text-sm">{formatSize(order.size)}</div>
          <button onClick={() => handleCancel(order.id, order.clientId)} className="px-3 py-1 text-sm text-red-400 hover:bg-red-900/20 rounded">撤销</button>
        </div>
      ))}
    </div>
  );
}
