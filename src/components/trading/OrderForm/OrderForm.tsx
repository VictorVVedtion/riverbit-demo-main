import { useState, useMemo } from 'react';
import { usePlaceOrder } from '../../../hooks/usePlaceOrder';
import { useRiverChain } from '../../../contexts/RiverChainContext';
import { OrderType, OrderSide } from '../../../types/order';
import { calculateOrderSummary, validateOrderParams } from '../../../utils/orderUtils';

interface OrderFormProps {
  market: string;
  currentPrice: string;
}

export default function OrderForm({ market, currentPrice }: OrderFormProps) {
  const { balance } = useRiverChain();
  const { placeOrder, isPlacing, error } = usePlaceOrder();
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [type, setType] = useState<OrderType>(OrderType.LIMIT);
  const [price, setPrice] = useState(currentPrice);
  const [size, setSize] = useState('');
  const [leverage, setLeverage] = useState(10);

  const summary = useMemo(() => {
    if (!size) return null;
    const orderPrice = type === OrderType.MARKET ? '0' : price;
    return calculateOrderSummary({ market, type, side, price: orderPrice, size, leverage }, currentPrice);
  }, [size, price, currentPrice, type, leverage, side, market]);

  const handleSubmit = async () => {
    if (!size || !balance) return;
    const orderPrice = type === OrderType.MARKET ? '0' : price;
    const validation = validateOrderParams({ market, type, side, price: orderPrice, size, leverage }, balance, currentPrice);
    if (!validation.valid) { alert(validation.error); return; }
    const result = await placeOrder({ market, type, side, price: orderPrice, size, leverage });
    if (result) { alert(`订单已提交! ID: ${result.id}`); setSize(''); }
  };

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setSide(OrderSide.BUY)} className={`py-3 rounded font-semibold ${side === OrderSide.BUY ? 'bg-green-600 text-white' : 'bg-gray-800'}`}>买入</button>
        <button onClick={() => setSide(OrderSide.SELL)} className={`py-3 rounded font-semibold ${side === OrderSide.SELL ? 'bg-red-600 text-white' : 'bg-gray-800'}`}>卖出</button>
      </div>
      <div className="mb-4">
        <select value={type} onChange={(e) => setType(e.target.value as OrderType)} className="w-full px-3 py-2 bg-gray-800 rounded">
          <option value={OrderType.LIMIT}>限价单</option>
          <option value={OrderType.MARKET}>市价单</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm mb-2">杠杆: {leverage}x</label>
        <input type="range" min="1" max="20" value={leverage} onChange={(e) => setLeverage(parseInt(e.target.value))} className="w-full" />
      </div>
      {type === OrderType.LIMIT && (
        <div className="mb-4">
          <label className="block text-sm mb-2">价格</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-3 py-2 bg-gray-800 rounded" />
        </div>
      )}
      <div className="mb-4">
        <label className="block text-sm mb-2">数量</label>
        <input type="number" value={size} onChange={(e) => setSize(e.target.value)} placeholder="0.00" className="w-full px-3 py-2 bg-gray-800 rounded" />
      </div>
      {summary && (
        <div className="mb-4 p-3 bg-gray-800 rounded text-sm">
          <div className="flex justify-between mb-1"><span>保证金:</span><span>{summary.margin} USDC</span></div>
          <div className="flex justify-between mb-1"><span>手续费:</span><span>{summary.fee} USDC</span></div>
          <div className="flex justify-between font-bold"><span>总计:</span><span>{summary.total} USDC</span></div>
        </div>
      )}
      {error && <div className="mb-4 p-3 bg-red-900/20 text-red-400 text-sm rounded">{error.message}</div>}
      <button onClick={handleSubmit} disabled={isPlacing || !size} className={`w-full py-3 rounded font-semibold ${side === OrderSide.BUY ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}>
        {isPlacing ? '提交中...' : (side === OrderSide.BUY ? '买入' : '卖出')}
      </button>
    </div>
  );
}
