/**
 * TickSize Selector Component
 *
 * 价格聚合精度选择器
 */

import { TickSize } from '../../../types/orderbook';

interface TickSizeSelectorProps {
  /** 当前选中的精度 */
  value: TickSize;
  /** 精度变化回调 */
  onChange: (tickSize: TickSize) => void;
}

/**
 * 价格聚合精度选择器
 */
export default function TickSizeSelector({
  value,
  onChange,
}: TickSizeSelectorProps) {
  const options: TickSize[] = [0.01, 0.1, 1, 10];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-400">精度:</span>
      <select
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) as TickSize)}
        className="px-2 py-1 text-xs bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-blue-500 hover:border-gray-600 transition-colors cursor-pointer"
        aria-label="选择价格精度"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt >= 1 ? opt.toFixed(0) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}
