import { useState } from 'react';
import { useRevenue } from '../../hooks/useRevenue';
import { useRiverChain } from '../../contexts/RiverChainContext';
import Decimal from 'decimal.js';

export default function WithdrawRevenue() {
  const revenue = useRevenue();
  const { client, address } = useRiverChain();
  const [amount, setAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const handleWithdraw = async () => {
    if (!client || !address) return;

    setIsWithdrawing(true);
    try {
      const msg = {
        typeUrl: '/riverchain.revshare.v1.MsgWithdrawRevenue',
        value: {
          address,
          amount: new Decimal(amount).times(1e6).toString(),
        },
      };

      const result = await client.signAndBroadcast(address, [msg], 'auto');

      if (result.code === 0) {
        alert('提取成功!');
        setAmount('');
      }
    } catch (err) {
      console.error(err);
      alert('提取失败');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(availableBalance);
  };

  if (!revenue) return null;

  const availableBalance = revenue.settled;
  const minAmount = 10;
  const isAmountValid = amount && parseFloat(amount) >= minAmount && parseFloat(amount) <= parseFloat(availableBalance);

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-4">提取收益</h3>

      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-2">
          可提取余额: <span className="text-white font-semibold">{new Decimal(availableBalance).toFixed(2)} USDC</span>
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`最小 ${minAmount} USDC`}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            MAX
          </button>
        </div>
        {amount && parseFloat(amount) < minAmount && (
          <p className="text-sm text-red-500 mt-1">最小提取金额为 {minAmount} USDC</p>
        )}
        {amount && parseFloat(amount) > parseFloat(availableBalance) && (
          <p className="text-sm text-red-500 mt-1">余额不足</p>
        )}
      </div>

      <button
        onClick={handleWithdraw}
        disabled={isWithdrawing || !isAmountValid}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isWithdrawing ? '提取中...' : '提取到主账户'}
      </button>

      <p className="text-xs text-gray-500 mt-3 text-center">
        提取将在下一个区块确认后到账
      </p>
    </div>
  );
}
