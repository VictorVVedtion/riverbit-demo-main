import { usePositions } from '../../../hooks/usePositions';
import { useClosePosition } from '../../../hooks/useClosePosition';
import { PositionSide } from '../../../types/position';
import { formatPrice, formatSize } from '../../../utils/orderbookUtils';

interface PositionsProps {
  market?: string;
}

export default function Positions({ market }: PositionsProps) {
  const { positions, totalUnrealizedPnl } = usePositions(market);
  const { closePosition, isClosing } = useClosePosition();

  const handleClose = async (market: string, size: string) => {
    const success = await closePosition(market, size);
    if (success) alert('平仓成功');
  };

  if (positions.length === 0) {
    return <div className="bg-gray-900 rounded-lg p-8 text-center text-gray-400">暂无持仓</div>;
  }

  const pnlPositive = parseFloat(totalUnrealizedPnl) >= 0;

  return (
    <div className="bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="font-semibold">当前仓位</h3>
        <div className="text-sm">
          总未实现盈亏: <span className={pnlPositive ? 'text-green-500' : 'text-red-500'}>{pnlPositive ? '+' : ''}{totalUnrealizedPnl} USDC</span>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-2 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
        <div>市场</div><div>方向</div><div>数量</div><div>入场价</div><div>标记价</div><div>强平价</div><div>未实现盈亏</div><div>操作</div>
      </div>
      {positions.map(pos => {
        const isLong = pos.side === PositionSide.LONG;
        const pnl = parseFloat(pos.unrealizedPnl);
        return (
          <div key={pos.market} className="grid grid-cols-8 gap-2 px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800">
            <div className="text-sm">{pos.market}</div>
            <div className={`text-sm font-semibold ${isLong ? 'text-green-500' : 'text-red-500'}`}>{isLong ? '做多' : '做空'}</div>
            <div className="text-sm">{formatSize(pos.size)}</div>
            <div className="text-sm">{formatPrice(pos.entryPrice)}</div>
            <div className="text-sm">{formatPrice(pos.markPrice)}</div>
            <div className="text-sm text-red-400">{formatPrice(pos.liquidationPrice)}</div>
            <div className={`text-sm font-semibold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>{pnl >= 0 ? '+' : ''}{pos.unrealizedPnl}</div>
            <button onClick={() => handleClose(pos.market, pos.size)} disabled={isClosing} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 rounded disabled:opacity-50">{isClosing ? '平仓中...' : '平仓'}</button>
          </div>
        );
      })}
    </div>
  );
}